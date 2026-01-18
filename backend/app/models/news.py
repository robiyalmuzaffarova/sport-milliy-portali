"""
News Model
"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import BaseModel


class NewsCategory(str, enum.Enum):
    """News categories"""
    ACHIEVEMENTS = "ACHIEVEMENTS"
    COMPETITIONS = "COMPETITIONS"
    NEWS = "NEWS"
    INTERVIEW = "INTERVIEW"
    HEALTH = "HEALTH"
    FOOTBALL = "FOOTBALL"
    BOXING = "BOXING"
    WRESTLING = "WRESTLING"
    TENNIS = "TENNIS"
    BASKETBALL = "BASKETBALL"
    SWIMMING = "SWIMMING"
    GENERAL = "GENERAL"


class News(BaseModel):
    """
    News and articles model
    """
    __tablename__ = "news"
    
    title = Column(String(500), nullable=False, index=True)
    slug = Column(String(500), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    snippet = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    category = Column(Enum(NewsCategory), default=NewsCategory.GENERAL, nullable=False)
    views_count = Column(Integer, default=0, nullable=False)
    
    # Author
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author = relationship("User", back_populates="news_articles")

    
    def __repr__(self):
        return "<News>"
