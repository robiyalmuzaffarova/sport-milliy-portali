from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class MerchBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    brand: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: int = Field(..., gt=0)
    stock: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
    category: str = Field(default="equipment", description="clothing, equipment, accessories, footwear")

class MerchCreate(MerchBase):
    """Schema for creating merchandise"""
    pass

class MerchUpdate(BaseModel):
    """Schema for updating merchandise"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    brand: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[int] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    category: Optional[str] = None

class MerchResponse(MerchBase):
    """Schema for merchandise response"""
    id: int
    owner_id: Optional[int]
    is_available: bool
    category: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MerchList(BaseModel):
    """Schema for paginated merchandise list"""
    items: list[MerchResponse]
    total: int
    skip: int
    limit: int