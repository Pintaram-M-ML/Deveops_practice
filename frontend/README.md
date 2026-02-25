# Microservices Dashboard - Frontend UI

A beautiful, modern web interface to interact with your microservices (User, Product, and Order services).

## Features

✨ **Modern UI Design**
- Clean, gradient-based design
- Responsive layout for all devices
- Card-based data display
- Real-time health status monitoring

🎯 **Functionality**
- View all users, products, and orders
- Create new users, products, and orders
- Real-time API interaction
- Toast notifications for user feedback
- Health check monitoring for all services

## Prerequisites

- Node.js installed
- All three microservices running:
  - User Service on port 4001
  - Product Service on port 4002
  - Order Service on port 4003

## Installation

```bash
cd frontend
npm install
```

## Running the Frontend

```bash
npm start
```

The frontend will be available at: **http://localhost:8080**

## Usage

### 1. View Data
Click on "Get All Users", "Get All Products", or "Get All Orders" to fetch and display data from the respective services.

### 2. Create New Records

**Create User:**
1. Click "Create User" button
2. Fill in Name and Email
3. Click "Save User"

**Create Product:**
1. Click "Create Product" button
2. Fill in Product Name, Price, and Stock
3. Click "Save Product"

**Create Order:**
1. Click "Create Order" button
2. Enter User ID, Product ID, and Quantity
3. Click "Create Order"

### 3. Health Monitoring
The header shows real-time health status of all three services:
- 🟢 Green = Service is healthy
- 🔴 Red = Service is down or unreachable

## API Endpoints Used

### User Service (Port 4001)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /health` - Health check

### Product Service (Port 4002)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /health` - Health check

### Order Service (Port 4003)
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /health` - Health check

## Troubleshooting

### Services Not Connecting
If you see "Failed to connect" errors:
1. Make sure all microservices are running
2. Check that services are on the correct ports (4001, 4002, 4003)
3. Verify CORS is enabled on the backend services

### Health Status Shows Red
- Ensure the service is running
- Check the service logs for errors
- Verify the `/health` endpoint is accessible

## File Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
├── server.js       # Express server
├── package.json    # Dependencies
└── README.md       # This file
```

## Technologies Used

- HTML5
- CSS3 (with modern gradients and animations)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)
- Express.js (for serving)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Screenshots

The UI includes:
- Beautiful gradient header with service health indicators
- Card-based layout for displaying data
- Interactive forms for creating records
- Toast notifications for user feedback
- Responsive design for mobile and desktop

