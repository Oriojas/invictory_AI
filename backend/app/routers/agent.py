from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional
from backend.app.database import get_db
from backend.app.services.inventory_agent import process_agent_chat_query

router = APIRouter(prefix="/api/v1/agent", tags=["IA Agent & Database Reasoning"])

class AgentChatRequest(BaseModel):
    query: str

class AgentChatResponse(BaseModel):
    response: str
    tool_used: str
    data: Optional[Any] = None

@router.post("/chat", response_model=AgentChatResponse)
def agent_chat_query(payload: AgentChatRequest, db: Session = Depends(get_db)):
    """
    Endpoint para realizar consultas en lenguaje natural al Agente Inteligente DeepSeek.
    El agente consulta la base de datos PostgreSQL en tiempo real y responde con datos de inventario.
    """
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="La consulta no puede estar vacía.")

    result = process_agent_chat_query(db, payload.query)
    return AgentChatResponse(
        response=result["response"],
        tool_used=result["tool_used"],
        data=result["data"]
    )
