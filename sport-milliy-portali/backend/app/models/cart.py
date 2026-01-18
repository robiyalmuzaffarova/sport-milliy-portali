from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import BaseModel

class Cart(BaseModel):
    __tablename__ = "cart"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    merch_id = Column(Integer, ForeignKey("merches.id", ondelete="CASCADE"))
    quantity = Column(Integer, default=1)
    user = relationship("User", back_populates="cart_items")
    merch = relationship("Merch", back_populates="cart_items")
