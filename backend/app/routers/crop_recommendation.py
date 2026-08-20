import os
import json
from fastapi import APIRouter, HTTPException
from app.schemas import CropRecommendationRequest, CropRecommendationResponse
from app.services.crop_service import crop_service
from app.core.config import MODELS_DIR

router = APIRouter(prefix="/crop-recommendation", tags=["Crop Recommendation"])

@router.post("/predict", response_model=CropRecommendationResponse)
def predict_crop(req: CropRecommendationRequest):
    try:
        return crop_service.predict(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop prediction failed: {str(e)}")

@router.get("/metrics")
def get_metrics():
    metrics_path = os.path.join(MODELS_DIR, "crop_recommendation_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"message": "Metrics not found"}
