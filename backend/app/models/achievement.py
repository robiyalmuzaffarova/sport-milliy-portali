from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import BaseModel


class Achievement(BaseModel):
    """
    A single achievement/award entry belonging to a user (athlete/trainer).
    One user can have many achievements - hence a separate table with a
    user_id foreign key, rather than a column on users.
    """
    __tablename__ = "achievements"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    year = Column(String(10), nullable=True)
    # Which icon to render on the frontend: "trophy" | "medal" | "star"
    icon_type = Column(String(20), nullable=False, default="trophy")

    user = relationship("User", back_populates="achievement_entries")
