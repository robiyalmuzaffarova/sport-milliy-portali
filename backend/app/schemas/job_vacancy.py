from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class JobVacancyBase(BaseModel):
    """Base job vacancy schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    company: str = Field(..., min_length=1, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    salary_range: Optional[str] = Field(None, max_length=100)
    contact: str = Field(..., max_length=255)
    is_active: bool = True


class JobVacancyCreate(JobVacancyBase):
    """Schema for creating job vacancy"""
    pass


class JobVacancyUpdate(BaseModel):
    """Schema for updating job vacancy"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    company: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    salary_range: Optional[str] = Field(None, max_length=100)
    contact: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class JobVacancyResponse(JobVacancyBase):
    """Schema for job vacancy response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class JobVacancyList(BaseModel):
    """Schema for paginated job vacancy list"""
    items: list[JobVacancyResponse]
    total: int
    skip: int
    limit: int