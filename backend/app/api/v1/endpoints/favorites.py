from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.favorite import Favorite
from app.models.merch import Merch
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()


@router.post("/toggle/{merch_id}")
async def toggle_favorite(
        merch_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_active_user)
):
    # 1. Check if product exists
    prod_res = await db.execute(select(Merch).where(Merch.id == merch_id))
    if not prod_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Check if already favorited
    fav_res = await db.execute(
        select(Favorite).where(Favorite.user_id == user.id, Favorite.merch_id == merch_id)
    )
    existing = fav_res.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"status": "unliked"}

    # 3. Add new favorite
    new_fav = Favorite(user_id=user.id, merch_id=merch_id)
    db.add(new_fav)
    await db.commit()
    return {"status": "liked"}

@router.get("/")
async def get_my_favorites(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id)
    )
    return result.scalars().all()