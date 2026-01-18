from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.post("/chat")
async def chat_with_ai(message: dict, db: AsyncSession = Depends(get_db)):
    return {"response": "AI response here"}
