from fastapi import APIRouter, Body
from app.schemas import FarmActionPlanResponse, FarmerProfile
from app.services.action_plan_service import action_plan_service
from app.routers.farmer_profile import ACTIVE_PROFILE

router = APIRouter(prefix="/action-plan", tags=["Farm Action Plan"])

@router.get("/generate", response_model=FarmActionPlanResponse)
def get_action_plan():
    return action_plan_service.generate_plan(ACTIVE_PROFILE)

@router.post("/generate", response_model=FarmActionPlanResponse)
def generate_custom_action_plan(profile: FarmerProfile = Body(...)):
    return action_plan_service.generate_plan(profile)
