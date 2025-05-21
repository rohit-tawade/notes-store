// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart UI on checkout page
function updateCartUI() {
    if (document.getElementById('order-items')) {
        const orderItems = document.getElementById('order-items');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        let subtotal = 0;
        orderItems.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <div class="order-item">
                    <span class="order-item-title">${item.title} × ${item.quantity}</span>
                    <span class="order-item-price">₹${itemTotal}</span>
                </div>
            `;
        }).join('');
        
        subtotalEl.textContent = `₹${subtotal}`;
        totalEl.textContent = `₹${subtotal}`;
    }
}

// Apply coupon code
document.getElementById('apply-coupon')?.addEventListener('click', function() {
    const couponCode = document.getElementById('coupon').value;
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    
    // Simple coupon validation
    if (couponCode === 'STUDENT10') {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * 0.1; // 10% discount
        const total = subtotal - discount;
        
        discountEl.textContent = `-₹${discount.toFixed(2)}`;
        totalEl.textContent = `₹${total.toFixed(2)}`;
        showNotification('Coupon applied successfully!');
    } else {
        showNotification('Invalid coupon code');
    }
});

// Initialize cart UI
updateCartUI();