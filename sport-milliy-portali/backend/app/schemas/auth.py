"""
Authentication Schemas
Sport Milliy Portali - Backend
"""
from pydantic import BaseModel, EmailStr


class TokenResponse(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    """Login request"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None


class PasswordResetRequest(BaseModel):
    """Password reset request"""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset with token"""
    token: str
    new_password: str


__all__ = [
    "TokenResponse",
    "LoginRequest",
    "RegisterRequest",
    "PasswordResetRequest",
    "PasswordReset"
]