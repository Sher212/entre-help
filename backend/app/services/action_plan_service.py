import datetime
from app.schemas import FarmActionPlanResponse, FarmerProfile
from app.services.crop_service import crop_service, CropRecommendationRequest
from app.services.weather_service import weather_service
from app.services.market_service import market_service
from app.services.scheme_service import scheme_service

class FarmActionPlanService:
    def generate_plan(self, profile: FarmerProfile) -> FarmActionPlanResponse:
        # 1. Crop Advisory
        c_req = CropRecommendationRequest(
            N=profile.nitrogen,
            P=profile.phosphorus,
            K=profile.potassium,
            temperature=26.5,
            humidity=65.0,
            ph=profile.soil_ph,
            rainfall=105.0,
            top_k=1
        )
        c_res = crop_service.predict(c_req)
        rec_crop = c_res.top_crop
        top_crop_info = c_res.recommendations[0]

        # 2. Weather & Irrigation
        w_res = weather_service.get_weather_and_advisory(profile.district or profile.state, rec_crop)
        
        # 3. Market Intelligence
        m_crop = profile.current_crop or rec_crop
        m_res = market_service.get_market_trends(m_crop, profile.state, profile.district)
        w_sell = market_service.where_to_sell(m_crop, profile.state)
        best_m = w_sell.best_mandis[0] if w_sell.best_mandis else None

        # 4. Government Schemes
        schemes = scheme_service.match_for_profile(profile)
        top_scheme = schemes[0] if schemes else None

        # Assemble Action Plan
        crop_advice = {
            "recommended_crop": rec_crop,
            "suitability": top_crop_info.soil_suitability,
            "confidence": top_crop_info.percentage,
            "soil_reason": f"Matches soil NPK ({profile.nitrogen:.0f}:{profile.phosphorus:.0f}:{profile.potassium:.0f}) and pH ({profile.soil_ph:.1f}).",
            "duration": top_crop_info.expected_duration_days
        }

        irrigation_advice = {
            "status": w_res.advisory.irrigation_advice["status"],
            "action": w_res.advisory.irrigation_advice["action"],
            "timing": "Early Morning (6:30 - 8:30 AM) via Drip lines"
        }

        weather_action = {
            "current_temp": f"{w_res.current.temperature:.1f}°C",
            "condition": w_res.current.condition_text,
            "alert": w_res.advisory.spraying_window["summary"],
            "spraying_window": w_res.advisory.spraying_window["status"]
        }

        crop_health_action = {
            "fungal_risk": w_res.advisory.pest_disease_risk["status"],
            "preventive_measure": "Apply Trichoderma viride (10g/L) as bio-protective drench to protect root zone.",
            "field_hygiene": "Ensure no standing water in furrows; keep canopy aerated."
        }

        market_advice = {
            "commodity": m_crop,
            "modal_price": f"₹{m_res.latest_modal_price} / Quintal",
            "trend": m_res.trend_direction,
            "best_mandi": f"{best_m.market} ({best_m.district})" if best_m else "Local APMC Yard",
            "advice": w_sell.market_advice
        }

        government_support = {
            "top_scheme": top_scheme.scheme_name if top_scheme else "PM-KISAN",
            "benefits": top_scheme.benefits if top_scheme else "Direct income support",
            "action": f"Apply via {top_scheme.application_process}" if top_scheme else "Visit Common Service Centre",
            "portal": top_scheme.official_url if top_scheme else "https://pmkisan.gov.in"
        }

        critical_risks = [
            f"Weather Volatility: Check local rain forecast before scheduled chemical sprays.",
            f"Market Fluctuations: {m_res.volatility_rating} price volatility observed in recent mandi arrivals.",
            f"Disease Risk: High humidity spells may accelerate fungal leaf spot infections."
        ]

        immediate_next_steps = [
            f"Schedule soil test verification for NPK calibration before final basal fertilizer application.",
            f"Set up drip fertigation for {rec_crop} during the 6:30 - 8:30 AM morning window.",
            f"Apply for {top_scheme.short_name if top_scheme else 'PMKSY'} subsidy on the state agriculture portal to lower irrigation infrastructure costs."
        ]

        return FarmActionPlanResponse(
            farmer_name=profile.name,
            generated_at=datetime.datetime.now().strftime("%d %b %Y, %I:%M %p"),
            crop_advice=crop_advice,
            irrigation_water_advice=irrigation_advice,
            weather_action=weather_action,
            crop_health_action=crop_health_action,
            market_advice=market_advice,
            government_support=government_support,
            critical_risks=critical_risks,
            immediate_next_steps=immediate_next_steps,
            disclaimer="AI-generated Farm Action Plan for agricultural decision support. Always cross-check with local Krishi Vigyan Kendra (KVK) and verified government portals."
        )

action_plan_service = FarmActionPlanService()
