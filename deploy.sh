#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Deploying to GKE..."

kubectl apply -f "${SCRIPT_DIR}/k8s/namespace.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/postgres-secret.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/postgres-pvc.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/postgres-deployment.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/postgres-service.yaml"

kubectl apply -f "${SCRIPT_DIR}/k8s/backend-secret.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/backend-configmap.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/backend-deployment.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/backend-service.yaml"

kubectl apply -f "${SCRIPT_DIR}/k8s/frontend-configmap.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/frontend-deployment.yaml"
kubectl apply -f "${SCRIPT_DIR}/k8s/frontend-service.yaml"

echo ""
echo "Deployment complete!"
echo ""

kubectl get pods -n tfg-app

echo ""
FRONTEND_IP=$(kubectl get service frontend -n tfg-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "URL: http://${FRONTEND_IP}"
echo "Login: dev2@example.com / password123"
