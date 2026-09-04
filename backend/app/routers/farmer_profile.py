from typing import Dict, Any, List
from fastapi import APIRouter
from app.schemas import EntrepreneurProfile

router = APIRouter(prefix="/profile", tags=["Entrepreneur Profile"])

# In-memory active profile
ACTIVE_PROFILE = EntrepreneurProfile(
    name="Priya Kumari",
    social_category="SC",
    gender="Female",
    age=28,
    annual_income=250000,
    state="Bihar",
    district="Patna",
    is_pwd=False,
    is_women=True,
    education_level="Graduate",
    business_type="Service",
    project_cost=500000,
    is_existing_business=False,
    is_shg_member=True
)

PRESETS: List[Dict[str, Any]] = [
    {
        "preset_id": "sc_woman_bihar",
        "label": "Priya Kumari – SC Woman Entrepreneur (Bihar)",
        "profile": {
            "name": "Priya Kumari",
            "social_category": "SC",
            "gender": "Female",
            "age": 28,
            "annual_income": 250000,
            "state": "Bihar",
            "district": "Patna",
            "is_pwd": False,
            "is_women": True,
            "education_level": "Graduate",
            "business_type": "Service",
            "project_cost": 500000,
            "is_existing_business": False,
            "is_shg_member": True
        }
    },
    {
        "preset_id": "st_youth_jharkhand",
        "label": "Arun Munda – ST Youth Entrepreneur (Jharkhand)",
        "profile": {
            "name": "Arun Munda",
            "social_category": "ST",
            "gender": "Male",
            "age": 24,
            "annual_income": 180000,
            "state": "Jharkhand",
            "district": "Ranchi",
            "is_pwd": False,
            "is_women": False,
            "education_level": "12th Pass",
            "business_type": "Manufacturing",
            "project_cost": 300000,
            "is_existing_business": False,
            "is_shg_member": False
        }
    },
    {
        "preset_id": "obc_artisan_up",
        "label": "Meena Devi – OBC Artisan (Uttar Pradesh)",
        "profile": {
            "name": "Meena Devi",
            "social_category": "OBC",
            "gender": "Female",
            "age": 35,
            "annual_income": 350000,
            "state": "Uttar Pradesh",
            "district": "Varanasi",
            "is_pwd": False,
            "is_women": True,
            "education_level": "10th Pass",
            "business_type": "Artisan",
            "project_cost": 150000,
            "is_existing_business": True,
            "is_shg_member": True
        }
    },
    {
        "preset_id": "pwd_entrepreneur_mh",
        "label": "Ravi Jadhav – PwD Entrepreneur (Maharashtra)",
        "profile": {
            "name": "Ravi Jadhav",
            "social_category": "SC",
            "gender": "Male",
            "age": 32,
            "annual_income": 200000,
            "state": "Maharashtra",
            "district": "Pune",
            "is_pwd": True,
            "is_women": False,
            "education_level": "Graduate",
            "business_type": "Retail",
            "project_cost": 800000,
            "is_existing_business": False,
            "is_shg_member": False
        }
    },
    {
        "preset_id": "minority_woman_wb",
        "label": "Fatima Begum – Minority Woman (West Bengal)",
        "profile": {
            "name": "Fatima Begum",
            "social_category": "Minority",
            "gender": "Female",
            "age": 30,
            "annual_income": 300000,
            "state": "West Bengal",
            "district": "Kolkata",
            "is_pwd": False,
            "is_women": True,
            "education_level": "Graduate",
            "business_type": "Food Processing",
            "project_cost": 400000,
            "is_existing_business": True,
            "is_shg_member": False
        }
    }
]

@router.get("", response_model=EntrepreneurProfile)
def get_current_profile():
    return ACTIVE_PROFILE

@router.post("", response_model=EntrepreneurProfile)
def update_profile(profile: EntrepreneurProfile):
    global ACTIVE_PROFILE
    ACTIVE_PROFILE = profile
    return ACTIVE_PROFILE

@router.get("/presets")
def get_profile_presets():
    return PRESETS

@router.post("/presets/{preset_id}", response_model=EntrepreneurProfile)
def load_preset(preset_id: str):
    global ACTIVE_PROFILE
    for p in PRESETS:
        if p["preset_id"] == preset_id:
            ACTIVE_PROFILE = EntrepreneurProfile(**p["profile"])
            return ACTIVE_PROFILE
    return ACTIVE_PROFILE
