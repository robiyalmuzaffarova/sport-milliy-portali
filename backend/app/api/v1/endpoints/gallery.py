from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.models.gallery_photo import GalleryPhoto
from app.schemas.gallery import GalleryPhotoResponse, GalleryPhotoListResponse
from app.core.security import get_current_active_user
from app.api.v1.endpoints.course import _save_upload, ALLOWED_IMAGE_EXTENSIONS

router = APIRouter()

MAX_GALLERY_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB, same limit as avatar/verification docs


@router.get("/", response_model=GalleryPhotoListResponse)
async def list_gallery_photos(
        user_id: Optional[int] = Query(None, description="Filter by user id"),
        db: AsyncSession = Depends(get_db)
):
    """Public list of a user's gallery photos. Empty gallery -> empty list, not an error."""
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="user_id query param is required")

    query = select(GalleryPhoto).where(GalleryPhoto.user_id == user_id).order_by(GalleryPhoto.created_at.desc())
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    result = await db.execute(query)
    items = result.scalars().all()
    return {"items": items, "total": total}


@router.post("/", response_model=GalleryPhotoResponse, status_code=status.HTTP_201_CREATED)
async def upload_gallery_photo(
        photo: UploadFile = File(...),
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Upload a photo to the current user's own gallery."""
    image_url = _save_upload(photo, "gallery", ALLOWED_IMAGE_EXTENSIONS, MAX_GALLERY_IMAGE_SIZE_BYTES)

    entry = GalleryPhoto(user_id=current_user.id, image_url=image_url)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_photo(
        photo_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """Delete one of the current user's own gallery photos (or any, if superuser)."""
    result = await db.execute(select(GalleryPhoto).where(GalleryPhoto.id == photo_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")
    if entry.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your photo")

    await db.delete(entry)
    await db.commit()
    return None
