from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.news import NewsCategory
from app.models.user import UserRole


class NewsBase(BaseModel):
    """Base news schema"""
    title: str = Field(..., min_length=1, max_length=500, description="News article title")
    content: str = Field(..., min_length=1, description="Full article content")
    snippet: Optional[str] = Field(None, max_length=500, description="Short snippet/summary")
    image_url: Optional[str] = Field(None, max_length=500, description="Main image URL")
    category: NewsCategory = Field(default=NewsCategory.GENERAL, description="News category")


class NewsCreate(NewsBase):
    """Schema for creating news"""
    pass


class NewsUpdate(BaseModel):
    """Schema for updating news (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, min_length=1)
    snippet: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    category: Optional[NewsCategory] = None


class AuthorInfo(BaseModel):
    """Author information"""
    id: int
    email: str
    full_name: str
    role: UserRole
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class NewsResponse(NewsBase):
    """Schema for news response"""
    id: int
    slug: str
    views_count: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    # Nested author info
    author: Optional[AuthorInfo] = None

    class Config:
        from_attributes = True


class NewsList(BaseModel):
    """Schema for paginated news list"""
    items: List[NewsResponse]
    total: int
    skip: int
    limit: int


class NewsFilter(BaseModel):
    """Schema for filtering news"""
    category: Optional[str] = None
    author_id: Optional[int] = None
    search: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None


__all__ = [
    "NewsBase",
    "NewsCreate",
    "NewsUpdate",
    "NewsResponse",
    "NewsList",
    "NewsFilter",
    "AuthorInfo"
]