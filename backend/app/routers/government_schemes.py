from typing import Optional, List
from fastapi import APIRouter, Query, Body
from app.schemas import SchemeSearchResponse, SchemeItem, FarmerProfile
from app.services.scheme_service import scheme_service

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("/search", response_model=SchemeSearchResponse)
def search_schemes(
    query: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None, description="Scheme category")
):
    return scheme_service.search_schemes(query, category)

@router.post("/match-profile", response_model=List[SchemeItem])
def match_for_profile(profile: FarmerProfile = Body(...)):
    return scheme_service.match_for_profile(profile)
