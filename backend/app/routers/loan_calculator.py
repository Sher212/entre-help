from fastapi import APIRouter, Body
from app.schemas import LoanCalculationRequest, LoanCalculationResponse
from app.services.loan_calculator_service import loan_calculator_service

router = APIRouter(prefix="/loan", tags=["Loan Calculator"])

@router.post("/calculate", response_model=LoanCalculationResponse)
def calculate_loan(req: LoanCalculationRequest = Body(...)):
    return loan_calculator_service.calculate(req)
