"""AI Buddy Schemas"""
from pydantic import BaseModel
from datetime import datetime

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime

class ChatHistory(BaseModel):
    id: int
    message: str
    response: str
    is_user_message: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
