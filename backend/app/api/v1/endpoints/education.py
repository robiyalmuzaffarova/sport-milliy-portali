from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.models.education import Education, Region, EducationType
from app.schemas.education import (
    EducationCreate,
    EducationUpdate,
    EducationResponse,
    EducationList
)
from app.core.security import get_current_active_user
from app.core.permissions import (
    Resource,
    Permission,
    require_permissions
)

router = APIRouter()


@router.get("/", response_model=EducationList)
async def get_education_list(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        region: Optional[Region] = None,
        type: Optional[EducationType] = None,
        search: Optional[str] = None,
        db: AsyncSession = Depends(get_db)
):
    """
    Get list of education institutions (Public endpoint)

    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **region**: Filter by region
    - **type**: Filter by institution type (academy, federation, school, club)
    - **search**: Search in name and description
    """
    query = select(Education)

    # Apply filters
    if region:
        query = query.where(Education.region == region)
    
    if type:
        query = query.where(Education.type == type)

    if search:
        query = query.where(
            (Education.name.ilike(f"%{search}%")) |
            (Education.description.ilike(f"%{search}%"))
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination and ordering
    query = query.order_by(Education.created_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    education_list = result.scalars().all()

    return {
        "items": education_list,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{education_id}", response_model=EducationResponse)
async def get_education_detail(
        education_id: int,
        db: AsyncSession = Depends(get_db)
):
    """
    Get education institution details (Public endpoint)

    - **education_id**: ID of the education institution
    """
    result = await db.execute(
        select(Education).where(Education.id == education_id)
    )
    education = result.scalar_one_or_none()

    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education institution not found"
        )

    return education


@router.post(
    "/",
    response_model=EducationResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permissions(Resource.EDUCATION, [Permission.CREATE]))]
)
async def create_education(
        education_data: EducationCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Create a new education institution

    **Required permissions:** CREATE on EDUCATION resource
    **Allowed roles:** Superuser, Admin

    - **name**: Institution name
    - **description**: Institution description
    - **region**: Region/location
    - **address**: Full address
    - **working_hours**: Working hours information
    - **image_url**: Optional image URL
    """
    # Create education institution
    new_education = Education(**education_data.dict())

    db.add(new_education)
    await db.commit()
    await db.refresh(new_education)

    return new_education


@router.put(
    "/{education_id}",
    response_model=EducationResponse,
    dependencies=[Depends(require_permissions(Resource.EDUCATION, [Permission.UPDATE]))]
)
async def update_education(
        education_id: int,
        education_data: EducationUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Update an education institution

    **Required permissions:** UPDATE on EDUCATION resource
    **Allowed roles:** Superuser, Admin

    - **education_id**: ID of the education institution to update
    """
    # Get existing education
    result = await db.execute(
        select(Education).where(Education.id == education_id)
    )
    education = result.scalar_one_or_none()

    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education institution not found"
        )

    # Update fields
    update_data = education_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(education, field, value)

    await db.commit()
    await db.refresh(education)

    return education


@router.delete(
    "/{education_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permissions(Resource.EDUCATION, [Permission.DELETE]))]
)
async def delete_education(
        education_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Delete an education institution

    **Required permissions:** DELETE on EDUCATION resource
    **Allowed roles:** Superuser, Admin

    - **education_id**: ID of the education institution to delete
    """
    # Get education
    result = await db.execute(select(Education).where(Education.id == education_id))
    education = result.scalar_one_or_none()

    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education institution not found"
        )

    await db.delete(education)
    await db.commit()

    return None