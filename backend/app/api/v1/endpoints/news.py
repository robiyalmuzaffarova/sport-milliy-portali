from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.news import News, NewsCategory
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse, NewsList
from app.core.security import get_current_active_user
from app.core.permissions import (
    Resource,
    Permission,
    require_permissions,
    verify_resource_ownership
)

router = APIRouter()


@router.get("/", response_model=NewsList)
async def get_news_list(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        category: Optional[NewsCategory] = None,
        search: Optional[str] = None,
        db: AsyncSession = Depends(get_db)
):
    query = select(News).options(selectinload(News.author))

    # Apply filters
    if category:
        query = query.where(News.category == category)

    if search:
        query = query.where(
            (News.title.ilike(f"%{search}%")) |
            (News.content.ilike(f"%{search}%"))
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination and ordering
    query = query.order_by(News.created_at.desc()).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    news_list = result.scalars().all()

    return {
        "items": news_list,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{news_id}/", response_model=NewsResponse)
async def get_news_detail(
        news_id: int,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(News)
        .options(selectinload(News.author))
        .where(News.id == news_id)
    )
    news = result.scalar_one_or_none()

    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found"
        )

    # Increment views count safely (handle legacy NULL values)
    try:
        news.views_count = (news.views_count or 0) + 1
        await db.commit()
        # Ensure fresh scalar columns (including updated_at) are loaded to avoid async lazy-load during serialization
        await db.refresh(news)
        # Ensure relationships are loaded for response serialization
        await db.refresh(news, ["author"])
    except Exception:
        # If increment fails for any reason, don't break the endpoint
        await db.rollback()
    return news


@router.post(
    "/",
    response_model=NewsResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permissions(Resource.NEWS, [Permission.CREATE]))]
)
async def create_news(
        news_data: NewsCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Create a new news article

    **Required permissions:** CREATE on NEWS resource  
    **Allowed roles:** ADMIN (any news), TRAINER (own news)

    - **title**: Article title
    - **content**: Article content
    - **category**: News category
    - **image_url**: Optional image URL
    """
    # Generate slug from title
    from slugify import slugify
    slug = slugify(news_data.title)

    # Check if slug already exists
    result = await db.execute(select(News).where(News.slug == slug))
    if result.scalar_one_or_none():
        # Append timestamp to make it unique
        import time
        slug = f"{slug}-{int(time.time())}"

    # Create news article
    new_news = News(
        title=news_data.title,
        slug=slug,
        content=news_data.content,
        snippet=news_data.snippet or news_data.content[:200],
        image_url=news_data.image_url,
        category=news_data.category,
        author_id=current_user.id,
        author=current_user
    )

    db.add(new_news)
    await db.commit()
    await db.refresh(new_news)

    # Load author relationship
    await db.refresh(new_news, ["author"])

    return new_news


@router.put(
    "/{news_id}/",
    response_model=NewsResponse,
    dependencies=[Depends(require_permissions(Resource.NEWS, [Permission.UPDATE]))]
)
async def update_news(
        news_id: int,
        news_data: NewsUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Update a news article

    **Required permissions:** UPDATE on NEWS resource  
    **Allowed roles:** ADMIN (any news), TRAINER (own news only)

    - **news_id**: ID of the news article to update
    """
    # Get existing news article
    result = await db.execute(
        select(News)
        .options(selectinload(News.author))
        .where(News.id == news_id)
    )
    news = result.scalar_one_or_none()

    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found"
        )

    # Check ownership (trainers can only edit their own news)
    if current_user.role == UserRole.TRAINER:
        if not await verify_resource_ownership(news_id, current_user, News, db, "author_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only edit your own news articles"
            )

    # Update fields
    update_data = news_data.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(news, field, value)

    # Update slug if title changed
    if "title" in update_data:
        from slugify import slugify
        news.slug = slugify(update_data["title"])

    await db.commit()
    await db.refresh(news)

    return news


@router.delete(
    "/{news_id}/",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permissions(Resource.NEWS, [Permission.DELETE]))]
)
async def delete_news(
        news_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Delete a news article

    **Required permissions:** DELETE on NEWS resource  
    **Allowed roles:** ADMIN (any news), TRAINER (own news only)

    - **news_id**: ID of the news article to delete
    """
    # Get news article
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar_one_or_none()

    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found"
        )

    # Check ownership (trainers can only delete their own news)
    if current_user.role == UserRole.TRAINER:
        if not await verify_resource_ownership(news_id, current_user, News, db, "author_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own news articles"
            )

    await db.delete(news)
    await db.commit()

    return None


@router.get("/my/articles", response_model=NewsList)
async def get_my_news(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Get current user's news articles

    **Requires authentication**

    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    # Query user's news
    query = (
        select(News)
        .options(selectinload(News.author))
        .where(News.author_id == current_user.id)
    )

    # Get total count
    count_query = select(func.count()).select_from(
        select(News).where(News.author_id == current_user.id).subquery()
    )
    total = await db.scalar(count_query)

    # Apply pagination
    query = query.order_by(News.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    news_list = result.scalars().all()

    return {
        "items": news_list,
        "total": total,
        "skip": skip,
        "limit": limit
    }