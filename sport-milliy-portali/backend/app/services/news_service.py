"""News Service"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.news import News, NewsCategory
from app.schemas.news import NewsCreate, NewsUpdate
from slugify import slugify

class NewsService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_news_by_id(self, news_id: int) -> Optional[News]:
        result = await self.db.execute(select(News).where(News.id == news_id))
        return result.scalar_one_or_none()
    
    async def get_news_list(
        self, 
        skip: int = 0, 
        limit: int = 100,
        category: Optional[NewsCategory] = None
    ) -> List[News]:
        query = select(News)
        if category:
            query = query.where(News.category == category)
        query = query.offset(skip).limit(limit).order_by(News.created_at.desc())
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create_news(self, news_data: NewsCreate, author_id: int) -> News:
        news = News(
            title=news_data.title,
            slug=slugify(news_data.title),
            content=news_data.content,
            snippet=news_data.snippet,
            image_url=news_data.image_url,
            category=news_data.category,
            author_id=author_id
        )
        self.db.add(news)
        await self.db.commit()
        await self.db.refresh(news)
        return news
    
    async def update_news(self, news_id: int, news_data: NewsUpdate) -> Optional[News]:
        news = await self.get_news_by_id(news_id)
        if not news:
            return None
        
        update_data = news_data.dict(exclude_unset=True)
        if "title" in update_data:
            update_data["slug"] = slugify(update_data["title"])
        
        for field, value in update_data.items():
            setattr(news, field, value)
        
        await self.db.commit()
        await self.db.refresh(news)
        return news
    
    async def delete_news(self, news_id: int) -> bool:
        news = await self.get_news_by_id(news_id)
        if not news:
            return False
        await self.db.delete(news)
        await self.db.commit()
        return True
