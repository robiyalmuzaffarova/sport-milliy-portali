from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.cart import Cart
from app.models.merch import Merch
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.post("/add/{merch_id}")
async def add_to_cart(
    merch_id: int,
    db: AsyncSession = Depends(get_db),
    user = Depends(get_current_active_user)
):
    # 1. Verify existence
    prod_res = await db.execute(select(Merch).where(Merch.id == merch_id))
    if not prod_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Check current cart
    cart_res = await db.execute(
        select(Cart).where(Cart.user_id == user.id, Cart.merch_id == merch_id)
    )
    item = cart_res.scalar_one_or_none()

    if item:
        item.quantity += 1
    else:
        new_item = Cart(user_id=user.id, merch_id=merch_id, quantity=1)
        db.add(new_item)

    await db.commit()
    return {"message": "Cart updated"}

@router.get("/")
async def view_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all items in current user's cart."""
    result = await db.execute(
        select(Cart).where(Cart.user_id == current_user.id)
    )
    return result.scalars().all()

@router.delete("/remove/{merch_id}")
async def remove_from_cart(
    merch_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Completely remove an item from the cart."""
    cart_result = await db.execute(
        select(Cart).where(
            Cart.user_id == current_user.id,
            Cart.merch_id == merch_id
        )
    )
    item = cart_result.scalar_one_or_none()
    if item:
        await db.delete(item)
        await db.commit()
    return {"message": "Item removed"}