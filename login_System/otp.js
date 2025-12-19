// otp2.js - Web OTP verification logic adapted from (auth)/otp.js

const mobile = sessionStorage.getItem('registerMobile');
const type = sessionStorage.getItem('registerType') || 'register';

document.getElementById('otpSubtitle').textContent = mobile ? `Sent to +91 ${mobile}` : 'Redirecting...';

if (!mobile) {
  // If no mobile in session, redirect to register
  setTimeout(() => {
    window.location.href = 'register2.html';
  }, 100);
}

document.getElementById('otpForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const otp = document.getElementById('otp').value.trim();
  const btn = document.getElementById('otpBtn');

  if (!/^\d{4}$/.test(otp)) {
    alert('Enter valid 4-digit OTP');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Verifying...';

  try {
    const res = await fetch('http://192.168.0.112:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    });
    const data = await res.json();
    if (!res.ok && res.status !== 404) throw new Error(data.message || 'OTP verification failed');

    // On success or fallback, go to set password page
    sessionStorage.setItem('registerOtp', otp);
    window.location.href = 'create-password.html';
  } catch (err) {
    alert(err.message || 'OTP verification failed');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Verify OTP';
  }
});

document.getElementById('resendOtp').addEventListener('click', async function() {
  if (!mobile) return;
  try {
    const res = await fetch('/auth/regenerate-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    if (!res.ok) throw new Error('Error sending new OTP');
    alert('New OTP sent!');
  } catch {
    alert('Error sending new OTP');
  }
});
