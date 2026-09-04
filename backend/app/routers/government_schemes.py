from typing import Optional, List
from fastapi import APIRouter, Query, Body
from app.schemas import SchemeSearchResponse, SchemeItem, EntrepreneurProfile
from app.services.scheme_service import scheme_service

router = APIRouter(prefix="/schemes", tags=["Scheme Matching"])

@router.get("/search", response_model=SchemeSearchResponse)
def search_schemes(
    query: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None, description="Scheme category")
):
    return scheme_service.search_schemes(query, category)

@router.post("/match-profile", response_model=List[SchemeItem])
def match_for_profile(profile: EntrepreneurProfile = Body(...)):
    return scheme_service.match_for_profile(profile)

@router.get("/categories")
def get_categories():
    categories = sorted(list(set([s["category"] for s in scheme_service.schemes_raw])))
    return {"categories": ["All"] + categories}

@router.get("/{scheme_id}")
def get_scheme_detail(scheme_id: str):
    scheme = scheme_service.get_scheme_by_id(scheme_id)
    if not scheme:
        return {"error": "Scheme not found"}
    return scheme
