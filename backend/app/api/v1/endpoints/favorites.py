from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.favorite import Favorite
from app.models.merch import Merch
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()


@router.get("/")
async def get_my_favorites(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Favorite)
        .options(selectinload(Favorite.merch).selectinload(Merch.owner))
        .where(Favorite.user_id == current_user.id)
    )
    items = result.scalars().all()

    return {
        "items": [
            {
                "id": item.id,
                "merch_id": item.merch_id,
                "merch": {
                    "id": item.merch.id,
                    "name": item.merch.name,
                    "description": item.merch.description,
                    "price": item.merch.price,
                    "discount_percent": item.merch.discount_percent,
                    "image_url": item.merch.image_url,
                    "stock": item.merch.stock,
                    "category": item.merch.category,
                    "owner": {
                        "full_name": item.merch.owner.full_name if item.merch.owner else "Sportchi",
                        "avatar_url": item.merch.owner.avatar_url if item.merch.owner else None,
                    } if item.merch.owner else None
                } if item.merch else None
            }
            for item in items
        ],
        "total": len(items)
    }


@router.post("/toggle/{merch_id}")
async def toggle_favorite(
        merch_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_active_user)
):
    prod_res = await db.execute(select(Merch).where(Merch.id == merch_id))
    if not prod_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Product not found")

    fav_res = await db.execute(
        select(Favorite).where(Favorite.user_id == user.id, Favorite.merch_id == merch_id)
    )
    existing = fav_res.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"status": "unliked"}

    new_fav = Favorite(user_id=user.id, merch_id=merch_id)
    db.add(new_fav)
    await db.commit()
    return {"status": "liked"}


@router.delete("/{favorite_id}")
async def remove_favorite(
        favorite_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    fav_res = await db.execute(
        select(Favorite).where(
            Favorite.id == favorite_id,
            Favorite.user_id == current_user.id
        )
    )
    item = fav_res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Favorite not found")
    await db.delete(item)
    await db.commit()
    return {"message": "Removed from favorites"}