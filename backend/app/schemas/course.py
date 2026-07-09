import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, HttpUrl
from app.models.course import CourseStatus, SportType


# ─── Shared base ──────────────────────────────────────────────────────────────

class CourseBase(BaseModel):
    title:            str       = Field(..., min_length=3, max_length=255)
    description:      Optional[str] = None
    sport_type:       SportType
    difficulty_level: int       = Field(1, ge=1, le=3)


# ─── Create (trainer/admin submits a new course) ──────────────────────────────

class CourseCreate(CourseBase):
    """
    Body sent when uploading a new course.

    NOTE: the actual `upload_course` endpoint doesn't use this schema — it accepts the video
    as multipart Form fields instead (video_url is generated server-side after the file is
    saved). This schema exists for a hypothetical alternate flow where a client already has
    a storage URL and just wants to register it. If you do wire that flow up, validate that
    video_url actually points at your own storage domain before trusting it — accepting an
    arbitrary client-supplied URL here without validation is a real risk (e.g. if it's ever
    fetched, displayed, or proxied server-side).
    """
    video_url:     str
    thumbnail_url: Optional[str] = None


# ─── Update (trainer edits a pending/rejected course) ─────────────────────────

class CourseUpdate(BaseModel):
    title:            Optional[str]       = Field(None, min_length=3, max_length=255)
    description:      Optional[str]       = None
    sport_type:       Optional[SportType] = None
    difficulty_level: Optional[int]       = Field(None, ge=1, le=3)
    thumbnail_url:    Optional[str]       = None


# ─── Admin review ─────────────────────────────────────────────────────────────

class CourseReview(BaseModel):
    """Body sent by admin when approving or rejecting a course."""
    status:           CourseStatus               # approved | rejected
    rejection_reason: Optional[str] = None       # required when rejecting


# ─── Uploader info embedded in responses ─────────────────────────────────────

class UploaderInfo(BaseModel):
    id:        int               # matches your User.id type (see users.py — plain int, not UUID)
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    sport_type: Optional[str] = None

    model_config = {"from_attributes": True}


# ─── Full response schema ─────────────────────────────────────────────────────

class CourseResponse(CourseBase):
    id:                uuid.UUID
    video_url:         str
    thumbnail_url:     Optional[str]
    duration_seconds:  Optional[int]
    qr_code_url:       Optional[str]
    qr_code_image_url: Optional[str]
    status:            CourseStatus
    rejection_reason:  Optional[str]
    view_count:        int
    rating:            float
    uploaded_by:       Optional[UploaderInfo]
    created_at:        datetime
    updated_at:        datetime

    model_config = {"from_attributes": True}


# ─── Paginated list response ──────────────────────────────────────────────────

class CoursesPage(BaseModel):
    items: List[CourseResponse]
    total: int
    skip:  int
    limit: int