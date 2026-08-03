from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.session import get_db
from app.models.follow import Follow
from app.models.user import User
from app.core.security import get_current_active_user
from app.schemas.follow import FollowToggleResponse, FollowStatusResponse

router = APIRouter()


@router.post("/toggle/{user_id}", response_model=FollowToggleResponse)
async def toggle_follow(
        user_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    target_res = await db.execute(select(User).where(User.id == user_id))
    if not target_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="User not found")

    existing_res = await db.execute(
        select(Follow).where(Follow.follower_id == current_user.id, Follow.followed_id == user_id)
    )
    existing = existing_res.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        result_status = "unfollowed"
    else:
        db.add(Follow(follower_id=current_user.id, followed_id=user_id))
        result_status = "followed"

    await db.commit()

    count = await db.scalar(
        select(func.count()).select_from(Follow).where(Follow.followed_id == user_id)
    )
    return {"status": result_status, "followers_count": count}


@router.get("/status/{user_id}", response_model=FollowStatusResponse)
async def get_follow_status(
        user_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    existing_res = await db.execute(
        select(Follow).where(Follow.follower_id == current_user.id, Follow.followed_id == user_id)
    )
    return {"is_following": existing_res.scalar_one_or_none() is not None}
