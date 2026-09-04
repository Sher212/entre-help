import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import PROJECT_NAME, VERSION, API_V1_STR

# Import Routers
from app.routers import (
    government_schemes,
    farmer_profile,
    ai_assistant,
    channel_partners,
    loan_calculator,
)

app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description="AI-Driven Scheme Matching Platform for Marginalized Entrepreneurs — Smart Scheme Recommender, Channel Partner Locator, and Loan Eligibility Calculator powered by MoSJE/NSFDC data."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(government_schemes.router, prefix=API_V1_STR)
app.include_router(farmer_profile.router, prefix=API_V1_STR)
app.include_router(ai_assistant.router, prefix=API_V1_STR)
app.include_router(channel_partners.router, prefix=API_V1_STR)
app.include_router(loan_calculator.router, prefix=API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": PROJECT_NAME,
        "version": VERSION,
        "modules_active": [
            "Smart Scheme Recommender (44 Central & State Schemes)",
            "Channel Partner Locator (33 SCAs, PSBs, RRBs)",
            "Loan Eligibility Calculator (EMI, Subsidy, Margin Money)",
            "AI Scheme Advisory Chatbot",
            "Entrepreneur Profile Engine (5 Demo Presets)"
        ]
    }

@app.get("/debug")
def debug_info():
    import sys
    from app.core.config import BASE_DIR
    from app.services.scheme_service import scheme_service
    from app.services.channel_partner_service import channel_partner_service
    return {
        "cwd": os.getcwd(),
        "base_dir": BASE_DIR,
        "schemes_count": len(scheme_service.schemes_raw),
        "channel_partners_count": len(channel_partner_service.partners_raw),
        "sys_executable": sys.executable,
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
