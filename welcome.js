// welcome.js - Handles logout functionality

document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  // Clear tokens and session data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  sessionStorage.clear();
  alert('You have been logged out.');
  window.location.href = 'index.html';
});
