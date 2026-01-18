from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import BaseModel

class Favorite(BaseModel):
    __tablename__ = "favorites"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    merch_id = Column(Integer, ForeignKey("merches.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="favorites")
    merch = relationship("Merch", back_populates="favorites")
