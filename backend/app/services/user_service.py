"""
User Service - Business logic for user operations
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError

from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.core.password import get_password_hash, verify_password


class UserService:
    """Service for user-related operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_users(
            self,
            skip: int = 0,
            limit: int = 100,
            role: Optional[UserRole] = None
    ) -> List[User]:
        """Get list of users with pagination"""
        query = select(User)

        if role:
            query = query.where(User.role == role)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_user(self, user_data: UserCreate) -> User:
        """Create new user"""
        # Check if user already exists
        existing_user = await self.get_user_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        # Create user
        user = User(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            role=user_data.role or UserRole.OBSERVER,
            phone=user_data.phone,
            sport_type=user_data.sport_type,
            location=user_data.location,
            is_active=True
        )

        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def update_user(
            self,
            user_id: int,
            user_data: UserUpdate
    ) -> Optional[User]:
        """Update user information"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        # Update fields
        update_data = user_data.dict(exclude_unset=True)

        # Handle password separately
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(user, field, value)

        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def delete_user(self, user_id: int) -> bool:
        """Delete user"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return False

        await self.db.delete(user)
        await self.db.commit()

        return True

    async def authenticate_user(
            self,
            email: str,
            password: str
    ) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await self.get_user_by_email(email)
        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user

    async def verify_user(self, user_id: int) -> Optional[User]:
        """Mark user as verified"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.is_verified = True
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def update_subscription(
            self,
            user_id: int,
            is_subscribed: bool,
            expires_at: Optional[str] = None
    ) -> Optional[User]:
        """Update user subscription status"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.is_subscribed = is_subscribed
        if expires_at:
            user.subscription_expires_at = expires_at

        await self.db.commit()
        await self.db.refresh(user)

        return user