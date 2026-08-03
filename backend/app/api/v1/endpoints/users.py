from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
import bcrypt

from app.db.session import get_db
from app.models.user import User, UserRole, VerificationStatus
from app.models.follow import Follow
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse, VerificationUpdate
from app.core.security import get_current_active_user
from app.core.permissions import (
    Resource,
    Permission,
    require_permissions,
    require_superuser
)
from app.api.v1.endpoints.course import _save_upload, ALLOWED_IMAGE_EXTENSIONS

router = APIRouter()

MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024  # 5MB
MAX_COVER_SIZE_BYTES = 8 * 1024 * 1024  # 8MB
MAX_VERIFICATION_DOC_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


async def _attach_follow_counts(db: AsyncSession, user: User) -> User:
    """
    followers_count / following_count aren't stored columns — they're derived
    from the follows table. Attached as plain attributes on the ORM instance
    right before returning, so UserResponse (from_attributes) picks them up.
    """
    user.followers_count = await db.scalar(
        select(func.count()).select_from(Follow).where(Follow.followed_id == user.id)
    )
    user.following_count = await db.scalar(
        select(func.count()).select_from(Follow).where(Follow.follower_id == user.id)
    )
    return user


@router.get("/me", response_model=UserResponse)
async def read_user_me(
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db),
):
    """Get current authenticated user's profile"""
    return await _attach_follow_counts(db, current_user)


@router.put("/me", response_model=UserResponse)
async def update_user_me(
        user_data: UserUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    update_data = user_data.dict(exclude_unset=True, exclude={'role', 'is_superuser', 'is_active'})

    if 'password' in update_data and update_data['password']:
        password_bytes = update_data['password'].encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
        current_user.hashed_password = hashed_password
        del update_data['password']

    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return await _attach_follow_counts(db, current_user)


@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
        avatar: UploadFile = File(...),
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Upload/replace the current user's profile picture. Used both right after
    registration and later from the profile edit form.
    """
    avatar_url = _save_upload(avatar, "avatars", ALLOWED_IMAGE_EXTENSIONS, MAX_AVATAR_SIZE_BYTES)
    current_user.avatar_url = avatar_url
    await db.commit()
    await db.refresh(current_user)
    return await _attach_follow_counts(db, current_user)


@router.post("/me/cover", response_model=UserResponse)
async def upload_cover(
        cover: UploadFile = File(...),
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Upload/replace the current user's cover/banner photo (profile page backdrop)."""
    cover_url = _save_upload(cover, "covers", ALLOWED_IMAGE_EXTENSIONS, MAX_COVER_SIZE_BYTES)
    current_user.cover_url = cover_url
    await db.commit()
    await db.refresh(current_user)
    return await _attach_follow_counts(db, current_user)


@router.delete("/me")
async def delete_own_account(
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Self-service account deletion, from the profile Settings panel.
    Returns 200 + a JSON body (not 204) because the frontend's shared fetchApi
    helper unconditionally calls response.json() on success, which throws on
    a genuinely empty 204 body.
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Superuser accounts can't be self-deleted; ask another admin.",
        )
    await db.delete(current_user)
    await db.commit()
    return {"message": "Account deleted"}


@router.post("/me/verification-document", response_model=UserResponse)
async def upload_verification_document(
        document: UploadFile = File(...),
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Upload a passport/ID photo to request profile verification. Sets
    verification_status to 'pending' until a superuser approves or rejects it
    via PATCH /users/{id}/verification.
    """
    if current_user.role not in (UserRole.ATHLETE, UserRole.TRAINER):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only athletes and trainers can request profile verification",
        )

    passport_url = _save_upload(document, "verification", ALLOWED_IMAGE_EXTENSIONS, MAX_VERIFICATION_DOC_SIZE_BYTES)
    current_user.passport_url = passport_url
    current_user.verification_status = VerificationStatus.PENDING
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.patch("/{user_id}/verification", response_model=UserResponse, dependencies=[Depends(require_superuser())])
async def review_verification(
        user_id: int,
        data: VerificationUpdate,
        db: AsyncSession = Depends(get_db)
):
    """
    Superuser approves or rejects a pending profile verification request.
    MVP moderation - no dedicated admin UI, call this directly (e.g. from
    Swagger or a future admin panel) with {"status": "verified"} or
    {"status": "rejected"}.
    """
    if data.status not in (VerificationStatus.VERIFIED, VerificationStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="status must be 'verified' or 'rejected'",
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.verification_status = data.status
    user.is_verified = (data.status == VerificationStatus.VERIFIED)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/", response_model=UserListResponse)
async def get_users_list(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        role: Optional[UserRole] = None,
        is_active: Optional[bool] = None,
        search: Optional[str] = None,
        db: AsyncSession = Depends(get_db)
):
    """Get list of users"""
    query = select(User)

    if role:
        query = query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    if search:
        query = query.where(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return {"items": users, "total": total, "skip": skip, "limit": limit}

@router.get("/{user_id}/", response_model=UserResponse)
async def get_user_detail(
        user_id: int,
        db: AsyncSession = Depends(get_db)
):
    """Get user details"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return await _attach_follow_counts(db, user)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_superuser())])
async def create_user(
        user_data: UserCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Create a new user (Superuser only)

    This endpoint creates users with default values for all optional fields.
    """
    try:
        # Check if email exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User with this email already exists")

        # Hash password
        password_bytes = user_data.password.encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')

        # Create user - the model has defaults for everything except email, full_name, and hashed_password
        new_user = User(
            # Required fields
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,

            # Optional profile fields
            phone=user_data.phone,
            bio=user_data.bio,
            sport_type=user_data.sport_type,
            location=user_data.location,

            # Role (has default but we can override)
            role=user_data.role if user_data.role else UserRole.OBSERVER,

            # These have defaults in the model, but we set them explicitly for clarity
            is_active=True,
            is_verified=False,
            is_superuser=False,
            is_subscribed=False,
            views_count=0,
            donations_received=0
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        # Return detailed error in response so you can see it in Swagger
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {type(e).__name__}: {str(e)}"
        )


@router.put("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_superuser())])
async def update_user(
        user_id: int,
        user_data: UserUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Update a user (Superuser only)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent removing own superuser status
    if user.id == current_user.id and 'is_superuser' in user_data.dict(exclude_unset=True):
        if user_data.is_superuser == False:
            raise HTTPException(status_code=400, detail="Cannot remove your own superuser status")

    update_data = user_data.dict(exclude_unset=True)

    if 'password' in update_data and update_data['password']:
        password_bytes = update_data['password'].encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
        user.hashed_password = hashed_password
        del update_data['password']

    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204, dependencies=[Depends(require_superuser())])
async def delete_user(
        user_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Delete a user (Superuser only)"""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_superuser:
        raise HTTPException(status_code=400, detail="Cannot delete a superuser account")

    await db.delete(user)
    await db.commit()
    return None
