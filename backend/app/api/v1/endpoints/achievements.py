from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.models.achievement import Achievement
from app.schemas.achievement import AchievementCreate, AchievementResponse, AchievementListResponse
from app.core.security import get_current_active_user

router = APIRouter()


@router.get("/", response_model=AchievementListResponse)
async def list_achievements(
        user_id: Optional[int] = Query(None, description="Filter by user id; omit to require auth and use the current user"),
        db: AsyncSession = Depends(get_db)
):
    """
    Public list of a user's achievements (e.g. shown on their profile page).
    A user with no achievements simply gets an empty list - not an error.
    """
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="user_id query param is required")

    query = select(Achievement).where(Achievement.user_id == user_id).order_by(Achievement.created_at.desc())
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    result = await db.execute(query)
    items = result.scalars().all()
    return {"items": items, "total": total}


@router.post("/", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
async def create_achievement(
        data: AchievementCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Add an achievement to the current user's own profile."""
    achievement = Achievement(
        user_id=current_user.id,
        title=data.title,
        year=data.year,
        icon_type=data.icon_type,
    )
    db.add(achievement)
    await db.commit()
    await db.refresh(achievement)
    return achievement


@router.delete("/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_achievement(
        achievement_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Delete one of the current user's own achievements (or any, if superuser)."""
    result = await db.execute(select(Achievement).where(Achievement.id == achievement_id))
    achievement = result.scalar_one_or_none()
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    if achievement.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your achievement")

    await db.delete(achievement)
    await db.commit()
    return None
