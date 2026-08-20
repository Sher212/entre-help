import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import PROJECT_NAME, VERSION, API_V1_STR, DATA_SAMPLES

# Import Routers
from app.routers import (
    crop_recommendation,
    yield_prediction,
    disease_detection,
    weather_advisory,
    market_intelligence,
    government_schemes,
    farmer_profile,
    ai_assistant,
    action_plan,
    models_info
)

app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description="Production-Quality AI Decision Support Platform for Indian Farmers combining Crop Advisory, Disease Detection, Weather-Aware Recommendations, Mandi Intelligence, and Government Schemes."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Samples for Leaf Images
if os.path.exists(DATA_SAMPLES):
    app.mount("/static/samples", StaticFiles(directory=DATA_SAMPLES), name="samples")

# Mount API Routers
app.include_router(crop_recommendation.router, prefix=API_V1_STR)
app.include_router(yield_prediction.router, prefix=API_V1_STR)
app.include_router(disease_detection.router, prefix=API_V1_STR)
app.include_router(weather_advisory.router, prefix=API_V1_STR)
app.include_router(market_intelligence.router, prefix=API_V1_STR)
app.include_router(government_schemes.router, prefix=API_V1_STR)
app.include_router(farmer_profile.router, prefix=API_V1_STR)
app.include_router(ai_assistant.router, prefix=API_V1_STR)
app.include_router(action_plan.router, prefix=API_V1_STR)
app.include_router(models_info.router, prefix=API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": PROJECT_NAME,
        "version": VERSION,
        "modules_active": [
            "Crop Recommendation Engine (Dataset 1)",
            "Plant Village Disease Vision Model (Dataset 2)",
            "Crop Yield Regressor (Dataset 3)",
            "Mandi Wholesale Market Analytics (Dataset 4)",
            "Government Scheme Discovery (Dataset 5)",
            "Agro-Meteorological Advisory Engine",
            "Central AI Farmer Assistant Orchestrator",
            "Unified Farm Action Plan"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
