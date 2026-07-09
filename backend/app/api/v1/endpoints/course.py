import io
import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List

import qrcode
from PIL import Image as PILImage

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.core.security import get_current_active_user
from app.core.permissions import require_superuser
from app.models.course import Course, CourseStatus, SportType
from app.models.user import User, UserRole
from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseReview,
    CourseResponse,
    CoursesPage,
)
# NOTE: best guess based on your app.core.security / app.core.permissions layout.
# If this import fails, tell me the real path to your settings object and I'll fix it.
from app.core.config import settings


router = APIRouter()

ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".avi"}
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_VIDEO_SIZE_MB   = 500
MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024
MEDIA_DIR = settings.UPLOAD_DIR


# ─── Helpers (no DB access) ───────────────────────────────────────────────────

def _save_upload(
    upload: UploadFile,
    subfolder: str,
    allowed_extensions: set[str],
    max_size_bytes: Optional[int] = None,
) -> str:
    """
    Save an uploaded file to MEDIA_DIR/{subfolder}/ and return its relative URL.
    Replace this entire function with S3/GCS logic if you use cloud storage.

    The extension is checked against an explicit allowlist here — the client's
    Content-Type header (checked separately by callers) is not trustworthy on
    its own, since it's just a header the client sets and can be spoofed.
    """
    ext = os.path.splitext(upload.filename or "")[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension: {ext or '(none)'}. "
                   f"Allowed: {', '.join(sorted(allowed_extensions))}",
        )

    dest_dir = os.path.join(MEDIA_DIR, subfolder)
    os.makedirs(dest_dir, exist_ok=True)

    filename = f"{uuid.uuid4()}{ext}"
    dest     = os.path.join(dest_dir, filename)

    size = 0
    chunk_size = 1024 * 1024  # 1 MB at a time, so we never buffer a huge file fully in memory
    try:
        with open(dest, "wb") as f:
            while True:
                chunk = upload.file.read(chunk_size)
                if not chunk:
                    break
                size += len(chunk)
                if max_size_bytes and size > max_size_bytes:
                    raise HTTPException(
                        status_code=400,
                        detail=f"File exceeds the maximum allowed size of "
                               f"{max_size_bytes // (1024 * 1024)}MB.",
                    )
                f.write(chunk)
    except HTTPException:
        # Clean up the partial file so a rejected oversized upload doesn't linger on disk
        if os.path.exists(dest):
            os.remove(dest)
        raise

    return f"/uploads/{subfolder}/{filename}"


def _generate_qr(course_id: uuid.UUID) -> tuple[str, str]:
    """
    Generate a QR code PNG for the course detail page.
    Returns (qr_code_url, qr_code_image_url).
    """
    detail_url = f"{settings.FRONTEND_URL}/courses/{course_id}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(detail_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#1a2e1a", back_color="white")

    qr_dir      = os.path.join(MEDIA_DIR, "qrcodes")
    os.makedirs(qr_dir, exist_ok=True)
    qr_filename = f"course_{course_id}.png"
    qr_path     = os.path.join(qr_dir, qr_filename)
    img.save(qr_path)

    qr_image_url = f"/uploads/qrcodes/{qr_filename}"
    return detail_url, qr_image_url


# ─── Public endpoints (approved courses only) ─────────────────────────────────

@router.get("", response_model=CoursesPage)
async def list_courses(
    skip:        int                  = Query(0, ge=0),
    limit:       int                  = Query(20, ge=1, le=100),
    sport_type:  Optional[SportType]  = Query(None, description="Filter by sport type"),
    search:      Optional[str]        = Query(None, description="Search in title/description"),
    db:          AsyncSession         = Depends(get_db),
):
    """
    Public endpoint — returns only approved courses.
    Supports search (title + description) and filter by sport_type.
    """
    query = (
        select(Course)
        .options(selectinload(Course.uploaded_by))
        .where(Course.status == CourseStatus.approved)
    )

    if sport_type:
        query = query.where(Course.sport_type == sport_type)

    if search:
        term = f"%{search}%"
        query = query.where(
            (Course.title.ilike(term)) | (Course.description.ilike(term))
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    query = query.order_by(Course.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/my", response_model=CoursesPage)
async def list_my_courses(
    skip:  int          = Query(0, ge=0),
    limit: int          = Query(20, ge=1, le=100),
    db:    AsyncSession = Depends(get_db),
    current_user: User  = Depends(get_current_active_user),
):
    query = (
        select(Course)
        .options(selectinload(Course.uploaded_by))
        .where(Course.uploaded_by_id == current_user.id)
    )

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    query = query.order_by(Course.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: uuid.UUID,
    db:        AsyncSession = Depends(get_db),
):
    """Public — returns a single approved course and increments its view count."""
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.uploaded_by))
        .where(
            Course.id == course_id,
            Course.status == CourseStatus.approved,
        )
    )
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Increment view count (guard against legacy NULLs, same pattern as news.py)
    course.view_count = (course.view_count or 0) + 1
    await db.commit()
    # Only re-pull the columns that actually changed server-side — refreshing with no
    # attribute_names would expire (and re-lazy-load) the uploaded_by relationship too,
    # which crashes under async SQLAlchemy since it isn't loaded inside a query here.
    await db.refresh(course, attribute_names=["view_count", "updated_at"])

    return course


