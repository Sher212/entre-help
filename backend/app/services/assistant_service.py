from typing import Dict, Any, List, Optional
from app.schemas import AssistantQueryRequest, AssistantQueryResponse, EntrepreneurProfile
from app.services.scheme_service import scheme_service
from app.services.channel_partner_service import channel_partner_service
from app.services.loan_calculator_service import loan_calculator_service
from app.schemas import LoanCalculationRequest


class AIAssistantOrchestrator:
    def process_query(self, req: AssistantQueryRequest) -> AssistantQueryResponse:
        text = req.message.strip().lower()
        prof = req.farmer_profile or EntrepreneurProfile()

        # 1. Scheme Eligibility Intent
        if any(k in text for k in ["scheme", "yojana", "eligible", "eligibility", "loan", "subsidy", "grant", "financial", "benefit", "apply", "nsfdc", "mudra", "stand up", "pmegp"]):
            matched = scheme_service.match_for_profile(prof)
            tools = ["Scheme Matching Engine (44 Schemes)", "Profile Eligibility Scorer"]

            top_schemes = matched[:5]
            schemes_text = "\n\n".join([
                f"🏛️ **{i+1}. {s.scheme_name}** ({s.category}) — **{(s.match_score * 100):.0f}% Match**\n"
                f"  - **Benefit:** {s.benefits}\n"
                f"  - **Why You Qualify:** {s.match_reasons[0] if s.match_reasons else 'General eligibility'}\n"
                f"  - **How to Apply:** {s.application_process}\n"
                f"  - 🔗 [{s.short_name} Portal]({s.official_url})"
                for i, s in enumerate(top_schemes)
            ])

            reply = (
                f"**🏛️ Top Schemes for {prof.name} ({prof.social_category}, {prof.gender}, ₹{prof.annual_income:,.0f}/yr, {prof.state}):**\n\n"
                f"{schemes_text}\n\n"
                f"📊 **Total Eligible Schemes:** {len(matched)} of {len(scheme_service.schemes_raw)}\n\n"
                f"⚠️ *Always verify eligibility on [MyScheme.gov.in](https://www.myscheme.gov.in) before applying. Direct applications to NSFDC/NSTFDC are not accepted — apply through your Channel Partner.*"
            )
            followups = ["Find my nearest Channel Partner", "Calculate loan EMI for NSFDC Term Loan", "What documents do I need?", "Schemes for women entrepreneurs"]
            return AssistantQueryResponse(
                reply=reply,
                detected_intent="Scheme Eligibility Matching",
                tools_used=tools,
                structured_data={"schemes": [s.model_dump() for s in top_schemes]},
                suggested_followups=followups
            )

        # 2. Channel Partner / Where to Apply Intent
        elif any(k in text for k in ["channel partner", "sca", "bank", "where to apply", "kahan", "agent", "office", "nearest", "contact"]):
            partners = channel_partner_service.get_partners_for_state(prof.state)
            tools = ["Channel Partner Locator (33 Partners)", "State-wise Partner Finder"]

            if partners:
                partners_text = "\n".join([
                    f"  • **{p.name}** ({p.type}) — 📞 {p.contact or 'Contact via state portal'} | 📍 {p.address or p.state}"
                    for p in partners[:5]
                ])
            else:
                partners_text = f"  No specific partners found for {prof.state}. Try applying through any nationalized bank (SBI, PNB, BOB)."

            reply = (
                f"**📍 Channel Partners in {prof.state}:**\n\n"
                f"{partners_text}\n\n"
                f"**ℹ️ How to Apply:**\n"
                f"1. Visit your nearest SCA or authorized bank branch\n"
                f"2. Carry: Caste Certificate, Income Certificate, Aadhaar, Project Report\n"
                f"3. The SCA/Bank will forward your application to NSFDC/NSTFDC\n"
                f"4. Loan is sanctioned after verification by the corporation\n\n"
                f"⚠️ *Remember: NSFDC/NSTFDC do NOT accept direct applications. Always apply through a Channel Partner.*"
            )
            followups = ["Which schemes am I eligible for?", "What documents do I need?", "Calculate my loan EMI"]
            return AssistantQueryResponse(
                reply=reply,
                detected_intent="Channel Partner Locator",
                tools_used=tools,
                structured_data={"partners": [p.model_dump() for p in partners[:5]]},
                suggested_followups=followups
            )

        # 3. Loan / EMI Calculator Intent
        elif any(k in text for k in ["emi", "calculate", "interest", "repay", "installment", "kitna", "amount", "loan amount", "margin"]):
            tools = ["Loan EMI Calculator", "Interest Rate Engine"]

            # Try to find a scheme reference in the text
            matched = scheme_service.match_for_profile(prof)
            top_scheme = matched[0] if matched else None

            if top_scheme:
                try:
                    calc = loan_calculator_service.calculate(LoanCalculationRequest(
                        scheme_id=top_scheme.id,
                        project_cost=prof.project_cost,
                        annual_income=prof.annual_income,
                        social_category=prof.social_category,
                        gender=prof.gender
                    ))

                    reply = (
                        f"**💰 Loan Calculation for {calc.scheme_name}:**\n\n"
                        f"| Component | Amount |\n"
                        f"|-----------|--------|\n"
                        f"| Project Cost | ₹{calc.project_cost:,.0f} |\n"
                        f"| Loan Amount | ₹{calc.loan_amount:,.0f} |\n"
                        f"| Your Contribution | ₹{calc.beneficiary_contribution:,.0f} |\n"
                        f"| Interest Rate | {calc.interest_rate}% p.a. |\n"
                        f"| Monthly EMI | ₹{calc.monthly_emi:,.0f} |\n"
                        f"| Repayment Period | {calc.repayment_years} years |\n"
                        f"| Moratorium | {calc.moratorium_months} months |\n\n"
                        + ("✅ **Women rebate applied:** 0.5% interest reduction.\n\n" if calc.women_rebate_applied else "")
                        + "\n".join([f"📌 {n}" for n in calc.breakdown_notes])
                    )
                except Exception as e:
                    reply = f"Unable to calculate loan: {str(e)}"
            else:
                reply = "I couldn't find a matching scheme for your profile to calculate the loan. Please update your profile or specify a scheme name."

            followups = ["Show all eligible schemes", "Find nearest Channel Partner", "What documents do I need to apply?"]
            return AssistantQueryResponse(
                reply=reply,
                detected_intent="Loan & EMI Calculator",
                tools_used=tools,
                structured_data=None,
                suggested_followups=followups
            )

        # 4. Documents Required Intent
        elif any(k in text for k in ["document", "dastavez", "papers", "certificate", "proof", "kagaz"]):
            tools = ["Document Requirements Engine"]

            matched = scheme_service.match_for_profile(prof)
            top = matched[0] if matched else None

            if top and top.documents_required:
                docs_text = "\n".join([f"  {i+1}. {d}" for i, d in enumerate(top.documents_required)])
                reply = (
                    f"**📄 Documents Required for {top.scheme_name}:**\n\n"
                    f"{docs_text}\n\n"
                    f"**💡 Tip:** Get your Caste Certificate and Income Certificate from your District Magistrate / Tehsildar office. "
                    f"Project Report can be prepared with help from your SCA or KVIC office."
                )
            else:
                reply = (
                    "**📄 Common Documents for MoSJE Schemes:**\n\n"
                    "  1. Caste Certificate (SC/ST/OBC as applicable)\n"
                    "  2. Annual Income Certificate (< ₹5 Lakh)\n"
                    "  3. Aadhaar Card\n"
                    "  4. Project Report / Business Plan\n"
                    "  5. Bank Account Details (Nationalized Bank)\n"
                    "  6. Address Proof\n"
                    "  7. Passport Size Photographs\n"
                    "  8. Quotations for Machinery/Equipment (if applicable)"
                )

            followups = ["Which schemes am I eligible for?", "Find nearest Channel Partner", "Calculate my loan EMI"]
            return AssistantQueryResponse(
                reply=reply,
                detected_intent="Document Requirements",
                tools_used=tools,
                structured_data=None,
                suggested_followups=followups
            )

        # 5. Default — Welcome & Help
        else:
            tools = ["Entre Help AI Assistant"]
            reply = (
                f"Namaste {prof.name}! 🙏 I am your **Entre Help AI Assistant**.\n\n"
                f"I help marginalized entrepreneurs discover government financial schemes, calculate loans, and find the right Channel Partner to apply through.\n\n"
                f"Here are questions you can ask me:\n"
                f"- *'Which government schemes am I eligible for?'*\n"
                f"- *'Find my nearest Channel Partner in {prof.state}'*\n"
                f"- *'Calculate loan EMI for my ₹{prof.project_cost:,.0f} project'*\n"
                f"- *'What documents do I need to apply?'*\n"
                f"- *'Tell me about NSFDC Term Loan'*\n"
                f"- *'Schemes for SC/ST/OBC/Women/PwD entrepreneurs'*"
            )
            followups = [
                "Which schemes am I eligible for?",
                f"Find Channel Partners in {prof.state}",
                "Calculate my loan EMI",
                "What documents do I need?"
            ]
            return AssistantQueryResponse(
                reply=reply,
                detected_intent="Welcome & Navigation",
                tools_used=tools,
                structured_data=None,
                suggested_followups=followups
            )


assistant_service = AIAssistantOrchestrator()
