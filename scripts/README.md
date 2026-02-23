# Deployment Scripts

This directory contains scripts to help with deployment and maintenance of Sport Milliy Portali.

## Scripts

### `deploy.sh`
Automated deployment script that handles the complete setup process.

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**What it does:**
1. Checks for Docker and Docker Compose
2. Verifies .env.production exists and has custom values
3. Creates required directories (ssl, uploads)
4. Starts Docker containers
5. Runs database migrations
6. Performs health checks
7. Provides post-deployment instructions

**When to use:** Initial production deployment

---

### `deployment-check.sh`
Pre-deployment verification script that checks if your project is ready for deployment.

**Usage:**
```bash
chmod +x deployment-check.sh
./deployment-check.sh
```

**What it checks:**
1. Required files exist (Douglasfile, compose file, configs)
2. Required tools installed (Docker, Docker Compose, Git)
3. Configuration files have required content
4. Production environment is properly configured
5. Security settings are correct

**When to use:** Before running deploy.sh to identify any issues

---

## Quick Start

```bash
# 1. Make scripts executable
chmod +x *.sh

# 2. Check deployment readiness
./deployment-check.sh

# 3. Fix any issues found
# Edit .env.production and other files as needed

# 4. Run deployment
./deploy.sh

# 5. Monitor
docker-compose -f ../docker-compose.production.yml logs -f backend
```

## Common Issues

### Permission Denied
```bash
chmod +x deploy.sh deployment-check.sh
```

### Docker command not found
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### No such file or directory
Make sure you're running from the correct directory:
```bash
cd /opt/sport-milliy-portali
bash scripts/deploy.sh
```

## Manual Operations

If you prefer to deploy manually instead of using scripts:

```bash
cd /opt/sport-milliy-portali

# Start services
docker-compose -f docker-compose.production.yml up -d

# Wait for database to be healthy
docker-compose -f docker-compose.production.yml ps

# Run migrations
docker-compose -f docker-compose.production.yml exec backend alembic upgrade head

# Create admin user
docker-compose -f docker-compose.production.yml exec backend python create_superuser.py

# Check health
curl http://localhost:8000/health
```

## Monitoring After Deployment

```bash
# View logs in real-time
docker-compose -f docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend
docker-compose -f docker-compose.production.yml logs -f nginx

# Check service status
docker-compose -f docker-compose.production.yml ps

# Check resource usage
docker stats
```

## Backup Before Deployment

**IMPORTANT:** Always backup your database before running deployment scripts!

```bash
# Backup database
docker-compose -f docker-compose.production.yml exec postgres \
  pg_dump -U sportuser sportdb_prod > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Complete deployment guide
- [DEPLOYMENT_READY.md](../DEPLOYMENT_READY.md) - Deployment readiness summary
- [SECURITY_CHECKLIST.md](../SECURITY_CHECKLIST.md) - Security verification checklist
- [README.md](../README.md) - Project overview

## Support

For issues or questions:
1. Check the error messages in the logs
2. Review [DEPLOYMENT.md](../DEPLOYMENT.md#troubleshooting)
3. Check service health: `docker-compose -f docker-compose.production.yml ps`
4. Contact your DevOps team

---

**Last Updated:** February 23, 2026
