// create-password.js - Web logic for password creation

const mobile = sessionStorage.getItem('registerMobile');
document.getElementById('cpwSubtitle').textContent = mobile ? `Account: +91 ${mobile}` : 'Account: +91';

function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 12) return "Password must be max 12 characters";
  if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
  if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
  return null;
}

document.getElementById('cpwForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const btn = document.getElementById('cpwBtn');

  const error = validatePassword(password);
  if (error) return alert(error);
  if (password !== confirmPassword) return alert('Passwords do not match');
  if (!mobile) return alert('Mobile number missing. Please register again.');

  btn.disabled = true;
  btn.textContent = 'Setting...';

  try {
    const res = await fetch('http://192.168.0.112:5000/api/auth/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password })
    });
    let data = {};
    let text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.message || `Error setting password (status ${res.status})`);
    }
    // Store tokens in cookies for web
    if (data.accessToken) {
      document.cookie = `accessToken=${data.accessToken}; path=/;`;
    }
    if (data.refreshToken) {
      document.cookie = `refreshToken=${data.refreshToken}; path=/;`;
    }
    alert('Password set successfully!');
    // Redirect based on role
    if (data.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = '../index.html';
    }
  } catch (err) {
    alert(err.message || 'Error setting password');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Set Password';
  }
});

document.getElementById('togglePassword').addEventListener('click', function() {
  const pwd = document.getElementById('password');
  if (pwd.type === 'password') {
    pwd.type = 'text';
    this.textContent = '🙈';
  } else {
    pwd.type = 'password';
    this.textContent = '👁️';
  }
});

document.getElementById('toggleConfirm').addEventListener('click', function() {
  const pwd = document.getElementById('confirmPassword');
  if (pwd.type === 'password') {
    pwd.type = 'text';
    this.textContent = '🙈';
  } else {
    pwd.type = 'password';
    this.textContent = '👁️';
  }
});
