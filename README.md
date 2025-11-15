# TFG Web Application

A full-stack project management application built with NestJS (backend) and Next.js (frontend).

## Architecture

- **Backend**: NestJS API with Prisma ORM
- **Frontend**: Next.js with Radix UI
- **Database**: PostgreSQL
- **Deployment**: Docker & Kubernetes

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- kubectl (for Kubernetes deployment)
- Access to a Kubernetes cluster (GKE, AKS, or OpenShift)

## Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TFG-CODE
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## Local Development

### Backend Setup

```bash
cd Backend/tfg-web-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL with Docker
docker run -d \
  --name tfg-postgres \
  -e POSTGRES_USER=tfguser \
  -e POSTGRES_PASSWORD=tfgpassword \
  -e POSTGRES_DB=tfgdb \
  -p 5432:5432 \
  postgres:16-alpine

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
cd Frontend/tfg-web-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Kubernetes Deployment (GKE)

```bash
git clone https://github.com/Mosigu/TFG-CODE.git
cd TFG-CODE
./deploy.sh
```

### Default Login
- **Email**: `dev2@example.com`
- **Password**: `password123`

### Useful Commands

```bash
# Check pods
kubectl get pods -n tfg-app

# View logs
kubectl logs -l app=backend -n tfg-app --tail=50
kubectl logs -l app=frontend -n tfg-app --tail=50

# Get application URL
kubectl get svc frontend -n tfg-app

# Delete deployment
kubectl delete namespace tfg-app
```

## Project Structure

```
TFG-CODE/
├── Backend/
│   └── tfg-web-app/          # NestJS backend application
│       ├── src/              # Source code
│       ├── prisma/           # Prisma schema and migrations
│       ├── Dockerfile        # Backend Docker image
│       └── package.json
├── Frontend/
│   └── tfg-web-app/          # Next.js frontend application
│       ├── app/              # Next.js app directory
│       ├── Dockerfile        # Frontend Docker image
│       └── package.json
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── postgres-*.yaml
│   ├── backend-*.yaml
│   ├── frontend-*.yaml
│   └── README.md
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # This file
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: API server port (default: 4000)
- `NODE_ENV`: Environment (development/production)

### Frontend (.env)
- `NEXT_PUBLIC_BASE_URL`: Backend API URL
- `NODE_ENV`: Environment (development/production)

## Database Migrations

```bash
cd Backend/tfg-web-app

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Testing

### Backend
```bash
cd Backend/tfg-web-app
npm run test
npm run test:e2e
npm run test:cov
```

## Production Deployment

1. **Build Docker images** with proper tags
2. **Push to container registry** (Docker Hub, GCR, ACR, etc.)
3. **Update Kubernetes secrets** with production credentials
4. **Update image references** in Kubernetes manifests
5. **Deploy to Kubernetes cluster**
6. **Configure Ingress** for external access with TLS
7. **Set up monitoring** (Prometheus, Grafana)
8. **Configure logging** (ELK stack or cloud-native solutions)

## Security Considerations

- Change default passwords in production
- Use strong JWT secrets
- Enable HTTPS/TLS
- Implement network policies in Kubernetes
- Use managed database services for production
- Enable Pod Security Standards
- Implement RBAC for Kubernetes access

## Monitoring & Logging

- Application logs are available via `kubectl logs`
- Set up Prometheus for metrics collection
- Use Grafana for visualization
- Implement distributed tracing with Jaeger or similar

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]
