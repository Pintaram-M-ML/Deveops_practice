# Microservices Project

A simple microservices architecture with 3 services built with Node.js and Express.

## Services

### 1. User Service (Port 4001)
Manages user data and operations.

**Endpoints:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `GET /health` - Health check 

### 2. Product Service (Port 4002)
Manages product catalog and inventory.

**Endpoints:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PATCH /api/products/:id/stock` - Update product stock
- `GET /health` - Health check

### 3. Order Service (Port 4003)
Manages orders and communicates with User and Product services.

**Endpoints:**
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order (validates user and product)
- `GET /health` - Health check

## Running the Project

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

### Option 2: Running Locally

Install dependencies for each service:

```bash
cd user-service && npm install && cd ..
cd product-service && npm install && cd ..
cd order-service && npm install && cd ..
```

Start each service in separate terminals:

```bash
# Terminal 1
cd user-service && npm start

# Terminal 2
cd product-service && npm start

# Terminal 3
cd order-service && npm start
```

## Testing the Services

### Create an Order

```bash
# Create an order (user ID 1 orders 2 units of product ID 1)
curl -X POST http://localhost:4003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "productId": 1, "quantity": 2}'
```

### Get All Users

```bash
curl http://localhost:4001/api/users
```

### Get All Products

```bash
curl http://localhost:4002/api/products
```

### Get All Orders

```bash
curl http://localhost:4003/api/orders
```

## Architecture

The Order Service acts as an orchestrator that communicates with both User and Product services to validate and create orders. When an order is created:

1. Validates the user exists (calls User Service)
2. Validates the product exists and has sufficient stock (calls Product Service)
3. Updates the product stock (calls Product Service)
4. Creates and stores the order

## Project Structure

```
.
├── user-service/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── product-service/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── order-service/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

