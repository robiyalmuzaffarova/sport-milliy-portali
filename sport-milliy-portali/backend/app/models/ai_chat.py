from sqlalchemy import Column, String, Text, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..db.base import BaseModel

class AIChat(BaseModel):
    __tablename__ = "ai_chats"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    is_user_message = Column(Boolean, default=True)
    user = relationship("User", back_populates="ai_chats")
