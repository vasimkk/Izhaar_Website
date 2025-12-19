// Razorpay Payment Integration for Prices Page (with explanation)
// The 'key' (key_id) is required here because Razorpay Checkout runs in the user's browser and needs to know which merchant account to use.
// This key is public and safe to use on the frontend. Your secret key must only be used on the backend.
if (document.getElementById('pay-btn')) {
    document.getElementById('pay-btn').onclick = async function () {
        // 1. Create order on your backend
        const orderRes = await fetch('http://localhost:5000/api/razorpay/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 500 }) // amount in INR
        });
        const order = await orderRes.json();

        // 2. Open Razorpay Checkout
        const options = {
            key: "rzp_test_Rt2p9OZv2KbFMZ", // Replace with your Razorpay key_id
            amount: order.amount, // 
            currency: order.currency,
            name: "Izhaar",
            description: "Access Payment",
            order_id: order.id,
            handler: function (response) {
                // 3. Show success and optionally verify payment on backend
                document.getElementById('payment-status').innerText = "Payment successful! Payment ID: " + response.razorpay_payment_id;
                // Optionally: send response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature to your backend for verification
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            theme: {
                color: "#ff3a76"
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    };
}
// Razorpay Payment Integration for Prices Page
document.addEventListener('DOMContentLoaded', function () {
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', function () {
            // 1. Fetch order from backend (simulate for demo)
            // In production, replace this with an actual API call to your backend to create an order
            fetch('https://your-backend.example.com/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 10000, currency: 'INR' }) // Example: ₹100.00
            })
            .then(res => res.json())
            .then(order => {
                // 2. Use order.id in Razorpay Checkout
                const options = {
                    key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Izhaar',
                    description: 'Premium Access',
                    order_id: order.id,
                    handler: function (response) {
                        // 3. (Optional) Verify payment on backend
                        fetch('https://your-backend.example.com/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                document.getElementById('payment-status').textContent = 'Payment successful! Access granted.';
                            } else {
                                document.getElementById('payment-status').textContent = 'Payment verification failed.';
                            }
                        })
                        .catch(() => {
                            document.getElementById('payment-status').textContent = 'Error verifying payment.';
                        });
                    },
                    theme: { color: '#ff1744' }
                };
                const rzp = new Razorpay(options);
                rzp.open();
            })
            .catch(() => {
                document.getElementById('payment-status').textContent = 'Error creating order. Please try again.';
            });
        });
    }
});
// Set launch date (30 days from now)
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 30);

// Countdown Timer Function
function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update countdown display
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Check if countdown is finished
    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
    }
}

// Update countdown every second (only if countdown exists)
updateCountdown();
setInterval(updateCountdown, 1000);

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission (replace with actual API call)
    submitForm(name, email, message);
});

function submitForm(name, email, message) {
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Prepare form data for email submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_to', 'izhaarlove2025@gmail.com');
    formData.append('_subject', 'New Contact Form Submission - Izhaar');
    formData.append('_captcha', 'false');

    // Send to Formspree
    fetch('https://formspree.io/f/manrbzoq', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Store in localStorage as backup
            const submissions = JSON.parse(localStorage.getItem('izhaarSubmissions') || '[]');
            submissions.push({
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('izhaarSubmissions', JSON.stringify(submissions));

            // Show success message
            showMessage('Thank you! We\'ll notify you when we launch.', 'success');

            // Reset form
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Oops! There was a problem submitting your form. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;

    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Console message
console.log('%cIzhaar - Coming Soon!', 'color: #ff1744; font-size: 24px; font-weight: bold;');
console.log('%cWe\'re excited to launch soon!', 'color: #ff5252; font-size: 14px;');
