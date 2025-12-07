#!/bin/bash

set -e

PROJECT_ID="iron-zodiac-478222-b5"
REGION="us-central1"
IMAGE_NAME="tfg-backend"
TAG="latest"

echo "Building backend Docker image..."
cd /home/user/TFG-CODE/Backend/tfg-web-app

docker build -t ${IMAGE_NAME}:${TAG} .

docker tag ${IMAGE_NAME}:${TAG} gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

echo "Pushing image to Google Container Registry..."
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

echo "Updating Kubernetes deployment..."
cd /home/user/TFG-CODE

sed -i "s|image: REGISTRY/tfg-backend:latest|image: gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}|g" k8s/backend-deployment.yaml

kubectl apply -f k8s/backend-secret.yaml
kubectl apply -f k8s/backend-configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml

echo "Restarting backend pods..."
kubectl rollout restart deployment/backend -n tfg-app

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/backend -n tfg-app

echo "Backend deployment complete!"
echo ""
echo "Current pods status:"
kubectl get pods -n tfg-app -l app=backend

echo ""
echo "Backend logs (checking for migration success):"
kubectl logs -l app=backend -n tfg-app --tail=50
