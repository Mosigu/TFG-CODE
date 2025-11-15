#!/bin/bash

set -e

PROJECT_ID="iron-zodiac-478222-b5"
REGION="us-central1"
IMAGE_NAME="tfg-frontend"
TAG="latest"

echo "🔨 Building frontend Docker image..."
cd /home/user/TFG-CODE/Frontend/tfg-web-app

# Build the image
docker build -t ${IMAGE_NAME}:${TAG} .

# Tag for GCR
docker tag ${IMAGE_NAME}:${TAG} gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

echo "📤 Pushing image to Google Container Registry..."
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

echo "🔄 Updating Kubernetes deployment..."
cd /home/user/TFG-CODE

# Update the deployment YAML to use the correct image
sed -i "s|image: your-registry/tfg-frontend:latest|image: gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}|g" k8s/frontend-deployment.yaml

# Apply the updated ConfigMap
kubectl apply -f k8s/frontend-configmap.yaml

# Apply the updated deployment
kubectl apply -f k8s/frontend-deployment.yaml

echo "♻️  Restarting frontend pods..."
kubectl rollout restart deployment/frontend -n tfg-app

echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/frontend -n tfg-app

echo "✅ Frontend deployment complete!"
echo ""
echo "🔍 Current pods status:"
kubectl get pods -n tfg-app -l app=frontend

echo ""
echo "🌐 Access your application at: http://34.175.220.7"
