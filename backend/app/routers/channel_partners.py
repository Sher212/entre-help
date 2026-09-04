from typing import Optional
from fastapi import APIRouter, Query
from app.services.channel_partner_service import channel_partner_service

router = APIRouter(prefix="/channel-partners", tags=["Channel Partners"])

@router.get("/search")
def search_partners(
    state: Optional[str] = Query(None, description="State name"),
    type: Optional[str] = Query(None, description="Partner type: SCA, PSB, RRB, NBFC-MFI")
):
    return channel_partner_service.search_partners(state, type)

@router.get("/states")
def get_states():
    return {"states": channel_partner_service.get_unique_states()}

@router.get("/for-state/{state}")
def get_partners_for_state(state: str):
    partners = channel_partner_service.get_partners_for_state(state)
    return {"state": state, "total": len(partners), "results": partners}
