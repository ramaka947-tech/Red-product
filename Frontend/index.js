const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function () {

  // ===== PROTECTION DE LA PAGE =====
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    window.location.href = 'connexion.html';
  }

  // ===== DECONNEXION =====
  function deconnexion() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = 'connexion.html';
  }
  window.deconnexion = deconnexion;

  // ===== MENU =====
  function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
  }
  window.toggleMenu = toggleMenu;

  // ===== AFFICHER UTILISATEUR =====
  if (token) {
    fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
      if (user.nom) {
        document.getElementById('userNom').textContent = user.nom;
      }
    })
    .catch(() => {});
  }

  // ===== CHARGER STATS =====
  async function chargerStats() {
    try {
      const response = await fetch(`${API_URL}/hotels`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const hotels = await response.json();
      document.getElementById('compteurHotels').textContent = hotels.length;
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  }

  chargerStats();

});