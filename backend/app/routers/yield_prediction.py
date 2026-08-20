import os
import json
from fastapi import APIRouter, HTTPException
from app.schemas import YieldPredictionRequest, YieldPredictionResponse
from app.services.yield_service import yield_service
from app.core.config import MODELS_DIR

router = APIRouter(prefix="/yield-prediction", tags=["Crop Yield Prediction"])

@router.post("/predict", response_model=YieldPredictionResponse)
def predict_yield(req: YieldPredictionRequest):
    try:
        return yield_service.predict(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Yield prediction failed: {str(e)}")

@router.get("/metrics")
def get_metrics():
    metrics_path = os.path.join(MODELS_DIR, "crop_yield_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"message": "Metrics not found"}
