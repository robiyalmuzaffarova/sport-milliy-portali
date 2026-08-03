"""
Follow model — a user (follower) following another user (followed).
"""
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint

from app.db.base import BaseModel


class Follow(BaseModel):
    """One row per follower -> followed relationship."""
    __tablename__ = "follows"

    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    followed_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint("follower_id", "followed_id", name="uq_follow_follower_followed"),
    )

    def __repr__(self):
        return f"<Follow(follower_id={self.follower_id}, followed_id={self.followed_id})>"
