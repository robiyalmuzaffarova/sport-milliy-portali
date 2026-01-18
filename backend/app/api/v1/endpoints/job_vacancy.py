from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.models.job_vacancy import JobVacancy
from app.schemas.job_vacancy import (
    JobVacancyCreate,
    JobVacancyUpdate,
    JobVacancyResponse,
    JobVacancyList
)
from app.core.security import get_current_active_user
from app.core.permissions import (
    Resource,
    Permission,
    require_permissions
)

router = APIRouter()


@router.get("/", response_model=JobVacancyList)
async def get_job_vacancy_list(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        is_active: Optional[bool] = None,
        search: Optional[str] = None,
        db: AsyncSession = Depends(get_db)
):
    """
    Get list of job vacancies (Public endpoint)

    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **is_active**: Filter by active status
    - **search**: Search in title, description, and company
    """
    query = select(JobVacancy)

    # Apply filters
    if is_active is not None:
        query = query.where(JobVacancy.is_active == is_active)

    if search:
        query = query.where(
            (JobVacancy.title.ilike(f"%{search}%")) |
            (JobVacancy.description.ilike(f"%{search}%")) |
            (JobVacancy.company.ilike(f"%{search}%"))
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination and ordering
    query = query.order_by(JobVacancy.created_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    job_list = result.scalars().all()

    return {
        "items": job_list,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{job_id}", response_model=JobVacancyResponse)
async def get_job_vacancy_detail(
        job_id: int,
        db: AsyncSession = Depends(get_db)
):
    """
    Get job vacancy details (Public endpoint)

    - **job_id**: ID of the job vacancy
    """
    result = await db.execute(
        select(JobVacancy).where(JobVacancy.id == job_id)
    )
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job vacancy not found"
        )

    return job


@router.post(
    "/",
    response_model=JobVacancyResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permissions(Resource.JOB_VACANCIES, [Permission.CREATE]))]
)
async def create_job_vacancy(
        job_data: JobVacancyCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Create a new job vacancy

    **Required permissions:** CREATE on JOB_VACANCIES resource
    **Allowed roles:** Superuser, Admin

    - **title**: Job title
    - **description**: Job description
    - **company**: Company name
    - **location**: Job location
    - **salary_range**: Salary range information
    - **contact**: Contact information
    - **is_active**: Active status
    """
    # Create job vacancy
    new_job = JobVacancy(**job_data.dict())

    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)

    return new_job


@router.put(
    "/{job_id}",
    response_model=JobVacancyResponse,
    dependencies=[Depends(require_permissions(Resource.JOB_VACANCIES, [Permission.UPDATE]))]
)
async def update_job_vacancy(
        job_id: int,
        job_data: JobVacancyUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Update a job vacancy

    **Required permissions:** UPDATE on JOB_VACANCIES resource
    **Allowed roles:** Superuser, Admin

    - **job_id**: ID of the job vacancy to update
    """
    # Get existing job
    result = await db.execute(
        select(JobVacancy).where(JobVacancy.id == job_id)
    )
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job vacancy not found"
        )

    # Update fields
    update_data = job_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)

    await db.commit()
    await db.refresh(job)

    return job


@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permissions(Resource.JOB_VACANCIES, [Permission.DELETE]))]
)
async def delete_job_vacancy(
        job_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Delete a job vacancy

    **Required permissions:** DELETE on JOB_VACANCIES resource
    **Allowed roles:** Superuser, Admin

    - **job_id**: ID of the job vacancy to delete
    """
    # Get job
    result = await db.execute(select(JobVacancy).where(JobVacancy.id == job_id))
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job vacancy not found"
        )

    await db.delete(job)
    await db.commit()

    return None