@router.get("/{course_id}/qr/download")
async def download_qr(
    course_id: uuid.UUID,
    db:        AsyncSession = Depends(get_db),
):
    """
    Download the QR code PNG for a specific course.
    Returns the image as a file attachment so the browser saves it.
    """
    result = await db.execute(
        select(Course).where(
            Course.id == course_id,
            Course.status == CourseStatus.approved,
        )
    )
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if not course.qr_code_image_url:
        raise HTTPException(status_code=404, detail="QR code not generated yet")

    qr_path = course.qr_code_image_url.lstrip("/")   # strip leading slash
    if not os.path.exists(qr_path):
        raise HTTPException(status_code=404, detail="QR code file missing")

    with open(qr_path, "rb") as f:
        data = f.read()

    safe_title = "".join(c if c.isalnum() else "_" for c in course.title)[:40]
    filename   = f"qr_{safe_title}.png"

    return StreamingResponse(
        io.BytesIO(data),
        media_type="image/png",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ─── Trainer / authenticated upload ──────────────────────────────────────────

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def upload_course(
    # Metadata sent as form fields alongside the file
    title:            str        = Form(..., min_length=3, max_length=255),
    description:      str        = Form(""),
    sport_type:       SportType  = Form(...),
    difficulty_level: int        = Form(1, ge=1, le=3),
    video:            UploadFile = File(...),
    thumbnail:        Optional[UploadFile] = File(None),
    db:               AsyncSession = Depends(get_db),
    current_user:     User        = Depends(get_current_active_user),
):
    """
    Trainer (or admin) uploads a new course video.
    - Trainers: course lands in status=pending, awaiting admin approval.
    - Superusers: course is auto-approved and goes live immediately.
    """
    is_admin = current_user.is_superuser

    # Only trainers and superusers may upload — everyone else is blocked outright,
    # rather than just being denied the auto-approval fast path.
    if current_user.role != UserRole.TRAINER and not is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only trainers or admins can upload courses.",
        )

    # Content-Type header is client-supplied and can be spoofed, so it's checked
    # here as a first pass, but the real enforcement is the extension allowlist
    # (and size limit) inside _save_upload.
    if video.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video type: {video.content_type}. "
                   f"Allowed: {', '.join(ALLOWED_VIDEO_TYPES)}",
        )

    # Save video file
    video_url = _save_upload(
        video, "courses/videos",
        allowed_extensions=ALLOWED_VIDEO_EXTENSIONS,
        max_size_bytes=MAX_VIDEO_SIZE_BYTES,
    )

    # Save thumbnail if provided
    thumbnail_url = None
    if thumbnail and thumbnail.filename:
        if thumbnail.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported thumbnail type: {thumbnail.content_type}. "
                       f"Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}",
            )
        thumbnail_url = _save_upload(
            thumbnail, "courses/thumbnails",
            allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
        )

    initial_status = CourseStatus.approved if is_admin else CourseStatus.pending

    course = Course(
        title            = title,
        description      = description,
        sport_type       = sport_type,
        difficulty_level = difficulty_level,
        video_url        = video_url,
        thumbnail_url    = thumbnail_url,
        status           = initial_status,
        uploaded_by_id   = current_user.id,
        reviewed_by_id   = current_user.id if is_admin else None,
        reviewed_at      = datetime.now(timezone.utc) if is_admin else None,
    )
    # Assign the relationship directly from the User object we already have in memory
    # (current_user), rather than letting CourseResponse trigger a lazy-load on it later.
    course.uploaded_by = current_user

    db.add(course)
    await db.flush()   # get the UUID before generating QR

    # Generate QR code
    qr_url, qr_image_url      = _generate_qr(course.id)
    course.qr_code_url        = qr_url
    course.qr_code_image_url  = qr_image_url

    await db.commit()
    # Narrow refresh to just the server-generated columns — refreshing with no
    # attribute_names would expire the uploaded_by relationship we just set manually above,
    # forcing a lazy-load on the next access (which crashes under async SQLAlchemy).
    await db.refresh(course, attribute_names=["created_at", "updated_at"])
    return course


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: uuid.UUID,
    payload:   CourseUpdate,
    db:        AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Trainer edits their own pending or rejected course.
    Re-submits it for review (status → pending).
    """
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.uploaded_by))
        .where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    is_admin = current_user.is_superuser
    is_owner = course.uploaded_by_id == current_user.id

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Not allowed")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, field, value)

    # Re-submit for review if it was rejected
    if course.status == CourseStatus.rejected and not is_admin:
        course.status           = CourseStatus.pending
        course.rejection_reason = None

    await db.commit()
    # Narrow refresh to updated_at only — everything else was already set in memory from
    # payload above, and a full refresh would expire the eagerly-loaded uploaded_by relation.
    await db.refresh(course, attribute_names=["updated_at"])
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id:    uuid.UUID,
    db:           AsyncSession = Depends(get_db),
    current_user: User         = Depends(get_current_active_user),
):
    """Owner or admin can delete a course."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    is_admin = current_user.is_superuser
    is_owner = course.uploaded_by_id == current_user.id

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Not allowed")

    await db.delete(course)
    await db.commit()


