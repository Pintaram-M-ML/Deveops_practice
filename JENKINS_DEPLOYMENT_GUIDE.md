# Jenkins Deployment Guide

## Overview

The Jenkins pipeline now uses **kubectl apply** to deploy services directly using Kubernetes manifests instead of Helm.

## Pipeline Stages

### 1. **Checkout Code**
- Clones the repository from GitHub
- Branch: `main`

### 2. **Build Docker Images**
- Builds Docker images for all 4 services
- Tags: `latest`
- Services:
  - `pintaram369/user-service:latest`
  - `pintaram369/product-service:latest`
  - `pintaram369/order-service:latest`
  - `pintaram369/frontend:latest`

### 3. **Login to Docker Registry**
- Authenticates with Docker Hub
- Uses Jenkins credentials: `dockerhub-credentials-id`

### 4. **Push Docker Images**
- Pushes all images to Docker Hub registry
- Makes images available for Kubernetes deployment

### 5. **Load Images to kind**
- Loads Docker images into kind cluster
- Required for kind to access locally built images
- Skips Docker Hub pull (faster for local development)

### 6. **Deploy to Kubernetes**
- Uses `kubectl apply` to deploy services
- Deployment order:
  1. Namespace (`micro`)
  2. User Service
  3. Product Service
  4. Order Service
  5. Frontend
  6. Ingress

### 7. **Verify Deployment**
- Waits for all deployments to be ready (5 min timeout)
- Shows pods status
- Shows services status
- Shows ingress status

## Prerequisites

### Jenkins Setup

1. **Install Required Plugins:**
   - Docker Pipeline
   - Kubernetes CLI
   - Git Plugin
   - Credentials Plugin

2. **Configure Credentials:**
   ```
   Jenkins → Manage Jenkins → Credentials → Add Credentials
   
   Credential ID: dockerhub-credentials-id
   Type: Username with password
   Username: pintaram369
   Password: <your-docker-hub-token>
   ```

3. **Configure kubectl:**
   - Ensure Jenkins has access to kubeconfig
   - Test: `kubectl get nodes`

4. **Configure kind:**
   - Ensure kind cluster is running
   - Test: `kind get clusters`

### Local Setup

```bash
# Create kind cluster
kind create cluster

# Verify cluster
kubectl cluster-info
kubectl get nodes

# Verify Jenkins can access cluster
kubectl config current-context
```

## Running the Pipeline

### Via Jenkins UI

1. Go to Jenkins dashboard
2. Click on your pipeline job
3. Click "Build Now"
4. Monitor the build progress

### Via Jenkinsfile

The pipeline runs automatically when:
- Code is pushed to the repository
- Webhook is triggered
- Manual build is started

## Accessing Deployed Services

### Frontend (NodePort)
```bash
# Access at:
http://localhost:30080
```

### Via Port Forward
```bash
# User Service
kubectl port-forward -n micro svc/user-service 4001:3001

# Product Service
kubectl port-forward -n micro svc/product-service 4002:3002

# Order Service
kubectl port-forward -n micro svc/order-service 4003:3003

# Frontend
kubectl port-forward -n micro svc/frontend 8080:8080
```

### Via Ingress
```bash
# Add to /etc/hosts
echo "127.0.0.1 microservices.local" | sudo tee -a /etc/hosts

# Access at:
http://microservices.local
```

## Monitoring Deployment

### Check Pipeline Status
```bash
# View pods
kubectl get pods -n micro

# View services
kubectl get svc -n micro

# View deployments
kubectl get deployments -n micro

# View logs
kubectl logs -n micro -l app=user-service
kubectl logs -n micro -l app=product-service
kubectl logs -n micro -l app=order-service
kubectl logs -n micro -l app=frontend
```

### Check Events
```bash
# Recent events
kubectl get events -n micro --sort-by='.lastTimestamp'

# Describe pod
kubectl describe pod -n micro <pod-name>
```

## Troubleshooting

### Pipeline Fails at Build Stage
```bash
# Check Docker is running
docker ps

# Check disk space
df -h
```

### Pipeline Fails at Push Stage
```bash
# Verify Docker Hub credentials
docker login

# Check network connectivity
ping hub.docker.com
```

### Pipeline Fails at Load to kind
```bash
# Check kind cluster is running
kind get clusters

# Verify cluster nodes
kubectl get nodes
```

### Pipeline Fails at Deploy Stage
```bash
# Check namespace exists
kubectl get namespace micro

# Check manifests are valid
kubectl apply -f k8s-manifests/ --dry-run=client

# Check RBAC permissions
kubectl auth can-i create deployments -n micro
```

### Pods Not Starting
```bash
# Check pod status
kubectl get pods -n micro

# Check pod logs
kubectl logs -n micro <pod-name>

# Describe pod for events
kubectl describe pod -n micro <pod-name>

# Check if images are loaded
docker images | grep pintaram369
```

## Rollback

### Manual Rollback
```bash
# Delete current deployment
kubectl delete -f k8s-manifests/

# Redeploy previous version
kubectl apply -f k8s-manifests/
```

### Using kubectl rollout
```bash
# Rollback specific deployment
kubectl rollout undo deployment/user-service -n micro

# Check rollout history
kubectl rollout history deployment/user-service -n micro
```

## Helm Deployment (Commented Out)

The Helm deployment stage is commented out but kept for reference. To use Helm instead:

1. Uncomment the Helm stage in Jenkinsfile
2. Comment out the kubectl apply stage
3. Update the pipeline

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| DOCKER_IMAGE_USER_SERVICE | pintaram369/user-service | User service image |
| DOCKER_IMAGE_PRODUCT_SERVICE | pintaram369/product-service | Product service image |
| DOCKER_IMAGE_ORDER_SERVICE | pintaram369/order-service | Order service image |
| DOCKER_IMAGE_FRONTEND | pintaram369/frontend | Frontend image |
| DOCKER_TAG | latest | Docker image tag |
| REGISTRY_CREDENTIALS | dockerhub-credentials-id | Jenkins credential ID |
| K8S_NAMESPACE | micro | Kubernetes namespace |
| K8S_MANIFESTS_PATH | k8s-manifests | Path to manifests |

## Next Steps

1. ✅ Pipeline uses kubectl apply
2. ✅ Helm deployment commented out
3. ✅ Images loaded to kind cluster
4. ✅ Verification steps added
5. ⏭️ Add unit tests (optional)
6. ⏭️ Add integration tests (optional)
7. ⏭️ Add security scanning (optional)
8. ⏭️ Add notifications (Slack/Email)

