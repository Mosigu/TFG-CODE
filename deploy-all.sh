#!/bin/bash

set -e

PROJECT_ID="iron-zodiac-478222-b5"
REGION="us-central1"

echo "========================================="
echo "Full Stack Deployment to GKE"
echo "========================================="
echo ""

echo "Step 1: Deploying PostgreSQL..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

echo "Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n tfg-app --timeout=120s

echo ""
echo "Step 2: Deploying Backend..."
cd Backend/tfg-web-app
docker build -t gcr.io/${PROJECT_ID}/tfg-backend:latest .
docker push gcr.io/${PROJECT_ID}/tfg-backend:latest

cd ../../k8s
sed -i "s|image: REGISTRY/tfg-backend:latest|image: gcr.io/${PROJECT_ID}/tfg-backend:latest|g" backend-deployment.yaml

kubectl apply -f backend-secret.yaml
kubectl apply -f backend-configmap.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

echo "Waiting for backend to be ready..."
kubectl rollout status deployment/backend -n tfg-app

echo ""
echo "Step 3: Deploying Frontend..."
cd ../Frontend/tfg-web-app
docker build -t gcr.io/${PROJECT_ID}/tfg-frontend:latest .
docker push gcr.io/${PROJECT_ID}/tfg-frontend:latest

cd ../../k8s
sed -i "s|image: REGISTRY/tfg-frontend:latest|image: gcr.io/${PROJECT_ID}/tfg-frontend:latest|g" frontend-deployment.yaml

kubectl apply -f frontend-configmap.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

echo "Waiting for frontend to be ready..."
kubectl rollout status deployment/frontend -n tfg-app

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""

kubectl get all -n tfg-app

echo ""
FRONTEND_IP=$(kubectl get service frontend -n tfg-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Application URL: http://${FRONTEND_IP}"
echo ""
echo "To check backend logs:"
echo "kubectl logs -l app=backend -n tfg-app --tail=50"
echo ""
echo "To check frontend logs:"
echo "kubectl logs -l app=frontend -n tfg-app --tail=50"
