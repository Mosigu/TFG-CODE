#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Auto-detect GCP project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "ERROR: Cannot detect GCP project. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

GCR_REGISTRY="gcr.io/${PROJECT_ID}"
echo "Using registry: ${GCR_REGISTRY}"
echo ""

# Create temporary deployment files with registry substitution
TMP_DIR=$(mktemp -d)
trap "rm -rf ${TMP_DIR}" EXIT

for file in "${SCRIPT_DIR}/k8s"/*.yaml; do
  sed "s|GCR_REGISTRY|${GCR_REGISTRY}|g" "$file" > "${TMP_DIR}/$(basename $file)"
done

echo "Deploying to GKE..."

kubectl apply -f "${TMP_DIR}/namespace.yaml"
kubectl apply -f "${TMP_DIR}/postgres-secret.yaml"
kubectl apply -f "${TMP_DIR}/postgres-pvc.yaml"
kubectl apply -f "${TMP_DIR}/postgres-deployment.yaml"
kubectl apply -f "${TMP_DIR}/postgres-service.yaml"

kubectl apply -f "${TMP_DIR}/backend-secret.yaml"
kubectl apply -f "${TMP_DIR}/backend-configmap.yaml"
kubectl apply -f "${TMP_DIR}/backend-deployment.yaml"
kubectl apply -f "${TMP_DIR}/backend-service.yaml"

kubectl apply -f "${TMP_DIR}/frontend-configmap.yaml"
kubectl apply -f "${TMP_DIR}/frontend-deployment.yaml"
kubectl apply -f "${TMP_DIR}/frontend-service.yaml"

echo ""
echo "Deployment complete!"
echo ""

kubectl get pods -n tfg-app

echo ""
echo "To enable HTTPS:"
echo "1. Reserve a static IP: gcloud compute addresses create tfg-app-ip --global"
echo "2. Point your domain to the IP"
echo "3. Update k8s/ingress.yaml with your domain"
echo "4. Apply: kubectl apply -f k8s/ingress.yaml"
echo ""
FRONTEND_IP=$(kubectl get service frontend -n tfg-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Current URL: http://${FRONTEND_IP}"
echo "Login: dev2@example.com / password123"
