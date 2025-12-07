#!/bin/bash

ENV_TYPE="${1:-local}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

BACKEND_DIR="$ROOT_DIR/Backend/tfg-web-app"
FRONTEND_DIR="$ROOT_DIR/Frontend/tfg-web-app"

show_usage() {
    echo "Usage: $0 [local|docker|gke]"
    echo ""
    echo "Environments:"
    echo "  local   - Native local development (backend + frontend on host)"
    echo "  docker  - Docker Compose (all services in containers)"
    echo "  gke     - Google Kubernetes Engine deployment"
    echo ""
    echo "Examples:"
    echo "  $0 local   # Set up for local development"
    echo "  $0 docker  # Set up for Docker Compose"
    echo "  $0 gke     # Deploy to GKE"
}

setup_local() {
    echo "Setting up LOCAL environment..."

    cat > "$BACKEND_DIR/.env" << 'EOF'
DATABASE_URL="postgresql://tfguser:tfgpassword@localhost:5432/tfgdb"
JWT_SECRET="dev-secret-key-local"
PORT=4000
NODE_ENV="development"
EOF

    cat > "$FRONTEND_DIR/.env" << 'EOF'
NEXT_PUBLIC_BASE_URL=http://localhost:4000
NODE_ENV=development
EOF

    echo "Environment files created."
    echo ""
    echo "To start local development:"
    echo "  1. Start PostgreSQL:"
    echo "     docker run -d --name tfg-postgres -e POSTGRES_USER=tfguser -e POSTGRES_PASSWORD=tfgpassword -e POSTGRES_DB=tfgdb -p 5432:5432 postgres:16-alpine"
    echo ""
    echo "  2. Start Backend (from Backend/tfg-web-app):"
    echo "     pnpm install && npx prisma migrate dev && pnpm run start:dev"
    echo ""
    echo "  3. Start Frontend (from Frontend/tfg-web-app):"
    echo "     npm install && npm run dev"
    echo ""
    echo "Access: http://localhost:3000"
}

setup_docker() {
    echo "Setting up DOCKER environment..."

    cat > "$BACKEND_DIR/.env" << 'EOF'
DATABASE_URL="postgresql://tfguser:tfgpassword@postgres:5432/tfgdb"
JWT_SECRET="dev-secret-key-docker"
PORT=4000
NODE_ENV="production"
EOF

    cat > "$FRONTEND_DIR/.env" << 'EOF'
NEXT_PUBLIC_BASE_URL=http://localhost:4000
NODE_ENV=production
EOF

    echo "Environment files created."
    echo ""
    echo "To start with Docker Compose:"
    echo "  cd $ROOT_DIR"
    echo "  docker-compose up --build"
    echo ""
    echo "Access: http://localhost:3000"
}

deploy_gke() {
    echo "Deploying to GKE..."

    if ! command -v gcloud &> /dev/null; then
        echo "Error: gcloud CLI not installed"
        exit 1
    fi

    if ! command -v kubectl &> /dev/null; then
        echo "Error: kubectl not installed"
        exit 1
    fi

    cd "$ROOT_DIR"

    if [ -f "deploy-all.sh" ]; then
        chmod +x deploy-all.sh
        ./deploy-all.sh
    else
        echo "Error: deploy-all.sh not found"
        exit 1
    fi
}

start_local() {
    echo "Starting LOCAL services..."

    if ! docker ps | grep -q tfg-postgres; then
        echo "Starting PostgreSQL container..."
        docker run -d --name tfg-postgres \
            -e POSTGRES_USER=tfguser \
            -e POSTGRES_PASSWORD=tfgpassword \
            -e POSTGRES_DB=tfgdb \
            -p 5432:5432 \
            postgres:16-alpine

        echo "Waiting for PostgreSQL..."
        sleep 5
    else
        echo "PostgreSQL already running"
    fi

    echo ""
    echo "PostgreSQL is ready."
    echo ""
    echo "Open two terminals and run:"
    echo "  Terminal 1 (Backend):  cd $BACKEND_DIR && pnpm run start:dev"
    echo "  Terminal 2 (Frontend): cd $FRONTEND_DIR && npm run dev"
}

case "$ENV_TYPE" in
    local)
        setup_local
        ;;
    docker)
        setup_docker
        ;;
    gke)
        deploy_gke
        ;;
    start)
        setup_local
        start_local
        ;;
    -h|--help)
        show_usage
        ;;
    *)
        echo "Unknown environment: $ENV_TYPE"
        show_usage
        exit 1
        ;;
esac
