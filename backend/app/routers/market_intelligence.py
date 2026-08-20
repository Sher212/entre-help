from typing import Optional
from fastapi import APIRouter, Query
from app.schemas import MarketFilterOptions, MarketTrendResponse, WhereToSellResponse
from app.services.market_service import market_service

router = APIRouter(prefix="/market", tags=["Market Intelligence"])

@router.get("/filters", response_model=MarketFilterOptions)
def get_market_filters():
    return market_service.get_filter_options()

@router.get("/trends", response_model=MarketTrendResponse)
def get_trends(
    commodity: str = Query("Soybean", description="Commodity name"),
    state: str = Query("Maharashtra", description="State name"),
    district: Optional[str] = Query(None, description="District name"),
    mandi: Optional[str] = Query(None, description="Mandi/Market name")
):
    return market_service.get_market_trends(commodity, state, district, mandi)

@router.get("/where-to-sell", response_model=WhereToSellResponse)
def get_where_to_sell(
    commodity: str = Query("Soybean", description="Commodity name"),
    state: str = Query("Maharashtra", description="State name")
):
    return market_service.where_to_sell(commodity, state)
