from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    news,
    users,
    merches,
    education,
    job_vacancy,
    favorites,
    cart,
    course,
    ai_buddy,
    achievements,
    gallery
)

api_router = APIRouter()

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# User Management
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Content Management (Admin can CRUD these)
api_router.include_router(news.router, prefix="/news", tags=["News"])
api_router.include_router(merches.router, prefix="/merches", tags=["Merchandise"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])
api_router.include_router(job_vacancy.router, prefix="/job-vacancies", tags=["Job Vacancies"])

# User Features
api_router.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
api_router.include_router(cart.router, prefix="/cart", tags=["Shopping Cart"])
api_router.include_router(ai_buddy.router, prefix="/ai-buddy", tags=["AI Buddy"])
api_router.include_router(course.router, prefix="/courses", tags=["Courses"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["Achievements"])
api_router.include_router(gallery.router, prefix="/gallery", tags=["Gallery"])
