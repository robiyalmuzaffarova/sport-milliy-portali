#!/bin/bash

# Create all model files
mkdir -p app/models app/schemas app/services app/api/v1/endpoints app/workers

# Additional Models
cat > app/models/favorite.py << 'EOF'
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import BaseModel

class Favorite(BaseModel):
    __tablename__ = "favorites"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    merch_id = Column(Integer, ForeignKey("merches.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="favorites")
    merch = relationship("Merch", back_populates="favorites")
EOF

cat > app/models/cart.py << 'EOF'
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import BaseModel

class Cart(BaseModel):
    __tablename__ = "cart"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    merch_id = Column(Integer, ForeignKey("merches.id", ondelete="CASCADE"))
    quantity = Column(Integer, default=1)
    user = relationship("User", back_populates="cart_items")
    merch = relationship("Merch", back_populates="cart_items")
EOF

cat > app/models/ai_chat.py << 'EOF'
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.base import BaseModel

class AIChat(BaseModel):
    __tablename__ = "ai_chats"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    is_user_message = Column(Boolean, default=True)
    user = relationship("User", back_populates="ai_chats")
EOF

cat > app/models/job_vacancy.py << 'EOF'
from sqlalchemy import Column, String, Text, Integer, Boolean
from app.db.base import BaseModel

class JobVacancy(BaseModel):
    __tablename__ = "job_vacancies"
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    salary_range = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
EOF

cat > app/models/education.py << 'EOF'
from sqlalchemy import Column, String, Text, Enum
import enum
from app.db.base import BaseModel

class Region(str, enum.Enum):
    TASHKENT = "tashkent"
    SAMARKAND = "samarkand"
    BUKHARA = "bukhara"
    OTHER = "other"

class Education(BaseModel):
    __tablename__ = "education"
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    region = Column(Enum(Region), nullable=False)
    address = Column(String(500), nullable=True)
    working_hours = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
EOF

cat > app/models/transaction.py << 'EOF'
from sqlalchemy import Column, String, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.db.base import BaseModel

class TransactionType(str, enum.Enum):
    PURCHASE = "purchase"
    DONATION = "donation"
    SUBSCRIPTION = "subscription"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class Transaction(BaseModel):
    __tablename__ = "transactions"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    amount = Column(Integer, nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    payment_method = Column(String(50), nullable=True)
    external_id = Column(String(255), nullable=True)
    user = relationship("User", back_populates="transactions")
EOF

cat > app/models/comment.py << 'EOF'
from sqlalchemy import Column, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import BaseModel

class Comment(BaseModel):
    __tablename__ = "comments"
    content = Column(Text, nullable=False)
    news_id = Column(Integer, ForeignKey("news.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    news = relationship("News", back_populates="comments")
EOF

echo "✓ All models created"

# Create API Router
cat > app/api/v1/router.py << 'EOF'
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, news, ai_buddy, merches, favorites, cart

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(news.router, prefix="/news", tags=["News"])
api_router.include_router(ai_buddy.router, prefix="/ai-buddy", tags=["AI Buddy"])
api_router.include_router(merches.router, prefix="/merches", tags=["Merchandise"])
api_router.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
EOF

# Create basic endpoint templates
cat > app/api/v1/endpoints/auth.py << 'EOF'
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import create_access_token, create_refresh_token

router = APIRouter()

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return {"access_token": "demo_token", "token_type": "bearer"}

@router.post("/register")
async def register(db: AsyncSession = Depends(get_db)):
    return {"message": "User registered successfully"}
EOF

cat > app/api/v1/endpoints/users.py << 'EOF'
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.get("/me")
async def get_current_user(db: AsyncSession = Depends(get_db)):
    return {"id": 1, "email": "user@example.com"}
EOF

cat > app/api/v1/endpoints/news.py << 'EOF'
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_news(db: AsyncSession = Depends(get_db)):
    return []

@router.post("/")
async def create_news(db: AsyncSession = Depends(get_db)):
    return {"id": 1, "title": "News created"}
EOF

cat > app/api/v1/endpoints/ai_buddy.py << 'EOF'
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.post("/chat")
async def chat_with_ai(message: dict, db: AsyncSession = Depends(get_db)):
    return {"response": "AI response here"}
EOF

cat > app/api/v1/endpoints/merches.py << 'EOF'
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_merches(db: AsyncSession = Depends(get_db)):
    return []
EOF

cat > app/api/v1/endpoints/favorites.py << 'EOF'
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_favorites(db: AsyncSession = Depends(get_db)):
    return []
EOF

cat > app/api/v1/endpoints/cart.py << 'EOF'
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_cart(db: AsyncSession = Depends(get_db)):
    return []
EOF

# Create Celery worker
cat > app/workers/celery_app.py << 'EOF'
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "sport_portal_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer=settings.CELERY_TASK_SERIALIZER,
    result_serializer=settings.CELERY_RESULT_SERIALIZER,
    timezone=settings.CELERY_TIMEZONE,
    enable_utc=True,
)
EOF

cat > app/workers/tasks.py << 'EOF'
from app.workers.celery_app import celery_app

@celery_app.task
def send_email_task(email: str, subject: str, body: str):
    """Send email asynchronously"""
    print(f"Sending email to {email}: {subject}")
    return True

@celery_app.task
def process_payment_task(transaction_id: int):
    """Process payment asynchronously"""
    print(f"Processing payment for transaction {transaction_id}")
    return True
EOF

echo "✓ All endpoints and workers created"
echo "✓ Backend structure generation complete!"
