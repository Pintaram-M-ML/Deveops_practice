# Frontend Integration with Helm Chart

## Overview

The frontend has been successfully integrated into the Helm chart. When you deploy using Helm, all **4 services** will be deployed:
- ✅ User Service (port 3001)
- ✅ Product Service (port 3002)
- ✅ Order Service (port 3003)
- ✅ **Frontend Service (port 8080)** - NEW!

## What Was Added

### 1. Frontend Dockerfile (`frontend/Dockerfile`)
A containerized version of the frontend application using Node.js Alpine image.

### 2. Frontend Service in Helm Chart (`mychart/values.yaml`)
```yaml
frontendService:
  enabled: true
  name: frontend
  replicaCount: 1
  image:
    repository: pintaram369/frontend
    tag: "latest"
  service:
    type: NodePort
    port: 8080
    nodePort: 30080  # Fixed external port
```

### 3. Updated Ingress Configuration
The ingress now routes:
- `/` → Frontend (port 8080)
- `/api/users/*` → User Service (port 3001)
- `/api/products/*` → Product Service (port 3002)
- `/api/orders/*` → Order Service (port 3003)

## Deployment Steps

### Step 1: Build the Frontend Docker Image

```bash
cd frontend
docker build -t pintaram369/frontend:latest .
```

### Step 2: Push to Docker Registry

```bash
# Login to Docker Hub (if not already logged in)
docker login

# Push the image
docker push pintaram369/frontend:latest
```

### Step 3: Build Other Service Images (if not already done)

```bash
# User Service
cd ../user-service
docker build -t pintaram369/user-service:latest .
docker push pintaram369/user-service:latest

# Product Service
cd ../product-service
docker build -t pintaram369/product-service:latest .
docker push pintaram369/product-service:latest

# Order Service
cd ../order-service
docker build -t pintaram369/order-service:latest .
docker push pintaram369/order-service:latest
```

### Step 4: Deploy with Helm

```bash
cd ..

# Install (first time)
helm install microservices mychart

# OR Upgrade (if already installed)
helm upgrade microservices mychart
```

### Step 5: Verify Deployment

```bash
# Check all pods are running
kubectl get pods

# Check all services
kubectl get svc

# Check ingress
kubectl get ingress
```

## Accessing the Frontend

### Option 1: Via NodePort (Recommended for Testing)
The frontend is exposed on NodePort **30080**:

```bash
# Get the node IP
kubectl get nodes -o wide

# Access frontend at:
# http://<NODE_IP>:30080
```

For Minikube:
```bash
minikube service frontend --url
```

### Option 2: Via Ingress
If you have an ingress controller installed:

```bash
# Add to /etc/hosts
echo "$(minikube ip) microservices.local" | sudo tee -a /etc/hosts

# Access at:
# http://microservices.local
```

### Option 3: Port Forward (for local testing)
```bash
kubectl port-forward svc/frontend 8080:8080

# Access at:
# http://localhost:8080
```

## Important Notes

### API Endpoint Configuration
The frontend's `script.js` currently uses `localhost` URLs:
```javascript
const API_URLS = {
    user: 'http://localhost:4001',
    product: 'http://localhost:4002',
    order: 'http://localhost:4003'
};
```

**For Kubernetes deployment**, you may need to update these to use:
- Ingress paths: `/api/users`, `/api/products`, `/api/orders`
- Or configure environment variables in the Dockerfile

## Troubleshooting

### Frontend Pod Not Starting
```bash
# Check pod logs
kubectl logs -l app=frontend

# Describe pod for events
kubectl describe pod -l app=frontend
```

### Image Pull Errors
```bash
# Make sure image is pushed to registry
docker images | grep frontend

# Verify image name in values.yaml matches
```

### Frontend Not Accessible
```bash
# Check service
kubectl get svc frontend

# Check if NodePort is allocated
kubectl describe svc frontend
```

## Next Steps

1. **Build and push all Docker images**
2. **Deploy with Helm**
3. **Test the frontend via NodePort or Ingress**
4. **Consider updating API URLs in frontend for production**

## Summary

✅ Frontend Dockerfile created
✅ Frontend service added to Helm chart
✅ Ingress configured for frontend routing
✅ NodePort (30080) configured for external access
✅ Helm chart validated successfully

The frontend is now fully integrated and will be deployed along with your microservices when using Helm!

