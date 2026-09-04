import json
import os

schemes_path = os.path.join(os.path.dirname(__file__), "mosje_schemes.json")

with open(schemes_path, "r", encoding="utf-8") as f:
    existing_schemes = json.load(f)

existing_ids = {s["id"] for s in existing_schemes}

additional_schemes = [
    # ── NATIONAL STARTUP & INNOVATION SCHEMES (Open to General/EWS & All Categories) ──
    {
        "id": "sisfs",
        "scheme_name": "Startup India Seed Fund Scheme (SISFS)",
        "short_name": "SISFS",
        "category": "Startup Seed Grant",
        "sponsoring_agency": "DPIIT / Ministry of Commerce and Industry",
        "level": "Central",
        "target_beneficiaries": "DPIIT-recognized early-stage startups for proof of concept, prototype development, and market entry",
        "description": "National flagship seed funding scheme providing up to ₹20 Lakhs grant for validation/prototyping and up to ₹50 Lakhs debt/convertible debenture for commercialization via incubators.",
        "benefits": "Up to ₹20 Lakhs non-dilutive grant (Proof of Concept) + Up to ₹50 Lakhs convertible debt (Market Entry). No collateral required.",
        "max_project_cost": 5000000,
        "max_loan_amount": 5000000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 6.0,
        "repayment_years": 5,
        "moratorium_months": 12,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women", "Minorities"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 65,
            "project_types": ["Technology Startup", "Agritech", "Fintech", "Healthtech", "Deeptech", "Manufacturing", "AI/ML", "Clean Energy"],
            "states": ["All States"],
            "exclusions": "Company incorporated > 2 years ago, non-DPIIT registered"
        },
        "documents_required": ["DPIIT Certificate of Recognition", "Certificate of Incorporation / Private Limited registration", "Pitch Deck", "Business Plan", "Founder KYC"],
        "application_process": "Apply online at seedfund.startupindia.gov.in by selecting approved incubators.",
        "official_url": "https://seedfund.startupindia.gov.in/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/sisfs",
        "helpdesk_contact": "1800-115-565"
    },
    {
        "id": "birac-big",
        "scheme_name": "BIRAC Biotechnology Ignition Grant (BIG)",
        "short_name": "BIRAC-BIG",
        "category": "Startup Seed Grant",
        "sponsoring_agency": "Biotechnology Industry Research Assistance Council (BIRAC), DST",
        "level": "Central",
        "target_beneficiaries": "Biotech, Agritech, Medtech, and Life Sciences early-stage innovators and startups",
        "description": "Offers non-dilutive grant-in-aid up to ₹50 Lakhs to scientists, graduates, and startups to establish Proof of Concept for commercial biotech inventions.",
        "benefits": "100% Non-dilutive grant up to ₹50 Lakhs for 18 months + Mentorship + Access to BIRAC bio-incubators.",
        "max_project_cost": 5000000,
        "max_loan_amount": 5000000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 0.0,
        "repayment_years": 0,
        "moratorium_months": 0,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 65,
            "project_types": ["Biotechnology", "Agritech", "Medical Devices", "Healthcare", "Bio-energy", "Pharma"],
            "states": ["All States"],
            "exclusions": "Startups > 5 years old"
        },
        "documents_required": ["Proposal Presentation", "Biotech Research Abstract", "Founder Profile", "Company Registration (if incorporated)"],
        "application_process": "Apply online via birac.nic.in during BIG Call windows (Jan & July).",
        "official_url": "https://birac.nic.in/big.php",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/birac-big",
        "helpdesk_contact": "011-24682177"
    },
    {
        "id": "nidhi-prayas",
        "scheme_name": "NIDHI-PRAYAS (Promoting and Accelerating Young and Aspiring innovators)",
        "short_name": "NIDHI-PRAYAS",
        "category": "Prototype Grant",
        "sponsoring_agency": "Department of Science and Technology (DST)",
        "level": "Central",
        "target_beneficiaries": "Individual tech innovators and early hardware startups building physical prototypes",
        "description": "Provides financial grant up to ₹10 Lakhs to translate innovative hardware and deeptech ideas into proof-of-concept functional prototypes.",
        "benefits": "Up to ₹10 Lakhs prototype grant + Lab access at PRAYAS Centres (DST Incubators).",
        "max_project_cost": 1000000,
        "max_loan_amount": 1000000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 0.0,
        "repayment_years": 0,
        "moratorium_months": 0,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 65,
            "project_types": ["Hardware", "Robotics", "IoT", "Clean Tech", "Biomedical Devices", "Agri-machinery"],
            "states": ["All States"],
            "exclusions": "Pure software or IT services without hardware innovation"
        },
        "documents_required": ["Prototype Proposal", "Aadhaar Card", "Technical Design Abstract"],
        "application_process": "Apply directly through DST PRAYAS incubators across India.",
        "official_url": "https://nidhi-prayas.org/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/nidhi-prayas",
        "helpdesk_contact": "011-26590200"
    },

    # ── GENERAL / EWS FOCUSED SCHEMES ──
    {
        "id": "ews-general-udyam",
        "scheme_name": "National EWS & General Category Enterprise Support Scheme",
        "short_name": "EWS-UDYAM",
        "category": "Capital Subsidy",
        "sponsoring_agency": "Ministry of MSME / State DICs",
        "level": "Central",
        "target_beneficiaries": "Economically Weaker Section (EWS) and General Category entrepreneurs setting up micro-enterprises",
        "description": "Concessional credit and 15%-25% capital margin money subsidy for General and EWS category individuals starting manufacturing, service, or retail ventures.",
        "benefits": "15% to 25% Capital Subsidy + Credit Guarantee under CGTMSE. Loans up to ₹50 Lakhs with bank credit linkage.",
        "max_project_cost": 5000000,
        "max_loan_amount": 4250000,
        "interest_rate_min": 7.5,
        "interest_rate_max": 10.0,
        "repayment_years": 7,
        "moratorium_months": 6,
        "nsfdc_share_percent": 25,
        "beneficiary_share_percent": 10,
        "eligibility_criteria": {
            "social_category": ["General", "EWS"],
            "max_annual_income": 800000,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 60,
            "project_types": ["Manufacturing", "Service", "Retail", "Small Business", "Agri Processing", "Food Processing"],
            "states": ["All States"],
            "exclusions": "Income tax payers with family income > ₹8 Lakhs"
        },
        "documents_required": ["EWS Certificate / Income Certificate (< ₹8 Lakhs)", "Aadhaar Card", "PAN Card", "Project Profile", "Bank Account Details"],
        "application_process": "Apply via JanSamarth portal or DIC in your district.",
        "official_url": "https://www.jansamarth.in/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/ews-udyam",
        "helpdesk_contact": "1800-180-1111"
    },
    {
        "id": "nmdfdc-term-loan",
        "scheme_name": "NMDFDC Term Loan Scheme for Minorities",
        "short_name": "NMDFDC-TL",
        "category": "Business Loan",
        "sponsoring_agency": "National Minorities Development & Finance Corporation (NMDFDC), Ministry of Minority Affairs",
        "level": "Central",
        "target_beneficiaries": "Individuals from notified Minority Communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) for self-employment",
        "description": "Concessional loans up to ₹30 Lakhs for manufacturing, commercial transport, service, and agricultural businesses for minority entrepreneurs.",
        "benefits": "Loans up to ₹30 Lakhs at 6% to 8% interest rate. Credit up to 90% of project cost.",
        "max_project_cost": 3000000,
        "max_loan_amount": 2700000,
        "interest_rate_min": 6.0,
        "interest_rate_max": 8.0,
        "repayment_years": 5,
        "moratorium_months": 6,
        "nsfdc_share_percent": 90,
        "beneficiary_share_percent": 10,
        "eligibility_criteria": {
            "social_category": ["Minorities"],
            "max_annual_income": 600000,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 55,
            "project_types": ["Small Business", "Transport", "Handicrafts", "Services", "Manufacturing"],
            "states": ["All States"],
            "exclusions": "Non-minority applicants"
        },
        "documents_required": ["Minority Community Self-Declaration / Certificate", "Income Certificate", "Aadhaar Card", "Business DPR"],
        "application_process": "Apply through State Channelizing Agency (SCA) for Minority Development.",
        "official_url": "https://nmdfdc.org/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/nmdfdc-tl",
        "helpdesk_contact": "1800-11-4000"
    },

    # ── ADDITIONAL STATE STARTUP POLICIES & SCHEMES ──
    # RAJASTHAN
    {
        "id": "istart-rajasthan",
        "scheme_name": "iStart Rajasthan Startup Policy & Seed Grant",
        "short_name": "iStart-RAJ",
        "category": "Startup Seed Grant",
        "sponsoring_agency": "Department of Information Technology & Communication, Rajasthan",
        "level": "State",
        "target_beneficiaries": "Innovative startups registered in Rajasthan across Ideation, Seed, and Growth stages",
        "description": "Offers up to ₹2.4 Lakhs Ideation Grant, up to ₹60 Lakhs Seed Grant, and ₹10,000-₹25,000 monthly sustenance allowance for QRate ranked startups.",
        "benefits": "Ideation Grant ₹2.4L + Seed Grant up to ₹60L + Monthly Sustenance Allowance up to ₹25,000/month for 1 year.",
        "max_project_cost": 6000000,
        "max_loan_amount": 6000000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 0.0,
        "repayment_years": 0,
        "moratorium_months": 0,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 55,
            "project_types": ["Tech Startup", "IT", "Agritech", "Edtech", "E-commerce", "Clean Tech"],
            "states": ["Rajasthan"],
            "exclusions": "Non-residents of Rajasthan"
        },
        "documents_required": ["Rajasthan Domicile", "iStart Registration", "Pitch Deck", "QRate Certificate"],
        "application_process": "Register and apply online via istart.rajasthan.gov.in portal.",
        "official_url": "https://istart.rajasthan.gov.in/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/istart-raj",
        "helpdesk_contact": "0141-2921136"
    },

    # KERALA
    {
        "id": "ksum-kerala-startup",
        "scheme_name": "Kerala Startup Mission (KSUM) Idea & Seed Fund",
        "short_name": "KSUM-KL",
        "category": "Startup Seed Grant",
        "sponsoring_agency": "Kerala Startup Mission, Government of Kerala",
        "level": "State",
        "target_beneficiaries": "Early-stage innovative startups registered in Kerala",
        "description": "Provides non-dilutive Idea Grants up to ₹7 Lakhs (up to ₹12 Lakhs for Women/Transgender founders) and Seed Loans up to ₹15 Lakhs at 6% simple interest.",
        "benefits": "₹7L - ₹12L Non-dilutive Grant + ₹15L Soft Loan at 6% interest + Co-working space & incubation.",
        "max_project_cost": 2500000,
        "max_loan_amount": 1500000,
        "interest_rate_min": 6.0,
        "interest_rate_max": 6.0,
        "repayment_years": 5,
        "moratorium_months": 12,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 55,
            "project_types": ["Technology Startup", "Hardware", "Software", "Biotech", "Agritech"],
            "states": ["Kerala"],
            "exclusions": "Non-Kerala registered companies"
        },
        "documents_required": ["KSUM Startup Registration", "Company PAN/Incorporation", "Pitch Deck"],
        "application_process": "Apply via startupmission.kerala.gov.in portal.",
        "official_url": "https://startupmission.kerala.gov.in/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/ksum-kl",
        "helpdesk_contact": "0471-2700270"
    },

    # ODISHA
    {
        "id": "startup-odisha",
        "scheme_name": "Startup Odisha Grants & Monthly Allowance",
        "short_name": "STARTUP-ODISHA",
        "category": "Startup Seed Grant",
        "sponsoring_agency": "Startup Odisha, MSME Department, Govt of Odisha",
        "level": "State",
        "target_beneficiaries": "DPIIT / Startup Odisha recognized innovative startups in Odisha",
        "description": "Offers ₹20,000/month sustenance allowance for 1 year (₹22,000/month for Women/SC/ST/PwD) and Product Development / Marketing grant up to ₹15 Lakhs.",
        "benefits": "₹20,000/month Sustenance Allowance for 12 months + ₹15 Lakhs Product Development Grant.",
        "max_project_cost": 1500000,
        "max_loan_amount": 1500000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 0.0,
        "repayment_years": 0,
        "moratorium_months": 0,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women", "PwD"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 55,
            "project_types": ["Tech Startup", "IT", "Agritech", "Food Tech", "Biotech", "Handicrafts Tech"],
            "states": ["Odisha"],
            "exclusions": "Non-Odisha registered units"
        },
        "documents_required": ["Startup Odisha Recognition Certificate", "DPR", "Pitch Deck", "Bank Details"],
        "application_process": "Apply online at startupodisha.gov.in portal.",
        "official_url": "https://startupodisha.gov.in/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/startup-odisha",
        "helpdesk_contact": "1800-345-7100"
    },

    # KARNATAKA
    {
        "id": "elevate-karnataka",
        "scheme_name": "ELEVATE Karnataka (Grant-in-Aid Scheme)",
        "short_name": "ELEVATE-KA",
        "category": "Startup Seed Grant",
        "sponsoring_agency": "Department of Electronics, IT, Bt and S&T, Government of Karnataka",
        "level": "State",
        "target_beneficiaries": "Innovative early-stage startups registered in Karnataka",
        "description": "Flagship grant-in-aid scheme providing up to ₹50 Lakhs non-dilutive grant to early-stage startups across General, Shakti (Women), and Unnati (SC/ST) tracks.",
        "benefits": "100% Non-dilutive Grant up to ₹50 Lakhs + Incubation support + Mentorship.",
        "max_project_cost": 5000000,
        "max_loan_amount": 5000000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 0.0,
        "repayment_years": 0,
        "moratorium_months": 0,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 60,
            "project_types": ["Deeptech", "IT/Software", "Biotech", "Hardware", "Clean Energy", "Agritech"],
            "states": ["Karnataka"],
            "exclusions": "Startups registered outside Karnataka"
        },
        "documents_required": ["Karnataka Incorporation Proof", "Pitch Deck", "Audited Financials / Bank Statement"],
        "application_process": "Apply during annual ELEVATE call on startup.karnataka.gov.in.",
        "official_url": "https://startup.karnataka.gov.in/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/elevate-ka",
        "helpdesk_contact": "080-22231006"
    },

    # NORTH EAST REGION
    {
        "id": "north-east-venture-fund",
        "scheme_name": "North East Venture Fund (NEVF)",
        "short_name": "NEVF",
        "category": "Venture Fund / Equity",
        "sponsoring_agency": "NEDFi / Ministry of Development of North Eastern Region (DoNER)",
        "level": "Central",
        "target_beneficiaries": "Startups and early-stage commercial ventures in North Eastern States (Assam, Meghalaya, Manipur, Nagaland, Mizoram, Tripura, Arunachal, Sikkim)",
        "description": "Dedicated venture capital fund offering equity and quasi-equity investment from ₹25 Lakhs to ₹1 Crore for innovative North Eastern enterprises.",
        "benefits": "Venture equity capital investment up to ₹1 Crore + Incubation & market linkage across NE region.",
        "max_project_cost": 10000000,
        "max_loan_amount": 10000000,
        "interest_rate_min": 0.0,
        "interest_rate_max": 0.0,
        "repayment_years": 7,
        "moratorium_months": 12,
        "nsfdc_share_percent": 100,
        "beneficiary_share_percent": 0,
        "eligibility_criteria": {
            "social_category": ["General", "EWS", "SC", "ST", "OBC", "Women"],
            "max_annual_income": 0,
            "gender": ["Male", "Female"],
            "min_age": 18,
            "max_age": 60,
            "project_types": ["Food Processing", "Tourism", "IT/Electronics", "Handicrafts", "Healthcare", "Agri-logistics"],
            "states": ["Assam", "Meghalaya", "Manipur", "Nagaland", "Mizoram", "Tripura", "Arunachal Pradesh", "Sikkim"],
            "exclusions": "Ventures outside North East India"
        },
        "documents_required": ["NE State Domicile / Business Proof", "Detailed Business DPR", "Company Financial Statements"],
        "application_process": "Apply via nedfi.com/nevf portal.",
        "official_url": "https://www.nedfi.com/",
        "myscheme_url": "https://www.myscheme.gov.in/schemes/nevf",
        "helpdesk_contact": "0361-2229370"
    }
]

added_count = 0
for ns in additional_schemes:
    if ns["id"] not in existing_ids:
        existing_schemes.append(ns)
        existing_ids.add(ns["id"])
        added_count += 1

with open(schemes_path, "w", encoding="utf-8") as f:
    json.dump(existing_schemes, f, indent=2, ensure_ascii=False)

print(f"Successfully added {added_count} new startup & general/EWS schemes. Total schemes in dataset: {len(existing_schemes)}")
