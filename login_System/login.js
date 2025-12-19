// login2.js - Web login logic adapted from (auth)/login.js

async function loginUser(event) {
  event.preventDefault();
  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value;

  // Validate input
  if (!/^\d{10}$/.test(mobile)) return alert('Enter valid 10-digit mobile number');
  if (password.length < 6) return alert('Password must be at least 6 characters');
  if (password.length > 12) return alert('Password must be max 12 characters');
  if (!/[A-Za-z]/.test(password)) return alert('Must include letters (A–Z)');
  if (!/[0-9]/.test(password)) return alert('Must include numbers (0–9)');

  try {
    // Login request
    const res = await fetch('http://192.168.0.112:5000/api/auth/login-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password })
    });
    let data = {};
    let text = await res.text();
    try { data = JSON.parse(text); } catch { data = {}; }
    if (!res.ok) throw new Error(data.message || 'Login error');

    // Store tokens and role
    console.log('Received accessToken:', data.accessToken);
    console.log('Received refreshToken:', data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}; path=/;`;
    document.cookie = `refreshToken=${data.refreshToken}; path=/;`;
    if (data.role) localStorage.setItem('role', data.role);

    // Redirect after login
    window.location.href = "../index.html";
  } catch (err) {
    alert(err.message || 'Login error');
  }
}

document.getElementById('loginForm').addEventListener('submit', loginUser);
