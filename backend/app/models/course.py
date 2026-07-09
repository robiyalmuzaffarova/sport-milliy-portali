import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Enum,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base        


# ─── Enums ────────────────────────────────────────────────────────────────────

class CourseStatus(str, PyEnum):
    """Lifecycle state of a course video."""
    pending   = "pending"    # Uploaded by trainer, awaiting admin review
    approved  = "approved"   # Approved by admin → visible to all users
    rejected  = "rejected"   # Rejected by admin → hidden, trainer notified
    draft     = "draft"      # Saved by trainer but not yet submitted


class SportType(str, PyEnum):
    """Sport categories available for filtering."""
    futbol      = "Futbol"
    kurash      = "Kurash"
    boks        = "Boks"
    tennis      = "Tennis"
    suzish      = "Suzish"
    gimnastika  = "Gimnastika"
    atletika    = "Atletika"
    basketbol   = "Basketbol"
    voleybol    = "Voleybol"
    karate      = "Karate"
    taekwondo   = "Taekwondo"
    other       = "Boshqa"


# ─── Model ────────────────────────────────────────────────────────────────────

class Course(Base):
    """
    Represents a sport training course video uploaded by a trainer or admin.

    Flow:
      trainer uploads → status=pending
      admin approves  → status=approved  (publicly visible)
      admin rejects   → status=rejected  (hidden, trainer can resubmit)
    """
    __tablename__ = "courses"

    # Primary key — UUID for security (no sequential IDs exposed in QR codes)
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # ── Content fields ─────────────────────────────────────────────────────
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    sport_type  = Column(Enum(SportType), nullable=False, index=True)

    # Stored path/URL after upload (e.g. S3 key or local path)
    video_url   = Column(String(1024), nullable=False)

    # Optional thumbnail image URL (auto-generated or manually uploaded)
    thumbnail_url = Column(String(1024), nullable=True)

    # Duration in seconds (extracted server-side on upload)
    duration_seconds = Column(Integer, nullable=True)

    # Difficulty: 1=Beginner, 2=Intermediate, 3=Advanced
    difficulty_level = Column(Integer, default=1, nullable=False)

    # ── QR code ────────────────────────────────────────────────────────────
    # URL that the QR code encodes — points to the course detail page
    qr_code_url = Column(String(1024), nullable=True)

    # Path/URL to the generated QR code image (PNG stored on server/S3)
    qr_code_image_url = Column(String(1024), nullable=True)

    # ── Status & moderation ────────────────────────────────────────────────
    status = Column(
        Enum(CourseStatus),
        default=CourseStatus.pending,
        nullable=False,
        index=True,
    )

    # Optional rejection note from admin shown to the trainer
    rejection_reason = Column(Text, nullable=True)

    # When admin reviewed the course
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    # ── Relationships ──────────────────────────────────────────────────────
    # The user who uploaded the course (trainer or admin)
    # Adjust ForeignKey to match your users table name
    uploaded_by_id = Column(
        Integer,            # ← change to UUID if your users.id is UUID
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # The admin who reviewed the course
    reviewed_by_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    uploaded_by = relationship(
    "User",
    foreign_keys=[uploaded_by_id],
    lazy="select",
    )
    
    reviewed_by = relationship(
        "User",
        foreign_keys=[reviewed_by_id],
        lazy="joined",
    )

    # ── Engagement stats (optional, can be removed if not needed) ──────────
    view_count = Column(Integer, default=0, nullable=False)
    rating     = Column(Float, default=0.0, nullable=False)

    # ── Timestamps ─────────────────────────────────────────────────────────
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Course id={self.id} title={self.title!r} status={self.status}>"


# ─── Add to your User model ───────────────────────────────────────────────────
"""
In your existing User model, add this relationship so the ORM can navigate
from a user to their uploaded courses:

    uploaded_courses = relationship(
        "Course",
        foreign_keys="Course.uploaded_by_id",
        back_populates="uploaded_by",
        lazy="dynamic",
    )
"""