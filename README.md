# Sport Milliy Portali

**O'zbekiston Sportchilari va Murabbiylarining Ochiq Platformasi**

A unified open digital portfolio system for sports coaches and athletes in Uzbekistan, solving the problem of closed state databases and lack of visibility for talented individuals.

## 🎯 Project Overview

Sport Milliy Portali enables:
- Personal branding for athletes and trainers
- Online courses and merchandise sales
- Donations and job opportunities
- AI-powered recommendations
- Connections with private sports sectors

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Backend**: Python 3.11 + FastAPI + SQLAlchemy + PostgreSQL
- **Cache**: Redis
- **Queue**: Celery + RabbitMQ
- **Payments**: Click & Payme integration
- **Translation**: Automatic multilingual support (Uzbek, English, Russian)
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 15+
- Redis 7+

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/sport-milliy-portali.git
cd sport-milliy-portali

# Copy environment files
cp backend/.env backend/.env
cp frontend/.env frontend/.env.local

# Edit the .env files with your configuration
# Then start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create initial admin user
docker-compose exec backend python -m app.scripts.create_admin
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🗂️ Project Structure

```
sport-milliy-portali/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Core functionality
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── workers/           # Celery tasks
│   └── alembic/               # Database migrations
├── frontend/                   # Next.js frontend
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities
│   │   └── translations/      # i18n files
│   └── public/                # Static assets
└── docker/                     # Docker configs
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://sportuser:sportpass@localhost:5432/sportdb

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Translation API (choose one)
TRANSLATION_SERVICE=google  # google, deepl, or libretranslate
GOOGLE_TRANSLATE_API_KEY=your-api-key
# DEEPL_API_KEY=your-api-key
# LIBRETRANSLATE_URL=http://localhost:5000

# Payment Gateways
CLICK_MERCHANT_ID=your-click-merchant-id
CLICK_SERVICE_ID=your-click-service-id
CLICK_SECRET_KEY=your-click-secret-key
PAYME_MERCHANT_ID=your-payme-merchant-id
PAYME_SECRET_KEY=your-payme-secret-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Storage
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=10485760  # 10MB
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## 📚 API Documentation

After starting the backend, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🚢 Deployment

```bash
docker-compose -f docker-compose.production.yml up -d
```

`docker-compose.staging.yml` is the config actually running on the current shared VPS deployment — see the comment at the top of that file for how it differs from `docker-compose.production.yml` (a dedicated-server target).

## 🔒 Security

- JWT authentication (access token, no refresh token)
- RBAC (Role-Based Access Control) — see `backend/app/core/permissions.py`
- bcrypt password hashing
- Rate limiting (Redis-backed, fails open if Redis is unreachable)
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy) — set both at the nginx layer and by the backend

## 🌐 Multilingual Support

The platform supports three languages:
- **Uzbek** (default)
- **English**
- **Russian**

Automatic translation is powered by backend translation services with caching for performance.

## 💳 Payment Integration

Integrated with Uzbekistan's popular payment gateways:
- **Click**: https://click.uz
- **Payme**: https://payme.uz

## 📊 Database Schema

Key entities:
- Users (athletes, trainers, observers, admins)
- News & Articles
- Merchandise
- Job Vacancies
- Sport Academies
- AI Chat History
- Transactions & Payments

## 🤖 AI Features

- AI Sport Buddy: Personalized sport recommendations
- Sport type suggestions based on user profile
- Trainer recommendations
- Performance analytics (future)

## 📈 Monitoring

- Health check: `http://localhost:8000/health`

## 🛠️ Development Tools

- **Code Formatting**: Black, isort (Python)
- **Linting**: Flake8, mypy (Python) / ESLint (TypeScript)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Email**: info@sportmilliyportali.uz
- **Telegram**: @sportmilliyportali
- **Website**: https://sportmilliyportali.uz

## 🙏 Acknowledgments

- Uzbekistan Ministry of Sports
- All athletes and trainers who contributed to the platform
- Open source community

---

Made with ❤️ for Uzbekistan Sports Community
