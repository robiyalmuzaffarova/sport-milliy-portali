"""Schemas package"""
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserInDB
from app.schemas.auth import TokenResponse, LoginRequest
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from app.schemas.merch import MerchCreate, MerchUpdate, MerchResponse
from app.schemas.common import PaginatedResponse, MessageResponse, ErrorResponse

__all__ = [
    "UserCreate",
    "UserUpdate", 
    "UserResponse",
    "UserInDB",
    "TokenResponse",
    "LoginRequest",
    "NewsCreate",
    "NewsUpdate",
    "NewsResponse",
    "MerchCreate",
    "MerchUpdate",
    "MerchResponse",
    "PaginatedResponse",
    "MessageResponse",
    "ErrorResponse",
]
