from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.education import Region, EducationType


class EducationBase(BaseModel):
    """Base education schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    region: Region
    type: Optional[EducationType] = None
    address: Optional[str] = Field(None, max_length=500)
    working_hours: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)
    maps_link: Optional[str] = Field(None, max_length=500)


class EducationCreate(EducationBase):
    """Schema for creating education"""
    pass


class EducationUpdate(BaseModel):
    """Schema for updating education"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    region: Optional[Region] = None
    type: Optional[EducationType] = None
    address: Optional[str] = Field(None, max_length=500)
    working_hours: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)
    maps_link: Optional[str] = Field(None, max_length=500)


class EducationResponse(EducationBase):
    """Schema for education response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EducationList(BaseModel):
    """Schema for paginated education list"""
    items: list[EducationResponse]
    total: int
    skip: int
    limit: int
