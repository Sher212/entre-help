import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert len(data["modules_active"]) == 8

def test_crop_recommendation():
    payload = {
        "N": 80,
        "P": 45,
        "K": 40,
        "temperature": 24.5,
        "humidity": 80.0,
        "ph": 6.5,
        "rainfall": 200.0,
        "top_k": 3
    }
    response = client.post("/api/crop-recommendation/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "top_crop" in data
    assert len(data["recommendations"]) == 3
    assert "feature_importances" in data
    assert "nutritional_analysis" in data

def test_yield_prediction():
    payload = {
        "crop": "Wheat",
        "state": "Punjab",
        "season": "Rabi",
        "area": 2.5,
        "annual_rainfall": 950.0,
        "fertilizer": 120.0,
        "pesticide": 1.8
    }
    response = client.post("/api/yield-prediction/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["crop"] == "Wheat"
    assert data["predicted_yield_tons_per_ha"] > 0
    assert data["predicted_yield_quintals_per_acre"] > 0
    assert len(data["optimization_recommendations"]) > 0

def test_disease_detection_sample():
    # List samples
    samples_resp = client.get("/api/disease-detection/samples")
    assert samples_resp.status_code == 200
    samples = samples_resp.json()
    assert len(samples) > 0
    
    first_sample = samples[0]["filename"]
    diag_resp = client.post(f"/api/disease-detection/diagnose-sample?filename={first_sample}")
    assert diag_resp.status_code == 200
    data = diag_resp.json()
    assert "detected_crop" in data
    assert "condition" in data
    assert "confidence" in data
    assert "immediate_actions" in data
    assert "organic_treatment" in data
    assert "chemical_treatment" in data

def test_weather_and_advisory():
    response = client.get("/api/weather/advisory?location=Nashik&crop=Soybean")
    assert response.status_code == 200
    data = response.json()
    assert "current" in data
    assert "forecast" in data
    assert len(data["forecast"]) == 7
    assert "advisory" in data
    assert "irrigation_advice" in data["advisory"]
    assert "spraying_window" in data["advisory"]

def test_market_intelligence():
    # Filters
    filters_resp = client.get("/api/market/filters")
    assert filters_resp.status_code == 200
    filters = filters_resp.json()
    assert "Maharashtra" in filters["states"]
    assert "Soybean" in filters["commodities"]
    
    # Trends
    trends_resp = client.get("/api/market/trends?commodity=Soybean&state=Maharashtra")
    assert trends_resp.status_code == 200
    trends = trends_resp.json()
    assert trends["commodity"] == "Soybean"
    assert len(trends["price_history"]) > 0
    assert trends["latest_modal_price"] > 0
    
    # Where to sell
    sell_resp = client.get("/api/market/where-to-sell?commodity=Soybean&state=Maharashtra")
    assert sell_resp.status_code == 200
    sell = sell_resp.json()
    assert len(sell["best_mandis"]) > 0
    assert sell["best_mandis"][0]["rank"] == 1

def test_government_schemes():
    response = client.get("/api/schemes/search")
    assert response.status_code == 200
    data = response.json()
    assert data["total_schemes"] >= 10
    
    # Profile matching
    profile_payload = {
        "name": "Ramesh Patil",
        "state": "Maharashtra",
        "district": "Nashik",
        "land_size_acres": 3.5,
        "soil_type": "Black Soil",
        "soil_ph": 6.8,
        "nitrogen": 75.0,
        "phosphorus": 45.0,
        "potassium": 40.0,
        "current_crop": "Soybean",
        "farming_season": "Kharif",
        "irrigation_source": "Drip",
        "farmer_category": "Small (1-2 ha)"
    }
    match_resp = client.post("/api/schemes/match-profile", json=profile_payload)
    assert match_resp.status_code == 200
    matched = match_resp.json()
    assert len(matched) > 0
    assert matched[0]["match_score"] > 0

def test_ai_assistant():
    payload = {
        "message": "Which crop is best for my farm?",
        "farmer_profile": {
            "name": "Ramesh Patil",
            "state": "Maharashtra",
            "district": "Nashik",
            "land_size_acres": 3.5,
            "soil_type": "Black Soil",
            "soil_ph": 6.8,
            "nitrogen": 75.0,
            "phosphorus": 45.0,
            "potassium": 40.0,
            "current_crop": "Soybean",
            "farming_season": "Kharif",
            "irrigation_source": "Drip",
            "farmer_category": "Small (1-2 ha)"
        }
    }
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["tools_used"]) > 0
    assert len(data["suggested_followups"]) > 0

def test_action_plan():
    response = client.get("/api/action-plan/generate")
    assert response.status_code == 200
    data = response.json()
    assert "crop_advice" in data
    assert "irrigation_water_advice" in data
    assert "weather_action" in data
    assert "market_advice" in data
    assert "government_support" in data
    assert len(data["immediate_next_steps"]) > 0

def test_models_summary():
    response = client.get("/api/models-info/summary")
    assert response.status_code == 200
    data = response.json()
    assert len(data["datasets"]) == 5
