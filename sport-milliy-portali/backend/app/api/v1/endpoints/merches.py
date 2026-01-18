from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Optional

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.merch import Merch
from app.schemas.merch import (
    MerchCreate,
    MerchUpdate,
    MerchResponse,
    MerchList
)
from app.core.security import get_current_active_user
from app.core.permissions import (
    Resource,
    Permission,
    require_permissions,
    has_permission,
    verify_resource_ownership
)

router = APIRouter()


@router.get("/", response_model=MerchList)
async def get_merches_list(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        search: Optional[str] = None,
        is_available: Optional[bool] = None,
        db: AsyncSession = Depends(get_db)
):
    query = select(Merch).options(selectinload(Merch.owner))

    # Apply filters
    if is_available is not None:
        query = query.where(Merch.is_available == is_available)

    if search:
        query = query.where(
            (Merch.name.ilike(f"%{search}%")) |
            (Merch.description.ilike(f"%{search}%")) |
            (Merch.brand.ilike(f"%{search}%"))
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination and ordering
    query = query.order_by(Merch.created_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    merches = result.scalars().all()

    return {
        "items": merches,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{merch_id}", response_model=MerchResponse)
async def get_merch_detail(
        merch_id: int,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Merch)
        .options(selectinload(Merch.owner))
        .where(Merch.id == merch_id)
    )
    merch = result.scalar_one_or_none()

    if not merch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchandise not found"
        )

    return merch


@router.post(
    "/",
    response_model=MerchResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permissions(Resource.MERCHES, [Permission.CREATE]))]
)
async def create_merch(
        merch_data: MerchCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Create new merchandise

    **Required permissions:** CREATE on MERCHES resource
    **Allowed roles:** Superuser, Admin, Athlete (own merch)

    - **name**: Merchandise name
    - **brand**: Brand name
    - **description**: Description
    - **price**: Price in UZS
    - **stock**: Available stock
    - **image_url**: Optional image URL
    """
    # Create merchandise
    new_merch = Merch(
        **merch_data.dict(),
        owner_id=current_user.id
    )

    db.add(new_merch)
    await db.commit()
    await db.refresh(new_merch)

    # Load owner relationship
    await db.refresh(new_merch, ["owner"])

    return new_merch


@router.put(
    "/{merch_id}",
    response_model=MerchResponse,
    dependencies=[Depends(require_permissions(Resource.MERCHES, [Permission.UPDATE]))]
)
async def update_merch(
        merch_id: int,
        merch_data: MerchUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Update merchandise

    **Required permissions:** UPDATE on MERCHES resource
    **Allowed roles:** Superuser, Admin (any merch), Athlete (own merch only)

    - **merch_id**: ID of the merchandise to update
    """
    # Get existing merch
    result = await db.execute(
        select(Merch)
        .options(selectinload(Merch.owner))
        .where(Merch.id == merch_id)
    )
    merch = result.scalar_one_or_none()

    if not merch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchandise not found"
        )

    # Check ownership for non-admin/superuser
    if current_user.role == UserRole.ATHLETE:
        if not await verify_resource_ownership(merch_id, current_user, Merch, db, "owner_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only edit your own merchandise"
            )

    # Update fields
    update_data = merch_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(merch, field, value)

    await db.commit()
    await db.refresh(merch)

    return merch


@router.delete(
    "/{merch_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permissions(Resource.MERCHES, [Permission.DELETE]))]
)
async def delete_merch(
        merch_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Delete merchandise

    **Required permissions:** DELETE on MERCHES resource
    **Allowed roles:** Superuser, Admin (any merch), Athlete (own merch only)

    - **merch_id**: ID of the merchandise to delete
    """
    # Get merch
    result = await db.execute(select(Merch).where(Merch.id == merch_id))
    merch = result.scalar_one_or_none()

    if not merch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchandise not found"
        )

    # Check ownership for athletes
    if current_user.role == UserRole.ATHLETE:
        if not await verify_resource_ownership(merch_id, current_user, Merch, db, "owner_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own merchandise"
            )

    await db.delete(merch)
    await db.commit()

    return None


@router.get("/my/merchandise")
async def get_my_merches(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Get current user's merchandise

    **Requires authentication**

    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    # Query user's merches
    query = (
        select(Merch)
        .options(selectinload(Merch.owner))
        .where(Merch.owner_id == current_user.id)
    )

    # Get total count
    count_query = select(func.count()).select_from(
        select(Merch).where(Merch.owner_id == current_user.id).subquery()
    )
    total = await db.scalar(count_query)

    # Apply pagination
    query = query.order_by(Merch.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    merches = result.scalars().all()

    return {
        "items": merches,
        "total": total,
        "skip": skip,
        "limit": limit
    }
