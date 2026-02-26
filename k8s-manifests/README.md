# Kubernetes Manifests for Microservices

This directory contains individual Kubernetes deployment manifests for each service. hii

## Files

- `namespace.yaml` - Creates the `micro` namespace
- `user-service-deployment.yaml` - User service deployment and service
- `product-service-deployment.yaml` - Product service deployment and service
- `order-service-deployment.yaml` - Order service deployment and service
- `frontend-deployment.yaml` - Frontend deployment and service
- `ingress.yaml` - Ingress configuration for all services

## Deployment Options

### Option 1: Deploy All Services at Once

```bash
# Create namespace first
kubectl apply -f namespace.yaml

# Deploy all services
kubectl apply -f .

# Or deploy in order
kubectl apply -f namespace.yaml
kubectl apply -f user-service-deployment.yaml
kubectl apply -f product-service-deployment.yaml
kubectl apply -f order-service-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml
```

### Option 2: Deploy Individual Services

```bash
# Deploy only user service
kubectl apply -f namespace.yaml
kubectl apply -f user-service-deployment.yaml

# Deploy only product service
kubectl apply -f product-service-deployment.yaml

# Deploy only order service
kubectl apply -f order-service-deployment.yaml

# Deploy only frontend
kubectl apply -f frontend-deployment.yaml
```

### Option 3: Using Kustomize

```bash
# Deploy all with kustomize
kubectl apply -k .
```

## For kind Cluster

If you're using kind, load the images first:

```bash
# Build images
docker build -t pintaram369/user-service:latest ./user-service
docker build -t pintaram369/product-service:latest ./product-service
docker build -t pintaram369/order-service:latest ./order-service
docker build -t pintaram369/frontend:latest ./frontend

# Load into kind
kind load docker-image pintaram369/user-service:latest
kind load docker-image pintaram369/product-service:latest
kind load docker-image pintaram369/order-service:latest
kind load docker-image pintaram369/frontend:latest

# Deploy
kubectl apply -f k8s-manifests/
```

## Verify Deployment

```bash
# Check namespace
kubectl get ns micro

# Check all resources in micro namespace
kubectl get all -n micro

# Check pods
kubectl get pods -n micro

# Check services
kubectl get svc -n micro

# Check ingress
kubectl get ingress -n micro

# Check logs
kubectl logs -n micro -l app=user-service
kubectl logs -n micro -l app=product-service
kubectl logs -n micro -l app=order-service
kubectl logs -n micro -l app=frontend
```

## Access Services

### Via Port Forward

```bash
# User service
kubectl port-forward -n micro svc/user-service 4001:3001

# Product service
kubectl port-forward -n micro svc/product-service 4002:3002

# Order service
kubectl port-forward -n micro svc/order-service 4003:3003

# Frontend
kubectl port-forward -n micro svc/frontend 8080:8080
```

### Via NodePort (Frontend)

```bash
# Frontend is exposed on NodePort 30080
# Access at: http://localhost:30080 (for kind)
```

### Via Ingress

```bash
# Add to /etc/hosts
echo "127.0.0.1 microservices.local" | sudo tee -a /etc/hosts

# Access at: http://microservices.local
```

## Update Deployment

```bash
# Update specific service
kubectl apply -f user-service-deployment.yaml

# Restart deployment
kubectl rollout restart deployment/user-service -n micro

# Check rollout status
kubectl rollout status deployment/user-service -n micro
```

## Scale Services

```bash
# Scale user service to 3 replicas
kubectl scale deployment/user-service -n micro --replicas=3

# Check scaling
kubectl get pods -n micro -l app=user-service
```

## Delete Resources

```bash
# Delete all resources
kubectl delete -f .

# Delete specific service
kubectl delete -f user-service-deployment.yaml

# Delete namespace (deletes everything in it)
kubectl delete namespace micro
```

## Service Configuration

### User Service
- **Replicas**: 2
- **Port**: 3001
- **Type**: ClusterIP
- **Health Check**: /health

### Product Service
- **Replicas**: 2
- **Port**: 3002
- **Type**: ClusterIP
- **Health Check**: /health

### Order Service
- **Replicas**: 2
- **Port**: 3003
- **Type**: ClusterIP
- **Health Check**: /health
- **Dependencies**: user-service, product-service

### Frontend
- **Replicas**: 2
- **Port**: 8080
- **Type**: NodePort (30080)
- **Health Check**: /

## Resource Limits

All services have:
- **CPU Limit**: 200m
- **Memory Limit**: 256Mi
- **CPU Request**: 100m
- **Memory Request**: 128Mi

