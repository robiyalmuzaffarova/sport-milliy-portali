# Production Deployment Guide

## Overview
This guide will help you deploy Sport Milliy Portali to a production environment safely and securely.

## Prerequisites
- Server with Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- SSH access to your server
- Basic knowledge of Linux, Docker, and networking

## Step 1: Environment Setup

### 1.1 Generate Production Secrets
```bash
# Generate SECRET_KEY
openssl rand -hex 32

# Generate strong passwords for database and Redis
openssl rand -base64 32
```

### 1.2 Configure .env.production
Edit `.env.production` and set ALL values:
```bash
# Critical values to change:
SECRET_KEY=<generated-secret-key>
DB_USER=<strong-username>
DB_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
RABBITMQ_USER=<username>
RABBITMQ_PASSWORD=<password>
ADMIN_PASSWORD=<strong-password>
DOCS_PASSWORD=<strong-password>
SMTP_USER=<your-email>
SMTP_PASSWORD=<app-password>
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 1.3 Generate SSL Certificate
Using Let's Encrypt with Certbot:
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com

# Copy certificates to nginx ssl directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/nginx/ssl/key.pem
sudo chown -R $(whoami) docker/nginx/ssl/
```

## Step 2: Server Setup

### 2.1 Clone Repository
```bash
cd /opt
git clone https://github.com/yourusername/sport-milliy-portali.git
cd sport-milliy-portali
```

### 2.2 Create Required Directories
```bash
mkdir -p docker/nginx/ssl
mkdir -p backend/uploads
chmod 755 backend/uploads
```

### 2.3 Copy Configuration
```bash
cp .env.production .env
```

## Step 3: Database Setup

### 3.1 Start Services
```bash
docker-compose -f docker-compose.production.yml up -d

# Wait for postgres to be healthy
docker-compose -f docker-compose.production.yml ps
```

### 3.2 Run Migrations
```bash
docker-compose -f docker-compose.production.yml exec backend \
  alembic upgrade head
```

### 3.3 Create Superuser
```bash
docker-compose -f docker-compose.production.yml exec backend \
  python create_superuser.py
```

## Step 4: Verify Deployment

### 4.1 Check Service Health
```bash
# Check all services are running
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend
```

### 4.2 Test API
```bash
curl -X GET https://yourdomain.com/api/v1/health
```

### 4.3 Test Frontend
```bash
# Visit your domain in browser
https://yourdomain.com
```

## Step 5: Post-Deployment

### 5.1 Setup SSL Auto-Renewal
```bash
# Create renewal cron job
sudo crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * certbot renew --quiet && \
  cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/sport-milliy-portali/docker/nginx/ssl/cert.pem && \
  cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/sport-milliy-portali/docker/nginx/ssl/key.pem && \
  docker-compose -f /opt/sport-milliy-portali/docker-compose.production.yml exec -T nginx nginx -s reload
```

### 5.2 Setup Database Backups
```bash
# Create backup script: backup-db.sh
#!/bin/bash
BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.production.yml exec -T postgres \
  pg_dump -U sportuser sportdb_prod | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Add to crontab to run daily at 3 AM
0 3 * * * /opt/sport-milliy-portali/backup-db.sh
```

### 5.3 Setup Monitoring
Consider setting up:
- Docker monitoring (Portainer)
- Log aggregation (ELK Stack, Loki)
- Performance monitoring (Prometheus, Grafana)
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)

### 5.4 Configure Email Service
Verify SMTP settings are working:
```bash
# Test email sending via backend
docker-compose -f docker-compose.production.yml exec backend \
  python -c "from app.services.email_service import send_email; send_email(['test@example.com'], 'Test', 'Hello')"
```

## Step 6: Security Hardening

### 6.1 Firewall Configuration
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block all other ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 6.2 SSH Hardening
Edit `/etc/ssh/sshd_config`:
```bash
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
Protocol 2
```

### 6.3 File Permissions
```bash
# Secure environment file
chmod 600 .env
chmod 600 .env.production

# Secure uploads directory
chmod 750 backend/uploads

# Secure SSL directory
chmod 700 docker/nginx/ssl
chmod 600 docker/nginx/ssl/*
```

### 6.4 Docker Security
```bash
# Limit container resources
# Update docker-compose.production.yml to add:
# deploy:
#   resources:
#     limits:
#       cpus: '1'
#       memory: 512M
```

## Step 7: Maintenance

### 7.1 Regular Updates
```bash
# Update Docker images regularly
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d

# Update Python packages
docker-compose -f docker-compose.production.yml exec backend pip install --upgrade -r requirements.txt
```

### 7.2 Monitor Disk Space
```bash
# Check disk usage
df -h

# Cleanup Docker
docker system prune -a --volumes
```

### 7.3 Database Maintenance
```bash
# Vacuum PostgreSQL
docker-compose -f docker-compose.production.yml exec postgres \
  vacuumdb -U sportuser sportdb_prod

# Analyze tables
docker-compose -f docker-compose.production.yml exec postgres \
  analyzedb -U sportuser sportdb_prod
```

## Troubleshooting

### Backend not starting
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs backend

# Verify database connection
docker-compose -f docker-compose.production.yml exec backend \
  python -c "from app.db.session import engine; print(engine)"
```

### Frontend build failing
```bash
# Clear cache and rebuild
docker-compose -f docker-compose.production.yml build --no-cache frontend
```

### SSL certificate issues
```bash
# Check certificate validity
openssl x509 -in docker/nginx/ssl/cert.pem -text -noout

# Renew manually
sudo certbot renew --force-renewal
```

### High disk usage
```bash
# Find large files
du -sh /opt/sport-milliy-portali/*

# Clean old backups
find /opt/backups -name "*.sql.gz" -mtime +30 -delete

# Clean Docker
docker system prune -a
```

## Monitoring Checklist

- [ ] Set up daily backups
- [ ] Configure SSL certificate auto-renewal
- [ ] Setup uptime monitoring
- [ ] Monitor disk space
- [ ] Monitor CPU/Memory usage
- [ ] Setup error tracking (Sentry)
- [ ] Configure log aggregation
- [ ] Setup alerts for critical errors
- [ ] Monitor API response times
- [ ] Track user activity

## Performance Optimization

### 1. Enable Caching
- Redis for session storage
- Browser cache for static assets
- API response caching

### 2. Database Optimization
- Create indexes on frequently queried columns
- Analyze query performance
- Archive old data

### 3. API Rate Limiting
Already configured in nginx.conf - adjust as needed:
- API: 100 requests/minute
- General: 10 requests/second

## Emergency Procedures

### Restart Services
```bash
# Restart all services gracefully
docker-compose -f docker-compose.production.yml restart

# Full restart (stop and start)
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

### Rollback to Previous Version
```bash
# Stop current version
docker-compose -f docker-compose.production.yml down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose -f docker-compose.production.yml up -d
```

### Database Emergency Procedures
```bash
# Stop application to prevent new writes
docker-compose -f docker-compose.production.yml stop backend celery-worker

# Backup database
docker-compose -f docker-compose.production.yml exec postgres \
  pg_dump -U sportuser sportdb_prod > backup_emergency.sql

# Restore from backup if needed
docker-compose -f docker-compose.production.yml exec -T postgres \
  psql -U sportuser sportdb_prod < backup_emergency.sql

# Restart application
docker-compose -f docker-compose.production.yml start backend celery-worker
```

## Contact & Support
For issues or questions, refer to your project documentation or contact your DevOps team.

Last Updated: February 23, 2026
