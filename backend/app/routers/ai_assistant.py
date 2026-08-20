from fastapi import APIRouter
from app.schemas import AssistantQueryRequest, AssistantQueryResponse
from app.services.assistant_service import assistant_service

router = APIRouter(prefix="/assistant", tags=["AI Farmer Assistant"])

@router.post("/chat", response_model=AssistantQueryResponse)
def chat_with_assistant(req: AssistantQueryRequest):
    return assistant_service.process_query(req)
