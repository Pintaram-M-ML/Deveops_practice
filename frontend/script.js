// API Base URLs
const API_URLS = {
    user: 'http://localhost:4001',
    product: 'http://localhost:4002',
    order: 'http://localhost:4003'
};

// Check health status on load
window.addEventListener('DOMContentLoaded', () => {
    checkHealthStatus();
    setInterval(checkHealthStatus, 30000); // Check every 30 seconds
});

// Health Check
async function checkHealthStatus() {
    const services = ['user', 'product', 'order'];
    
    for (const service of services) {
        try {
            const response = await fetch(`${API_URLS[service]}/health`);
            const data = await response.json();
            
            const statusElement = document.getElementById(`${service}-status`);
            if (data.status === 'healthy') {
                statusElement.classList.add('healthy');
                statusElement.classList.remove('unhealthy');
            }
        } catch (error) {
            const statusElement = document.getElementById(`${service}-status`);
            statusElement.classList.add('unhealthy');
            statusElement.classList.remove('healthy');
        }
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== USER SERVICE ==========

// Get All Users
async function getUsers() {
    const output = document.getElementById('users-output');
    output.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading users...</div>';
    
    try {
        const response = await fetch(`${API_URLS.user}/api/users`);
        const data = await response.json();
        
        if (data.success) {
            displayUsers(data.data);
            showToast('Users loaded successfully!');
        } else {
            output.innerHTML = `<div class="error-message">Failed to load users</div>`;
        }
    } catch (error) {
        output.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}</div>`;
        showToast('Failed to connect to User Service', 'error');
    }
}

function displayUsers(users) {
    const output = document.getElementById('users-output');
    
    if (users.length === 0) {
        output.innerHTML = '<div class="error-message">No users found</div>';
        return;
    }
    
    let html = '<div class="card-grid">';
    users.forEach(user => {
        html += `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-user"></i> ${user.name}</div>
                    <div class="card-badge">ID: ${user.id}</div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-envelope"></i> Email:</span>
                        <span class="field-value">${user.email}</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    output.innerHTML = html;
}

// Show/Hide Create User Form
function showCreateUserForm() {
    document.getElementById('create-user-form').style.display = 'block';
}

function hideCreateUserForm() {
    document.getElementById('create-user-form').style.display = 'none';
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';
}

// Create User
async function createUser() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    
    if (!name || !email) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URLS.user}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('User created successfully!');
            hideCreateUserForm();
            getUsers();
        } else {
            showToast('Failed to create user', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// ========== PRODUCT SERVICE ==========

// Get All Products
async function getProducts() {
    const output = document.getElementById('products-output');
    output.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading products...</div>';
    
    try {
        const response = await fetch(`${API_URLS.product}/api/products`);
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.data);
            showToast('Products loaded successfully!');
        } else {
            output.innerHTML = `<div class="error-message">Failed to load products</div>`;
        }
    } catch (error) {
        output.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}</div>`;
        showToast('Failed to connect to Product Service', 'error');
    }
}

function displayProducts(products) {
    const output = document.getElementById('products-output');
    
    if (products.length === 0) {
        output.innerHTML = '<div class="error-message">No products found</div>';
        return;
    }
    
    let html = '<div class="card-grid">';
    products.forEach(product => {
        html += `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-box"></i> ${product.name}</div>
                    <div class="card-badge">ID: ${product.id}</div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-dollar-sign"></i> Price:</span>
                        <span class="field-value">$${product.price.toFixed(2)}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-warehouse"></i> Stock:</span>
                        <span class="field-value">${product.stock} units</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    output.innerHTML = html;
}

// Show/Hide Create Product Form
function showCreateProductForm() {
    document.getElementById('create-product-form').style.display = 'block';
}

function hideCreateProductForm() {
    document.getElementById('create-product-form').style.display = 'none';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
}

// Create Product
async function createProduct() {
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);

    if (!name || !price || !stock) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URLS.product}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, stock })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Product created successfully!');
            hideCreateProductForm();
            getProducts();
        } else {
            showToast('Failed to create product', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// ========== ORDER SERVICE ==========

// Get All Orders
async function getOrders() {
    const output = document.getElementById('orders-output');
    output.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading orders...</div>';

    try {
        const response = await fetch(`${API_URLS.order}/api/orders`);
        const data = await response.json();

        if (data.success) {
            displayOrders(data.data);
            showToast('Orders loaded successfully!');
        } else {
            output.innerHTML = `<div class="error-message">Failed to load orders</div>`;
        }
    } catch (error) {
        output.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}</div>`;
        showToast('Failed to connect to Order Service', 'error');
    }
}

function displayOrders(orders) {
    const output = document.getElementById('orders-output');

    if (orders.length === 0) {
        output.innerHTML = '<div class="error-message">No orders found</div>';
        return;
    }

    let html = '<div class="card-grid">';
    orders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleString();
        html += `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-shopping-cart"></i> Order #${order.id}</div>
                    <div class="card-badge">${order.status}</div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-user"></i> Customer:</span>
                        <span class="field-value">${order.userName}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-box"></i> Product:</span>
                        <span class="field-value">${order.productName}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-hashtag"></i> Quantity:</span>
                        <span class="field-value">${order.quantity}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-dollar-sign"></i> Total:</span>
                        <span class="field-value">$${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label"><i class="fas fa-clock"></i> Date:</span>
                        <span class="field-value">${orderDate}</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    output.innerHTML = html;
}

// Show/Hide Create Order Form
function showCreateOrderForm() {
    document.getElementById('create-order-form').style.display = 'block';
}

function hideCreateOrderForm() {
    document.getElementById('create-order-form').style.display = 'none';
    document.getElementById('order-userId').value = '';
    document.getElementById('order-productId').value = '';
    document.getElementById('order-quantity').value = '';
}

// Create Order
async function createOrder() {
    const userId = parseInt(document.getElementById('order-userId').value);
    const productId = parseInt(document.getElementById('order-productId').value);
    const quantity = parseInt(document.getElementById('order-quantity').value);

    if (!userId || !productId || !quantity) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URLS.order}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId, quantity })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Order created successfully!');
            hideCreateOrderForm();
            getOrders();
        } else {
            showToast(data.message || 'Failed to create order', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

