from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AchievementCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    year: Optional[str] = Field(None, max_length=10)
    icon_type: str = Field("trophy", pattern="^(trophy|medal|star)$")


class AchievementResponse(BaseModel):
    id: int
    user_id: int
    title: str
    year: Optional[str] = None
    icon_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class AchievementListResponse(BaseModel):
    items: list[AchievementResponse]
    total: int
