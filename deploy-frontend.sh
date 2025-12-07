#!/bin/bash

set -e

PROJECT_ID="iron-zodiac-478222-b5"
REGION="us-central1"
IMAGE_NAME="tfg-frontend"
TAG="latest"

echo "Building frontend Docker image..."
cd /home/user/TFG-CODE/Frontend/tfg-web-app

docker build -t ${IMAGE_NAME}:${TAG} .

docker tag ${IMAGE_NAME}:${TAG} gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

echo "Pushing image to Google Container Registry..."
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

echo "Updating Kubernetes deployment..."
cd /home/user/TFG-CODE

sed -i "s|image: REGISTRY/tfg-frontend:latest|image: gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}|g" k8s/frontend-deployment.yaml

kubectl apply -f k8s/frontend-configmap.yaml

kubectl apply -f k8s/frontend-deployment.yaml

echo "Restarting frontend pods..."
kubectl rollout restart deployment/frontend -n tfg-app

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/frontend -n tfg-app

echo "Frontend deployment complete!"
echo ""
echo "Current pods status:"
kubectl get pods -n tfg-app -l app=frontend

echo ""
echo "Access your application at: http://34.175.220.7"
