from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.cart import Cart
from app.models.merch import Merch
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()


@router.get("/")
async def view_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Cart)
        .options(selectinload(Cart.merch).selectinload(Merch.owner))
        .where(Cart.user_id == current_user.id)
    )
    items = result.scalars().all()

    return {
        "items": [
            {
                "id": item.id,
                "quantity": item.quantity,
                "merch_id": item.merch_id,
                "merch": {
                    "id": item.merch.id,
                    "name": item.merch.name,
                    "price": item.merch.price,
                    "image_url": item.merch.image_url,
                    "stock": item.merch.stock,
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


@router.post("/")
async def add_to_cart(
    body: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    merch_id = body.get("merch_id")
    quantity = body.get("quantity", 1)

    if not merch_id:
        raise HTTPException(status_code=400, detail="merch_id is required")

    prod_res = await db.execute(select(Merch).where(Merch.id == merch_id))
    merch = prod_res.scalar_one_or_none()
    if not merch:
        raise HTTPException(status_code=404, detail="Product not found")

    cart_res = await db.execute(
        select(Cart).where(Cart.user_id == current_user.id, Cart.merch_id == merch_id)
    )
    item = cart_res.scalar_one_or_none()

    if item:
        item.quantity += quantity
    else:
        item = Cart(user_id=current_user.id, merch_id=merch_id, quantity=quantity)
        db.add(item)

    await db.commit()
    return {"message": "Cart updated"}


@router.put("/{cart_id}")
async def update_cart_item(
    cart_id: int,
    body: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    quantity = body.get("quantity", 1)

    cart_res = await db.execute(
        select(Cart).where(Cart.id == cart_id, Cart.user_id == current_user.id)
    )
    item = cart_res.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    item.quantity = quantity
    await db.commit()
    return {"message": "Quantity updated"}


@router.delete("/{cart_id}")
async def remove_from_cart(
    cart_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cart_res = await db.execute(
        select(Cart).where(Cart.id == cart_id, Cart.user_id == current_user.id)
    )
    item = cart_res.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Item removed"}


@router.delete("/clear")
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Cart).where(Cart.user_id == current_user.id)
    )
    items = result.scalars().all()
    for item in items:
        await db.delete(item)
    await db.commit()
    return {"message": "Cart cleared"}