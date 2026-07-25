from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import BaseModel


class GalleryPhoto(BaseModel):
    """
    A single photo in a user's profile gallery. One user can have many
    photos - hence a separate table with a user_id foreign key.
    """
    __tablename__ = "gallery_photos"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)

    user = relationship("User", back_populates="gallery_photos")
