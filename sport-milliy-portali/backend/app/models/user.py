"""
User Model
"""
from sqlalchemy import Column, String, Boolean, Enum, Text, Integer
from sqlalchemy.orm import relationship
import enum

from app.db.base import BaseModel


class UserRole(str, enum.Enum):
    """User roles"""
    ADMIN = "admin"
    ATHLETE = "athlete"
    TRAINER = "trainer"
    OBSERVER = "observer"


class User(BaseModel):
    """
    User model for authentication and profile
    """
    __tablename__ = "users"
    
    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Role and permissions
    role = Column(Enum(UserRole), default=UserRole.OBSERVER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Athlete/Trainer specific
    sport_type = Column(String(100), nullable=True)  # football, boxing, wrestling, etc.
    location = Column(String(255), nullable=True)  # Tashkent, Samarkand, etc.
    achievements = Column(Text, nullable=True)
    
    # Verification documents (for athletes/trainers)
    passport_url = Column(String(500), nullable=True)
    certificate_url = Column(String(500), nullable=True)
    
    # Subscription (for trainers)
    is_subscribed = Column(Boolean, default=False, nullable=False)
    subscription_expires_at = Column(String(50), nullable=True)
    
    # Statistics
    views_count = Column(Integer, default=0, nullable=False)
    donations_received = Column(Integer, default=0, nullable=False)  # in UZS
    
    # Relationships
    news_articles = relationship("News", back_populates="author", cascade="all, delete-orphan")
    merches = relationship("Merch", back_populates="owner", cascade="all, delete-orphan")
    ai_chats = relationship("AIChat", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("Cart", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
