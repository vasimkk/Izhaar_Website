// Set launch date (30 days from now)
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 30);

// Countdown Timer Function
function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update countdown display
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Check if countdown is finished
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Update countdown every second
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
