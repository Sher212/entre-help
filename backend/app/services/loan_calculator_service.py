import math
from typing import List
from app.schemas import LoanCalculationRequest, LoanCalculationResponse
from app.services.scheme_service import scheme_service


class LoanCalculatorService:
    def calculate(self, req: LoanCalculationRequest) -> LoanCalculationResponse:
        """
        Calculate loan breakdown based on scheme terms and entrepreneur profile.
        Computes: loan amount, beneficiary contribution, interest rate, EMI, total repayable.
        """
        scheme = scheme_service.get_scheme_by_id(req.scheme_id)
        if not scheme:
            raise ValueError(f"Scheme '{req.scheme_id}' not found.")

        scheme_name = scheme.get("scheme_name", "Unknown")
        project_cost = req.project_cost

        # ── Determine coverage percentage ──
        nsfdc_share = scheme.get("nsfdc_share_percent", 0)
        beneficiary_share = scheme.get("beneficiary_share_percent", 0)
        max_loan = scheme.get("max_loan_amount", 0)

        # Calculate loan amount
        if nsfdc_share and nsfdc_share > 0:
            loan_amount = project_cost * (nsfdc_share / 100.0)
        elif max_loan and max_loan > 0:
            loan_amount = min(project_cost, max_loan)
        else:
            loan_amount = project_cost  # Full coverage (e.g. MUDRA)

        # Cap at max loan amount
        if max_loan and max_loan > 0:
            loan_amount = min(loan_amount, max_loan)

        # Beneficiary contribution (margin money)
        if beneficiary_share and beneficiary_share > 0:
            beneficiary_contribution = project_cost * (beneficiary_share / 100.0)
        else:
            beneficiary_contribution = project_cost - loan_amount

        # Subsidy / grant component (for schemes like PMEGP that provide subsidy)
        subsidy = 0.0
        scheme_id = req.scheme_id.lower()
        if "pmegp" in scheme_id:
            # PMEGP subsidy: 25% general, 35% special category (SC/ST/OBC/Women/PwD)
            if req.social_category.upper() in ["SC", "ST", "OBC", "MINORITY"] or req.gender.lower() == "female":
                subsidy = project_cost * 0.35
            else:
                subsidy = project_cost * 0.25
            loan_amount = project_cost - subsidy - beneficiary_contribution

        # ── Interest Rate ──
        rate_min = scheme.get("interest_rate_min", 0) or 0
        rate_max = scheme.get("interest_rate_max", 0) or 0

        # Determine applicable rate based on loan slab
        if rate_min == 0 and rate_max == 0:
            interest_rate = 0.0  # No interest specified (e.g. MUDRA — bank decides)
        elif loan_amount <= 500000:
            interest_rate = rate_min
        elif loan_amount <= 1000000:
            interest_rate = (rate_min + rate_max) / 2
        else:
            interest_rate = rate_max

        # Women rebate (0.5% reduction for many NSFDC schemes)
        women_rebate = False
        if req.gender.lower() == "female" and interest_rate > 0:
            if "nsfdc" in scheme_id or "nstfdc" in scheme_id or "nbcfdc" in scheme_id:
                interest_rate -= 0.5
                women_rebate = True

        interest_rate = max(0, interest_rate)

        # ── Repayment Terms ──
        repayment_years = scheme.get("repayment_years", 5) or 5
        moratorium_months = scheme.get("moratorium_months", 6) or 6

        # ── EMI Calculation ──
        if interest_rate > 0 and loan_amount > 0:
            monthly_rate = interest_rate / 100.0 / 12.0
            n_payments = repayment_years * 12
            if monthly_rate > 0:
                emi = loan_amount * monthly_rate * math.pow(1 + monthly_rate, n_payments) / (math.pow(1 + monthly_rate, n_payments) - 1)
            else:
                emi = loan_amount / n_payments
        else:
            emi = loan_amount / (repayment_years * 12) if loan_amount > 0 else 0.0

        total_repayable = emi * repayment_years * 12

        # ── Build Notes ──
        notes = []
        notes.append(f"Scheme covers {nsfdc_share}% of project cost." if nsfdc_share else f"Max loan: ₹{max_loan:,.0f}" if max_loan else "Coverage varies by bank.")
        if women_rebate:
            notes.append("0.5% interest rebate applied for women entrepreneurs.")
        if moratorium_months > 0:
            notes.append(f"EMI starts after {moratorium_months}-month moratorium period.")
        if subsidy > 0:
            notes.append(f"Government subsidy of ₹{subsidy:,.0f} applied.")
        notes.append("Apply through your nearest Channel Partner (SCA/PSB/RRB). Direct applications are not accepted.")

        return LoanCalculationResponse(
            scheme_name=scheme_name,
            project_cost=round(project_cost, 2),
            loan_amount=round(loan_amount, 2),
            subsidy_or_grant=round(subsidy, 2),
            beneficiary_contribution=round(beneficiary_contribution, 2),
            interest_rate=round(interest_rate, 2),
            monthly_emi=round(emi, 2),
            repayment_years=repayment_years,
            moratorium_months=moratorium_months,
            total_repayable=round(total_repayable, 2),
            women_rebate_applied=women_rebate,
            breakdown_notes=notes
        )


loan_calculator_service = LoanCalculatorService()
