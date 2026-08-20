from fastapi import APIRouter, Query
from app.schemas import WeatherAdvisoryResponse
from app.services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather & Agro-Advisory"])

@router.get("/advisory", response_model=WeatherAdvisoryResponse)
def get_weather_advisory(
    location: str = Query("Nashik, Maharashtra", description="City, District, or State name"),
    crop: str = Query("General", description="Crop context for tailored recommendations")
):
    return weather_service.get_weather_and_advisory(location_query=location, crop_context=crop)
