"""Merch Model"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.db.base import BaseModel

class Merch(BaseModel):
    """Personal merchandise model"""
    __tablename__ = "merches"
    
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)  # in UZS
    stock = Column(Integer, default=0, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="merches")
    
    favorites = relationship("Favorite", back_populates="merch", cascade="all, delete-orphan")
    cart_items = relationship("Cart", back_populates="merch", cascade="all, delete-orphan")
