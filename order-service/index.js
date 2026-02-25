const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3003;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

app.use(cors());
app.use(express.json());

// In-memory order database
let orders = [];
let orderIdCounter = 1;

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// Create new order (communicates with user and product services)
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Verify user exists
    const userResponse = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
    if (!userResponse.data.success) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = userResponse.data.data;

    // Verify product exists and has enough stock
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
    if (!productResponse.data.success) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = productResponse.data.data;

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Update product stock
    await axios.patch(`${PRODUCT_SERVICE_URL}/api/products/${productId}/stock`, { quantity });

    // Create order
    const newOrder = {
      id: orderIdCounter++,
      userId,
      userName: user.name,
      productId,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    res.status(201).json({ success: true, data: newOrder });

  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service' });
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});

