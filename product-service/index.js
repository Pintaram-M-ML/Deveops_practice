const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// In-memory product database
let products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
  { id: 2, name: 'Mouse', price: 29.99, stock: 50 },
  { id: 3, name: 'Keyboard', price: 79.99, stock: 30 }
];

// Get all products
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// Create new product
app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock
  };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// Update product stock
app.patch('/api/products/:id/stock', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  const { quantity } = req.body;
  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }
  
  product.stock -= quantity;
  res.json({ success: true, data: product });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'product-service' });
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});