# ─── Admin-only endpoints ─────────────────────────────────────────────────────

@router.get("/admin/pending", response_model=CoursesPage)
async def list_pending_courses(
    skip:  int          = Query(0, ge=0),
    limit: int          = Query(20, ge=1, le=100),
    db:    AsyncSession = Depends(get_db),
    _:     User         = Depends(require_superuser()),
):
    """Admin view — all courses awaiting review."""
    query = (
        select(Course)
        .options(selectinload(Course.uploaded_by))
        .where(Course.status == CourseStatus.pending)
    )

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    query = query.order_by(Course.created_at.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/admin/all", response_model=CoursesPage)
async def list_all_courses_admin(
    skip:       int                  = Query(0, ge=0),
    limit:      int                  = Query(20, ge=1, le=100),
    status_:    Optional[CourseStatus] = Query(None, alias="status"),
    sport_type: Optional[SportType]  = Query(None),
    db:         AsyncSession         = Depends(get_db),
    _:          User                 = Depends(require_superuser()),
):
    """Admin view — all courses regardless of status, with optional filters."""
    query = select(Course).options(selectinload(Course.uploaded_by))

    if status_:
        query = query.where(Course.status == status_)
    if sport_type:
        query = query.where(Course.sport_type == sport_type)

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    query = query.order_by(Course.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/{course_id}/review", response_model=CourseResponse)
async def review_course(
    course_id:    uuid.UUID,
    payload:      CourseReview,
    db:           AsyncSession = Depends(get_db),
    current_user: User         = Depends(require_superuser()),
):
    """
    Admin approves or rejects a pending course.
    - approved → immediately visible to all users
    - rejected → hidden; trainer sees rejection_reason
    """
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.uploaded_by))
        .where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if course.status != CourseStatus.pending:
        raise HTTPException(
            status_code=400,
            detail=f"Course is already {course.status}. "
                   "Only pending courses can be reviewed.",
        )

    if payload.status == CourseStatus.rejected and not payload.rejection_reason:
        raise HTTPException(
            status_code=422,
            detail="rejection_reason is required when rejecting a course.",
        )

    course.status           = payload.status
    course.rejection_reason = payload.rejection_reason
    course.reviewed_by_id   = current_user.id
    course.reviewed_at      = datetime.now(timezone.utc)

    await db.commit()
    # Narrow refresh to updated_at only, same reasoning as update_course above.
    await db.refresh(course, attribute_names=["updated_at"])
    return course