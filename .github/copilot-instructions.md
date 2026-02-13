# AI Copilot Instructions - Sport Milliy Portali

## Project Overview
Sport Milliy Portali is a full-stack platform connecting Uzbek athletes, trainers, and sports enthusiasts. It's a FastAPI + Next.js application with PostgreSQL, Redis, and Celery for async tasks.

## Architecture

### Backend (FastAPI + Python 3.11)
- **Entry point**: [backend/app/main.py](backend/app/main.py)
- **Config**: Settings via Pydantic in [backend/app/core/config.py](backend/app/core/config.py) - loaded from environment variables
- **Database**: PostgreSQL with SQLAlchemy async ORM; migrations via Alembic
- **API**: RESTful `/api/v1/` routes organized by feature (auth, news, merches, users, etc.)
- **Authentication**: JWT tokens in [backend/app/core/security.py](backend/app/core/security.py); user roles in `UserRole` enum (admin, athlete, trainer, observer)

### Frontend (Next.js 14 + React 18 + TypeScript)
- **App Router**: Server/client components in [frontend/app/](frontend/app/)
- **Styling**: Tailwind CSS with dark theme (#050505 bg, red #FF0000 primary, purple #800080 secondary)
- **UI Library**: Radix UI primitives in [frontend/components/ui/](frontend/components/ui/)
- **Internationalization**: Uzbek, English, Russian support; configured in [frontend/lib/i18n/](frontend/lib/i18n/)
- **API Integration**: Client in [frontend/lib/api/](frontend/lib/api/) for backend calls

### Data Models (All in [backend/app/models/](backend/app/models/))
- **BaseModel** ([backend/app/db/base.py](backend/app/db/base.py)): All models inherit this; includes `id`, `created_at`, `updated_at`
- **User**: Athletes, trainers, admins; has relationships to News, Merch, AIChat, Cart, Transactions
- **News, Merch, Education, JobVacancy**: Content owned by users; cascade delete enabled
- **Cart, Favorite, Transaction**: User interactions; linked via foreign keys

### Key Services
- **Authentication**: [backend/app/services/auth_service.py](backend/app/services/auth_service.py)
- **Email**: [backend/app/services/email_service.py](backend/app/services/email_service.py)
- **News**: [backend/app/services/news_service.py](backend/app/services/news_service.py)
- **User**: [backend/app/services/user_service.py](backend/app/services/user_service.py)

All service methods use async/await with SQLAlchemy AsyncSession dependency injection.

## Critical Development Workflows

### Starting Development
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

### Docker Workflow (Recommended)
```bash
docker-compose up -d          # Start all services (postgres, redis, rabbitmq, backend, frontend, celery)
docker-compose exec backend alembic upgrade head  # Run migrations
docker-compose logs -f backend  # Monitor backend
```

### Database Migrations
- **Create migration**: `alembic revision --autogenerate -m "describe changes"`
- **Apply**: `alembic upgrade head`
- **Rollback**: `alembic downgrade -1`
- Migrations stored in [backend/alembic/versions/](backend/alembic/versions/)

### Running Tests
- Backend: `pytest backend/tests/` (pytest configured in project)
- Frontend: `npm test` in frontend/
- Integration tests use test database; never run migrations in test env

## Project Conventions

### Backend Patterns
1. **Request/Response Schemas**: Pydantic models in [backend/app/schemas/](backend/app/schemas/) named after features (e.g., `auth.py`, `news.py`)
   - Use `BaseModel` as parent; enable `from_attributes=True` for ORM conversion
   - Example: `class UserResponse(BaseModel): id: int; email: str; class Config: from_attributes = True`

2. **Endpoints Structure**: Feature-based routers in [backend/app/api/v1/endpoints/](backend/app/api/v1/endpoints/)
   - Each file defines a FastAPI `APIRouter`; main router in [backend/app/api/v1/router.py](backend/app/api/v1/router.py) includes all
   - Pattern: `@router.get("/{id}")`, `@router.post("/")`, etc.; always use `AsyncSession = Depends(get_db)` for DB access

3. **Authentication**: All protected endpoints use `get_current_active_user` dependency
   - Example: `async def get_endpoint(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db))`
   - User roles checked via `if current_user.role != UserRole.ADMIN: raise HTTPException(403)`

4. **Error Handling**: Raise `HTTPException` with appropriate status codes (401 auth, 403 forbidden, 404 not found, 422 validation)
   - Include descriptive `detail` message

5. **Database Queries**: Use SQLAlchemy async patterns
   ```python
   result = await db.execute(select(User).where(User.id == user_id))
   user = result.scalar_one_or_none()  # Returns None if not found
   ```

6. **Relationships**: Models declare relationships with `relationship()` and `cascade="all, delete-orphan"`
   - Example: `news_articles = relationship("News", back_populates="author", cascade="all, delete-orphan")`

### Frontend Patterns
1. **Component Organization**: 
   - Reusable UI: [frontend/components/ui/](frontend/components/ui/) (buttons, forms, dialogs)
   - Feature components: [frontend/components/features/](frontend/components/features/) (actual app features)
   - Layout components: [frontend/components/layout/](frontend/components/layout/) (header, nav, footer)

2. **API Calls**: Use client-side fetch in [frontend/lib/api/](frontend/lib/api/) or direct `fetch()` with error handling
   - Pattern: `const response = await fetch('/api/v1/endpoint', { headers: { Authorization: `Bearer ${token}` } })`

3. **Styling**: Tailwind classes only; use responsive prefixes (`md:`, `lg:`, `dark:`)
   - Dark theme as default; classes like `bg-slate-950 text-red-500`

4. **Forms**: React Hook Form + Zod or Pydantic validation mirrored on frontend

5. **Language**: Pages support i18n via translation keys; auto-detect user language preference

## Tech Stack Details

### Core Dependencies
- **Backend**: FastAPI 0.109+, SQLAlchemy 2.0+, Pydantic 2.0, alembic, celery, redis, bcrypt/argon2
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 3, Radix UI, TanStack Query (React Query)
- **Infrastructure**: PostgreSQL 15, Redis 7, RabbitMQ 3, Docker, Kubernetes (k8s manifests in [k8s/](k8s/))

### External Services
- **Payments**: Click & Payme integration (config in [backend/app/core/config.py](backend/app/core/config.py))
- **Translation**: Google Translate API (configurable; see `TRANSLATION_SERVICE` in config)
- **Email**: SMTP (Gmail default; configure SMTP_HOST, SMTP_USER, SMTP_PASSWORD)

## Common Tasks

### Adding a New API Endpoint
1. Create Pydantic schema in [backend/app/schemas/feature_name.py](backend/app/schemas/feature_name.py)
2. Add endpoint function in [backend/app/api/v1/endpoints/feature_name.py](backend/app/api/v1/endpoints/feature_name.py)
3. Use dependency injection: `db: AsyncSession = Depends(get_db)`, `current_user = Depends(get_current_active_user)`
4. Query with SQLAlchemy async, return response schema
5. Router auto-included in [backend/app/api/v1/router.py](backend/app/api/v1/router.py)

### Adding a Database Model
1. Create model in [backend/app/models/model_name.py](backend/app/models/model_name.py) inheriting `BaseModel`
2. Define columns (String, Integer, Boolean, Enum, Text, DateTime, etc.) with nullable, unique, index flags
3. Add relationships to related models
4. Create Alembic migration: `alembic revision --autogenerate -m "add model_name table"`
5. Apply: `alembic upgrade head`

### Adding Async Background Task
1. Define task in [backend/app/workers/tasks.py](backend/app/workers/tasks.py) with `@celery_app.task` decorator
2. Call from endpoint: `task_function.apply_async(args=[param])`
3. Celery worker auto-processes via RabbitMQ queue

## Deployment & DevOps

### Docker Compose Services
- **postgres**: PostgreSQL 15; health checks via `pg_isready`
- **redis**: Redis 7 cache layer
- **rabbitmq**: RabbitMQ 3 with management UI (port 15672)
- **backend**: FastAPI uvicorn server
- **celery-worker**: Background task processor
- **celery-beat**: Periodic task scheduler
- **frontend**: Next.js server
- **nginx**: Reverse proxy; config in [docker/nginx/nginx.conf](docker/nginx/nginx.conf)

All services restart unless explicitly stopped; named `sport-portal-*` for easy identification.

### Production Deployment
- Kubernetes manifests in [k8s/](k8s/) (deployment.yaml, service.yaml, ingress.yaml)
- GitHub Actions CI/CD in [.github/workflows/](github/workflows/)
- Environment variables for all sensitive config (never hardcode tokens, secrets, URLs)

## Testing & Quality

- **Pytest** for backend unit & integration tests
- **ESLint** for frontend linting (run `npm run lint`)
- All tests must pass before merging PRs
- Use fixtures for test data; mock external services (email, payments, translation APIs)

## Documentation References
- **Main README**: [README.md](README.md) - Architecture, tech stack, quick start
- **API Reference**: [docs/API.md](docs/API.md)
- **Security Audit**: [docs/SECURITY.md](docs/SECURITY.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Quick Setup**: [QUICKSTART.md](QUICKSTART.md)

## Important Notes

1. **Always maintain backward compatibility**: Old API clients may rely on current response structure
2. **Use async/await**: Never block in backend; all I/O must be async
3. **Validate inputs**: Pydantic schemas auto-validate; add custom validators if needed
4. **Rate limiting**: [backend/app/core/rate_limiter.py](backend/app/core/rate_limiter.py) configured; may be applied globally or per-endpoint
5. **Internationalization**: All user-facing strings support Uzbek, English, Russian
6. **Error messages**: Always provide actionable error details to frontend (but never internal stack traces in production)
7. **Performance**: Use Redis caching for frequently accessed data; query optimization critical for high-traffic endpoints
