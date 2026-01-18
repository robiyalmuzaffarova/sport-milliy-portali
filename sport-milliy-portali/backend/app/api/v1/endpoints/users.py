from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
import bcrypt

from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse
from app.core.security import get_current_active_user
from app.core.permissions import (
    Resource,
    Permission,
    require_permissions,
    require_superuser
)

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_active_user)):
    """Get current authenticated user's profile"""
    return current_user


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
    return current_user


@router.get("/", response_model=UserListResponse, dependencies=[Depends(require_permissions(Resource.USERS, [Permission.READ]))])
async def get_users_list(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        role: Optional[UserRole] = None,
        is_active: Optional[bool] = None,
        search: Optional[str] = None,
        current_user: User = Depends(get_current_active_user),
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


@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_permissions(Resource.USERS, [Permission.READ]))])
async def get_user_detail(
        user_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Get user details"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


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