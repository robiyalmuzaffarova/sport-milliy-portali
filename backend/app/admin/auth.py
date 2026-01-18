from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, EmailStr
import bcrypt

from app.db.session import get_db, AsyncSessionLocal
from app.models.user import User, UserRole
from app.core.security import create_access_token, verify_password, get_current_active_user
from app.schemas.auth import TokenResponse
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
router = APIRouter()


class RegisterRequest(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    role: UserRole = UserRole.OBSERVER


class UserResponse(BaseModel):
    """User response"""
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True


@router.post("/login", response_model=TokenResponse)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(get_db)
):
    # Query user by email
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    # Verify user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )

    # Create access token
    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
        user_data: RegisterRequest,
        db: AsyncSession = Depends(get_db)
):
    try:
        # Check if user already exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Hash password
        password_bytes = user_data.password.encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')

        # Create new user
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            phone=user_data.phone,
            role=user_data.role,
            is_active=True,
            is_verified=False,
            is_superuser=False
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return new_user

    except IntegrityError as e:
        await db.rollback()
        if "users_email_key" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating user"
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
        current_user: User = Depends(get_current_active_user)
):
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    return {"message": "Logged out successfully"}


# Password reset endpoints (to be implemented)
@router.post("/password-reset-request")
async def request_password_reset(email: EmailStr, db: AsyncSession = Depends(get_db)):
    """Request password reset email"""
    # TODO: Implement password reset logic
    return {"message": "If the email exists, a reset link will be sent"}


@router.post("/password-reset")
async def reset_password(token: str, new_password: str, db: AsyncSession = Depends(get_db)):
    """Reset password with token"""
    # TODO: Implement password reset logic
    return {"message": "Password reset successful"}

class AdminAuthBackend(AuthenticationBackend):
    def __init__(self, secret_key: str):
        super().__init__(secret_key)

    async def login(self, request: Request) -> bool:  # type: ignore[override]
        form = await request.form()
        username = (form.get("username") or form.get("email") or "").strip()
        password = (form.get("password") or "")

        if not username or not password:
            return False

        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User).where(User.email == username))
            user: User | None = result.scalar_one_or_none()

            if not user:
                return False

            if not verify_password(password, user.hashed_password):
                return False

            if not user.is_active:
                return False

            # Only superusers and admins can access the admin panel
            is_allowed_role = user.is_superuser or user.role == UserRole.ADMIN
            if not is_allowed_role:
                return False

            # Persist authentication in session
            request.session["authenticated"] = True
            request.session["user_id"] = user.id
            request.session["email"] = user.email
            request.session["is_superuser"] = bool(user.is_superuser)
            request.session["role"] = user.role.value if hasattr(user.role, "value") else str(user.role)

            return True

    async def logout(self, request: Request) -> bool:  # type: ignore[override]
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:  # type: ignore[override]
        # Validate session on each admin request
        if not request.session.get("authenticated"):
            return False

        # Optional: enforce role on each request
        is_superuser = bool(request.session.get("is_superuser", False))
        role = request.session.get("role")
        if is_superuser:
            return True
        return role == (UserRole.ADMIN.value if hasattr(UserRole.ADMIN, "value") else str(UserRole.ADMIN))


def get_admin_auth() -> AuthenticationBackend:
    from app.core.config import settings
    return AdminAuthBackend(secret_key=settings.SECRET_KEY)
