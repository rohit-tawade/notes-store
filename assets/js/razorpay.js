// Process checkout
document.getElementById('payment-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    processPayment();
});

function processPayment() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Calculate total amount
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discount').textContent.replace(/[^0-9.]/g, '')) || 0;
    const total = subtotal - discount;
    
    // Create order options
    const options = {
        key: 'rzp_test_YOUR_RAZORPAY_KEY', // Replace with your key
        amount: total * 100, // Amount in paise
        currency: 'INR',
        name: 'StudyNotes',
        description: 'Purchase of Study Notes',
        order_id: 'order_' + Date.now(), // In production, get this from your backend
        handler: function(response) {
            handlePaymentSuccess(response, cart);
        },
        prefill: {
            name: name,
            email: email,
            contact: phone
        },
        theme: {
            color: '#4361ee'
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

function handlePaymentSuccess(response, cart) {
    console.log('Payment successful:', response);
    
    // Generate download links
    const downloadLinks = cart.map(item => 
        `<li>
            <a href="${item.file}" download>${item.title} (${item.quantity})</a>
            <i class="fas fa-download"></i>
        </li>`
    ).join('');
    
    // Store download links for success page
    sessionStorage.setItem('downloadLinks', downloadLinks);
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Redirect to success page
    window.location.href = 'success.html';
}