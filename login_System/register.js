// register2.js - Web registration logic adapted from (auth)/register.js

document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const mobile = document.getElementById('mobile').value.trim();
  const btn = document.getElementById('registerBtn');

  if (!/^\d{10}$/.test(mobile)) {
    alert('Enter valid mobile number');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending OTP...';

  try {
    const res = await fetch('http://192.168.0.112:5000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, role: 'user' })
    });
    let data = {};
    let text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.message || `Error sending OTP (status ${res.status})`);
    }
    sessionStorage.setItem('registerMobile', mobile);
    sessionStorage.setItem('registerType', 'register');
    window.location.href = 'otp.html';
  } catch (err) {
    alert(err.message || 'Error sending OTP');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Continue';
  }
});
