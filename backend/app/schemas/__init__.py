from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# ----------------- Entrepreneur Profile -----------------
class EntrepreneurProfile(BaseModel):
    name: str = Field(default="Priya Kumari", description="Full name")
    social_category: str = Field(default="SC", description="Social category: SC, ST, OBC, Minority, General, PwD")
    gender: str = Field(default="Female", description="Gender: Male, Female, Transgender")
    age: int = Field(default=28, ge=18, le=70, description="Age in years")
    annual_income: float = Field(default=250000, description="Annual family income in INR")
    state: str = Field(default="Bihar", description="State in India")
    district: str = Field(default="Patna", description="District")
    is_pwd: bool = Field(default=False, description="Person with Disability")
    is_women: bool = Field(default=False, description="Is woman entrepreneur (auto-derived from gender)")
    education_level: str = Field(default="Graduate", description="Education: Below 10th, 10th Pass, 12th Pass, Graduate, Post-Graduate")
    business_type: str = Field(default="Service", description="Business type: Manufacturing, Service, Trading, Transport, Agriculture, Retail, Food Processing, Artisan, Education")
    project_cost: float = Field(default=500000, description="Total project/business cost in INR")
    is_existing_business: bool = Field(default=False, description="Is this an existing business or new venture")
    is_shg_member: bool = Field(default=False, description="Is member of a Self Help Group")

# Keep backward compat alias
FarmerProfile = EntrepreneurProfile

# ----------------- Scheme Matching -----------------
class SchemeItem(BaseModel):
    id: str
    scheme_name: str
    short_name: str
    category: str
    sponsoring_agency: str
    level: str
    target_beneficiaries: str
    description: str
    benefits: str
    eligibility_criteria: Dict[str, Any]
    documents_required: List[str]
    application_process: str
    official_url: str
    myscheme_url: str
    helpdesk_contact: Optional[str] = ""
    max_project_cost: Optional[float] = None
    max_loan_amount: Optional[float] = None
    interest_rate_min: Optional[float] = None
    interest_rate_max: Optional[float] = None
    repayment_years: Optional[int] = None
    moratorium_months: Optional[int] = None
    nsfdc_share_percent: Optional[float] = None
    beneficiary_share_percent: Optional[float] = None
    match_score: Optional[float] = None
    match_reasons: Optional[List[str]] = None

class SchemeSearchResponse(BaseModel):
    total_schemes: int
    results: List[SchemeItem]
    categories: List[str]
    disclaimer: str

# ----------------- Channel Partners -----------------
class ChannelPartnerItem(BaseModel):
    id: str
    name: str
    type: str  # SCA, PSB, RRB, NBFC-MFI
    state: str
    contact: Optional[str] = ""
    address: Optional[str] = ""
    schemes_handled: Optional[List[str]] = []

class ChannelPartnerSearchResponse(BaseModel):
    total: int
    state: str
    results: List[ChannelPartnerItem]

# ----------------- Loan Calculator -----------------
class LoanCalculationRequest(BaseModel):
    scheme_id: str = Field(..., description="Scheme ID from mosje_schemes.json")
    project_cost: float = Field(..., gt=0, description="Total project cost in INR")
    annual_income: float = Field(default=250000, description="Annual family income in INR")
    social_category: str = Field(default="SC", description="Social category")
    gender: str = Field(default="Female", description="Gender")

class LoanCalculationResponse(BaseModel):
    scheme_name: str
    project_cost: float
    loan_amount: float
    subsidy_or_grant: float
    beneficiary_contribution: float
    interest_rate: float
    monthly_emi: float
    repayment_years: int
    moratorium_months: int
    total_repayable: float
    women_rebate_applied: bool
    breakdown_notes: List[str]

# ----------------- AI Assistant -----------------
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class AssistantQueryRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    farmer_profile: Optional[EntrepreneurProfile] = None

class AssistantQueryResponse(BaseModel):
    reply: str
    detected_intent: str
    tools_used: List[str]
    structured_data: Optional[Dict[str, Any]] = None
    suggested_followups: List[str]
