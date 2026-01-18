# Deployment Guide

## Docker Compose Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- Docker images built and pushed to registry

### Steps

1. Create namespace:
```bash
kubectl create namespace sport-portal
```

2. Create secrets:
```bash
kubectl create secret generic sport-portal-secrets \
  --from-literal=database-url='postgresql://...' \
  --namespace=sport-portal
```

3. Apply configurations:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

4. Check status:
```bash
kubectl get pods -n sport-portal
kubectl get services -n sport-portal
```

## Environment Variables

See backend/.env.example and frontend/.env.example for required variables.

## SSL/TLS

Use Let's Encrypt with cert-manager for automatic SSL certificates.

## Monitoring

- Prometheus metrics: /metrics
- Health check: /health
- Logs: `docker-compose logs -f` or `kubectl logs`
