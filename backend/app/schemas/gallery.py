from datetime import datetime
from pydantic import BaseModel


class GalleryPhotoResponse(BaseModel):
    id: int
    user_id: int
    image_url: str
    created_at: datetime  # maps to the "uploaded_at" concept from the spec

    class Config:
        from_attributes = True


class GalleryPhotoListResponse(BaseModel):
    items: list[GalleryPhotoResponse]
    total: int
