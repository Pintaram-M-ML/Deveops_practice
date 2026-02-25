# Helm Chart Deployment Guide for Microservices

## ✅ What Was Modified

I've successfully updated your Helm chart (`mychart`) to deploy all three microservices:

### Files Modified:

1. **`mychart/values.yaml`** - Configured for 3 services (user-service, product-service, order-service)
2. **`mychart/templates/deployment.yaml`** - Updated to loop through and create deployments for all services
3. **`mychart/templates/service.yaml`** - Updated to create Kubernetes services for all microservices
4. **`mychart/templates/ingress.yaml`** - Configured to route traffic to all three services
5. **`mychart/templates/tests/test-connection.yaml`** - Fixed to work with new structure

## 📋 Services Configuration

### User Service
- **Name**: user-service
- **Port**: 3001
- **Replicas**: 2
- **Image**: user-service:latest
- **Health Check**: /health

### Product Service
- **Name**: product-service
- **Port**: 3002
- **Replicas**: 2
- **Image**: product-service:latest
- **Health Check**: /health

### Order Service
- **Name**: order-service
- **Port**: 3003
- **Replicas**: 2
- **Image**: order-service:latest
- **Health Check**: /health
- **Environment Variables**:
  - USER_SERVICE_URL=http://user-service:3001
  - PRODUCT_SERVICE_URL=http://product-service:3002

## 🚀 Deployment Steps

### Step 1: Build and Tag Docker Images

Before deploying, you need to build your Docker images:

```bash
# Build images
docker build -t user-service:latest ./user-service
docker build -t product-service:latest ./product-service
docker build -t order-service:latest ./order-service

# If using a registry (e.g., Docker Hub, ECR, GCR):
docker tag user-service:latest your-registry/user-service:latest
docker tag product-service:latest your-registry/product-service:latest
docker tag order-service:latest your-registry/order-service:latest

# Push to registry
docker push your-registry/user-service:latest
docker push your-registry/product-service:latest
docker push your-registry/order-service:latest
```

### Step 2: Update values.yaml (if using a registry)

Edit `mychart/values.yaml` and update the image repositories:

```yaml
services:
  userService:
    image:
      repository: your-registry/user-service  # Update this
      
  productService:
    image:
      repository: your-registry/product-service  # Update this
      
  orderService:
    image:
      repository: your-registry/order-service  # Update this
```

### Step 3: Validate the Helm Chart

```bash
# Lint the chart
helm lint mychart

# Dry run to see what will be created
helm template microservices mychart --debug

# Or install with dry-run
helm install microservices mychart --dry-run --debug
```

### Step 4: Install the Helm Chart

```bash
# Install in default namespace
helm install microservices mychart

# Or install in a specific namespace
helm install microservices mychart --namespace microservices --create-namespace

# Install with custom values
helm install microservices mychart -f custom-values.yaml
```

### Step 5: Verify Deployment

```bash
# Check Helm release status
helm status microservices

# List all Helm releases
helm list

# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check ingress
kubectl get ingress

# View logs
kubectl logs -l app=user-service
kubectl logs -l app=product-service
kubectl logs -l app=order-service
```

## 🔄 Updating the Deployment

```bash
# After making changes to values.yaml or templates
helm upgrade microservices mychart

# Upgrade with new values
helm upgrade microservices mychart -f new-values.yaml

# Rollback to previous version
helm rollback microservices

# Rollback to specific revision
helm rollback microservices 1
```

## 🧪 Testing the Services

### Port Forward to Test Locally

```bash
# Forward user-service
kubectl port-forward svc/user-service 4001:3001

# Forward product-service
kubectl port-forward svc/product-service 4002:3002

# Forward order-service
kubectl port-forward svc/order-service 4003:3003
```

Then test with curl:

```bash
# Test user service
curl http://localhost:4001/api/users

# Test product service
curl http://localhost:4002/api/products

# Test order service
curl -X POST http://localhost:4003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "productId": 1, "quantity": 2}'
```

## 🌐 Ingress Configuration

The ingress is configured to route:
- `/api/users/*` → user-service:3001
- `/api/products/*` → product-service:3002
- `/api/orders/*` → order-service:3003

**Host**: microservices.local

Add to your `/etc/hosts`:
```
<INGRESS_IP> microservices.local
```

## 🗑️ Uninstalling

```bash
# Uninstall the release
helm uninstall microservices

# Uninstall from specific namespace
helm uninstall microservices --namespace microservices
```

## 📊 Monitoring

```bash
# Watch pods
kubectl get pods -w

# Describe a pod
kubectl describe pod <pod-name>

# Get events
kubectl get events --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods
```

## 🎯 Next Steps

1. ✅ Build Docker images for all three services
2. ✅ Push images to a container registry (if using Kubernetes cluster)
3. ✅ Update image repositories in values.yaml
4. ✅ Install Helm chart
5. ✅ Verify all pods are running
6. ✅ Test the services

