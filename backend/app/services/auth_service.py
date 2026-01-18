"""
Authentication Service
"""
from datetime import timedelta
from typing import Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.auth import Token
from app.services.user_service import UserService
from app.core.security import create_access_token, create_refresh_token
from app.core.config import settings


class AuthService:
    """Service for authentication operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)

    async def login(self, email: str, password: str) -> Optional[Token]:
        """
        Authenticate user and return tokens
        """
        # Authenticate user
        user = await self.user_service.authenticate_user(email, password)
        if not user:
            return None

        # Check if user is active
        if not user.is_active:
            return None

        # Create tokens
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value}
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user.id)}
        )

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    async def refresh_access_token(
            self,
            user_id: int
    ) -> Optional[str]:
        """
        Refresh access token using user ID
        """
        user = await self.user_service.get_user_by_id(user_id)
        if not user or not user.is_active:
            return None

        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value}
        )

        return access_token