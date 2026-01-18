# 🚀 QUICKSTART GUIDE
## Sport Milliy Portali - Complete Setup Instructions

---

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ **Docker** (20.10+) and **Docker Compose** (2.0+)
- ✅ **Git** for version control
- ✅ For local development (optional):
  - Node.js 20+
  - Python 3.11+
  - PostgreSQL 15+
  - Redis 7+

---

## 🎯 Quick Setup (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd sport-milliy-portali

# 2. Run automated setup
chmod +x setup.sh
./setup.sh

# That's it! 🎉
```

The setup script will:
- ✅ Create environment files
- ✅ Start all Docker services
- ✅ Run database migrations
- ✅ Display service URLs

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd sport-milliy-portali

# 2. Copy environment files
cp backend/.env backend/.env
cp frontend/.env frontend/.env.local

# 3. Edit environment files (optional - defaults work for dev)
nano backend/.env
nano frontend/.env.local

# 4. Start Docker services
docker-compose up -d

# 5. Wait for services (about 10 seconds)
sleep 10

# 6. Run database migrations
docker-compose exec backend alembic upgrade head

# 7. (Optional) Create admin user
docker-compose exec backend python -c "
from app.models.user import User, UserRole
from app.db.session import AsyncSessionLocal
from app.core.security import get_password_hash
import asyncio

async def create_admin():
    async with AsyncSessionLocal() as db:
        admin = User(
            email='admin@sportmilliyportali.uz',
            hashed_password=get_password_hash('admin123'),
            full_name='Admin User',
            role=UserRole.ADMIN,
            is_superuser=True,
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        await db.commit()
        print('✅ Admin user created')

asyncio.run(create_admin())
"
```

---

## 🌐 Access Your Application

After setup completes, access:

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Frontend** | http://localhost:3000 | Main website |
| 🔧 **Backend API** | http://localhost:8000 | REST API |
| 📖 **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| 📚 **ReDoc** | http://localhost:8000/redoc | Alternative API docs |
| 🐰 **RabbitMQ** | http://localhost:15672 | Message queue (user: sportuser, pass: sportpass) |
| 🗄️ **PostgreSQL** | localhost:5432 | Database (user: sportuser, pass: sportpass) |
| 💾 **Redis** | localhost:6379 | Cache server |

---

## 🎨 View the Design Preview

Open the included HTML preview:
```bash
# Open in browser
open PREVIEW.html  # macOS
xdg-open PREVIEW.html  # Linux
start PREVIEW.html  # Windows

# Or just double-click PREVIEW.html
```

This shows the complete design with:
- ✅ Dark glass morphism theme
- ✅ All pages (Home, News, Athletes, Trainers, Merch, etc.)
- ✅ Multilingual support (UZ/EN/RU)
- ✅ Login & Signup pages
- ✅ Interactive features

---

## 🛠️ Common Commands

### Docker Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Rebuild containers (after code changes)
docker-compose up -d --build

# Stop and remove everything (including volumes)
docker-compose down -v
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Access PostgreSQL directly
docker-compose exec postgres psql -U sportuser -d sportdb
```

### Backend Operations
```bash
# Access backend shell
docker-compose exec backend bash

# Run Python shell
docker-compose exec backend python

# Run tests
docker-compose exec backend pytest tests/ -v

# Check code quality
docker-compose exec backend flake8 app
docker-compose exec backend black app --check
```

### Frontend Operations
```bash
# Access frontend shell
docker-compose exec frontend sh

# Install new package
docker-compose exec frontend npm install <package-name>

# Run linter
docker-compose exec frontend npm run lint

# Build production bundle
docker-compose exec frontend npm run build
```

---

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://sportuser:sportpass@postgres:5432/sportdb

# Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Translation (optional - for production)
TRANSLATION_SERVICE=google
GOOGLE_TRANSLATE_API_KEY=your-api-key

# Payments (add your keys)
CLICK_MERCHANT_ID=your-merchant-id
CLICK_SECRET_KEY=your-secret-key
PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key

# Email (optional)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Environment Variables

Edit `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

## 📊 Test the API

### Using cURL
```bash
# Health check
curl http://localhost:8000/health

# Get news
curl http://localhost:8000/api/v1/news

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User",
    "role": "athlete"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d "username=test@example.com&password=test123"
```

### Using Swagger UI
1. Open http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

---

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=app --cov-report=html

# Run specific test file
docker-compose exec backend pytest tests/test_auth.py -v
```

### Frontend Tests
```bash
# Run all tests
docker-compose exec frontend npm test

# Run in watch mode
docker-compose exec frontend npm run test:watch
```

---

## 🚀 Deployment

### Deploy to Production Server

1. **Set up production environment:**
```bash
cp backend/.env backend/.env.production
# Edit with production values
```

2. **Build and deploy:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy to Kubernetes

1. **Create namespace:**
```bash
kubectl create namespace sport-portal
```

2. **Create secrets:**
```bash
kubectl create secret generic sport-portal-secrets \
  --from-literal=database-url='postgresql://user:pass@host/db' \
  --namespace=sport-portal
```

3. **Deploy:**
```bash
kubectl apply -f k8s/
```

4. **Check status:**
```bash
kubectl get pods -n sport-portal
kubectl get services -n sport-portal
```

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

---

## 📝 Next Steps

1. **Explore the API:** http://localhost:8000/docs
2. **Read documentation:** `docs/API.md`, `docs/SECURITY.md`
3. **Customize design:** Edit frontend components
4. **Add features:** Follow the project structure in `PROJECT_STRUCTURE.md`
5. **Set up payments:** Add Click/Payme credentials
6. **Configure translation:** Add Google Translate API key

---

## 🆘 Troubleshooting

### Services won't start
```bash
# Check if ports are already in use
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # PostgreSQL

# Check Docker logs
docker-compose logs
```

### Database connection errors
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check if database exists
docker-compose exec postgres psql -U sportuser -l
```

### Frontend build errors
```bash
# Clear Next.js cache
docker-compose exec frontend rm -rf .next

# Rebuild
docker-compose up -d --build frontend
```

### Backend module errors
```bash
# Reinstall dependencies
docker-compose exec backend pip install -r requirements.txt --force-reinstall
```

---

## 📞 Support

- **Issues:** Open an issue on GitHub
- **Email:** info@sportmilliyportali.uz
- **Documentation:** Check `docs/` folder
- **API Docs:** http://localhost:8000/docs

---

## 🎉 Success!

If you see this, your Sport Milliy Portali is running! 

- ✅ Backend API: http://localhost:8000
- ✅ Frontend: http://localhost:3000
- ✅ Database: Connected
- ✅ Cache: Ready
- ✅ Queue: Running

Start building amazing features! 🚀

---

**Last Updated:** January 2026  
**Version:** 1.0.0
