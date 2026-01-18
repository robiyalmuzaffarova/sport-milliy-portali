# Sport Milliy Portali - Complete Project Structure

## 📁 Project Tree

```
sport-milliy-portali/
│
├── 📄 README.md                      # Main documentation
├── 📄 docker-compose.yml             # Docker orchestration
├── 📄 .gitignore                     # Git ignore rules
├── 📄 setup.sh                       # Automated setup script
├── 📄 PROJECT_STRUCTURE.md           # This file
│
├── 📁 backend/                       # FastAPI Backend
│   ├── 📄 Dockerfile                 # Backend container
│   ├── 📄 requirements.txt           # Python dependencies
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 alembic.ini                # Alembic config
│   │
│   ├── 📁 app/                       # Application code
│   │   ├── 📄 main.py                # FastAPI entry point
│   │   │
│   │   ├── 📁 api/v1/                # API routes
│   │   │   ├── 📄 router.py          # Main router
│   │   │   └── 📁 endpoints/         # API endpoints
│   │   │       ├── 📄 auth.py        # Authentication
│   │   │       ├── 📄 users.py       # Users
│   │   │       ├── 📄 news.py        # News
│   │   │       ├── 📄 ai_buddy.py    # AI chat
│   │   │       ├── 📄 merches.py     # Merchandise
│   │   │       ├── 📄 favorites.py   # Favorites
│   │   │       └── 📄 cart.py        # Shopping cart
│   │   │
│   │   ├── 📁 core/                  # Core functionality
│   │   │   ├── 📄 config.py          # Settings
│   │   │   ├── 📄 security.py        # Auth & JWT
│   │   │   ├── 📄 translation.py     # i18n service
│   │   │   ├── 📄 rate_limiter.py    # Rate limiting
│   │   │   └── 📄 encryption.py      # Data encryption
│   │   │
│   │   ├── 📁 models/                # Database models
│   │   │   ├── 📄 user.py            # User model
│   │   │   ├── 📄 news.py            # News model
│   │   │   ├── 📄 merch.py           # Merch model
│   │   │   ├── 📄 favorite.py        # Favorite model
│   │   │   ├── 📄 cart.py            # Cart model
│   │   │   ├── 📄 ai_chat.py         # AI chat history
│   │   │   ├── 📄 job_vacancy.py     # Job listings
│   │   │   ├── 📄 education.py       # Academies
│   │   │   ├── 📄 transaction.py     # Payments
│   │   │   └── 📄 comment.py         # Comments
│   │   │
│   │   ├── 📁 schemas/               # Pydantic schemas
│   │   │   └── (validation models)
│   │   │
│   │   ├── 📁 services/              # Business logic
│   │   │   └── (service classes)
│   │   │
│   │   ├── 📁 db/                    # Database config
│   │   │   ├── 📄 base.py            # Base model
│   │   │   └── 📄 session.py         # DB session
│   │   │
│   │   └── 📁 workers/               # Background tasks
│   │       ├── 📄 celery_app.py      # Celery config
│   │       └── 📄 tasks.py           # Async tasks
│   │
│   ├── 📁 alembic/                   # DB migrations
│   │   ├── 📄 env.py                 # Migration env
│   │   └── 📁 versions/              # Migration files
│   │
│   └── 📁 tests/                     # Backend tests
│       └── (test files)
│
├── 📁 frontend/                      # Next.js Frontend
│   ├── 📄 Dockerfile                 # Frontend container
│   ├── 📄 package.json               # Dependencies
│   ├── 📄 tsconfig.json              # TypeScript config
│   ├── 📄 tailwind.config.js         # Tailwind CSS
│   ├── 📄 next.config.js             # Next.js config
│   ├── 📄 .env.example               # Environment template
│   │
│   ├── 📁 src/                       # Source code
│   │   ├── 📁 app/                   # Next.js app dir
│   │   │   ├── 📄 layout.tsx         # Root layout
│   │   │   ├── 📄 page.tsx           # Home page
│   │   │   └── 📄 globals.css        # Global styles
│   │   │
│   │   ├── 📁 components/            # React components
│   │   │   ├── 📁 common/            # Reusable
│   │   │   ├── 📁 layout/            # Layout
│   │   │   └── 📁 features/          # Features
│   │   │
│   │   └── 📁 lib/                   # Libraries
│   │       ├── 📁 api/               # API client
│   │       ├── 📁 hooks/             # Custom hooks
│   │       ├── 📁 store/             # State management
│   │       └── 📁 utils/             # Utilities
│   │
│   └── 📁 public/                    # Static files
│
├── 📁 docker/                        # Docker configs
│   └── 📁 nginx/
│       └── 📄 nginx.conf             # Nginx config
│
├── 📁 k8s/                           # Kubernetes
│   ├── 📄 deployment.yaml            # Deployments
│   ├── 📄 service.yaml               # Services
│   └── 📄 ingress.yaml               # Ingress
│
├── 📁 docs/                          # Documentation
│   ├── 📄 API.md                     # API docs
│   ├── 📄 SECURITY.md                # Security audit
│   └── 📄 DEPLOYMENT.md              # Deploy guide
│
└── 📁 .github/                       # GitHub config
    └── 📁 workflows/
        └── 📄 ci-cd.yaml             # CI/CD pipeline
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109+
- **Database**: PostgreSQL 15 + SQLAlchemy
- **Cache**: Redis 7
- **Queue**: Celery + RabbitMQ
- **Auth**: JWT + OAuth2 + Argon2
- **Migrations**: Alembic
- **Testing**: Pytest

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Redux Toolkit / Zustand
- **i18n**: react-i18next
- **Animations**: Framer Motion

### DevOps
- **Containers**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus (ready)

## 🚀 Quick Start

1. **Clone and setup:**
```bash
git clone <repository>
cd sport-milliy-portali
./setup.sh
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📊 Database Schema

### Core Tables
- **users** - Athletes, trainers, observers, admins
- **news** - Sports news and articles
- **merches** - Personal merchandise
- **favorites** - User favorite items
- **cart** - Shopping cart items
- **ai_chats** - AI conversation history
- **job_vacancies** - Sports job listings
- **education** - Academies and federations
- **transactions** - Payment records
- **comments** - News comments

## 🔐 Security Features

- JWT authentication with refresh tokens
- Argon2 password hashing
- AES-256 data encryption
- Rate limiting (60/min, 1000/hour)
- CORS protection
- SQL injection prevention
- XSS protection
- CSRF tokens
- Document verification for athletes/trainers

## 🌐 Multilingual Support

- **Uzbek** (default/primary)
- **English**
- **Russian**

Automatic translation with Redis caching.

## 💳 Payment Integration

- **Click**: Uzbekistan payment gateway
- **Payme**: Uzbekistan payment gateway

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register

### Users
- `GET /api/v1/users/me` - Current user
- `PUT /api/v1/users/me` - Update profile

### News
- `GET /api/v1/news` - List news
- `POST /api/v1/news` - Create news (auth)

### Merchandise
- `GET /api/v1/merches` - List merch
- `POST /api/v1/merches` - Create merch (auth)

### AI Buddy
- `POST /api/v1/ai-buddy/chat` - Chat with AI

## 📈 Monitoring & Health

- Health check: `GET /health`
- Prometheus metrics: `GET /metrics`
- Logs: `docker-compose logs -f`

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v --cov

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Docker Compose
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

See docs/DEPLOYMENT.md for details.

---

**Last Updated**: January 2026
**Version**: 1.0.0
