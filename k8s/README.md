# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the TFG application.

## Prerequisites

- Kubernetes cluster (GKE, AKS, or OpenShift)
- kubectl configured to access your cluster
- Docker images built and pushed to a container registry

## Building and Pushing Docker Images

### Backend
```bash
cd Backend/tfg-web-app
docker build -t your-registry/tfg-backend:latest .
docker push your-registry/tfg-backend:latest
```

### Frontend
```bash
cd Frontend/tfg-web-app
docker build -t your-registry/tfg-frontend:latest .
docker push your-registry/tfg-frontend:latest
```

## Deployment Steps

1. **Update image references** in deployment files:
   - Edit `backend-deployment.yaml` and update `image` field
   - Edit `frontend-deployment.yaml` and update `image` field

2. **Update secrets** (IMPORTANT for production):
   - Edit `postgres-secret.yaml` with secure database credentials
   - Edit `backend-secret.yaml` with a strong JWT secret

3. **Deploy to Kubernetes**:
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml

   # Deploy PostgreSQL
   kubectl apply -f k8s/postgres-secret.yaml
   kubectl apply -f k8s/postgres-pvc.yaml
   kubectl apply -f k8s/postgres-deployment.yaml
   kubectl apply -f k8s/postgres-service.yaml

   # Wait for PostgreSQL to be ready
   kubectl wait --for=condition=ready pod -l app=postgres -n tfg-app --timeout=120s

   # Deploy Backend
   kubectl apply -f k8s/backend-secret.yaml
   kubectl apply -f k8s/backend-configmap.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/backend-service.yaml

   # Wait for Backend to be ready
   kubectl wait --for=condition=ready pod -l app=backend -n tfg-app --timeout=120s

   # Deploy Frontend
   kubectl apply -f k8s/frontend-configmap.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/frontend-service.yaml
   ```

4. **Get the frontend URL**:
   ```bash
   kubectl get service frontend -n tfg-app
   ```

## Useful Commands

### Check pod status
```bash
kubectl get pods -n tfg-app
```

### Check logs
```bash
kubectl logs -f deployment/backend -n tfg-app
kubectl logs -f deployment/frontend -n tfg-app
kubectl logs -f deployment/postgres -n tfg-app
```

### Scale deployments
```bash
kubectl scale deployment backend --replicas=3 -n tfg-app
kubectl scale deployment frontend --replicas=3 -n tfg-app
```

### Delete all resources
```bash
kubectl delete namespace tfg-app
```

## Local Testing with Docker Compose

For local development and testing:

```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

Stop the containers:
```bash
docker-compose down
```

## Production Considerations

1. **Security**:
   - Use Kubernetes Secrets for sensitive data
   - Enable TLS/SSL with an Ingress controller
   - Use network policies to restrict pod communication
   - Implement RBAC for access control

2. **Persistence**:
   - Use a managed database service (Cloud SQL, Azure Database, etc.) for production
   - Configure proper backup strategies for PostgreSQL

3. **Monitoring**:
   - Set up Prometheus and Grafana for monitoring
   - Configure logging with ELK stack or cloud-native solutions
   - Set up alerts for critical metrics

4. **High Availability**:
   - Run multiple replicas of backend and frontend
   - Use anti-affinity rules to distribute pods across nodes
   - Configure proper resource requests and limits

5. **CI/CD**:
   - Automate builds and deployments with GitHub Actions, GitLab CI, or Jenkins
   - Implement rolling updates for zero-downtime deployments
