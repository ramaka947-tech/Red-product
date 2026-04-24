const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

// ===== PROTECTION DE LA PAGE =====
if (!token) {
  window.location.href = 'connexion.html';
}

// ===== DECONNEXION =====
function deconnexion() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  window.location.href = 'connexion.html';
}

// ===== MENU =====
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
}

// ===== CHARGER STATS =====
async function chargerStats() {
  try {
    // Stats hotels
    const responseHotels = await fetch(`${API_URL}/hotels`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const hotels = await responseHotels.json();
    document.getElementById('compteurHotels').textContent = hotels.length;

    // Stats générales
    const responseStats = await fetch(`${API_URL}/auth/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stats = await responseStats.json();
    document.getElementById('compteurUtilisateurs').textContent = stats.utilisateurs;
    document.getElementById('compteurFormulaires').textContent = stats.formulaires;
    document.getElementById('compteurMessages').textContent = stats.messages;
    document.getElementById('compteurEmails').textContent = stats.emails;
    document.getElementById('compteurEntites').textContent = stats.entites;

  } catch (error) {
    console.error('Erreur stats:', error);
  }
}

// ===== TOGGLE NOTIFICATIONS =====
function toggleNotifications() {
  const panel = document.getElementById('panneauNotifications');
  panel.classList.toggle('hidden');
  chargerNotifications();
}

// ===== MARQUER TOUTES COMME LUES =====
async function marquerToutesLues() {
  await fetch(`${API_URL}/notifications/toutes/lues`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  chargerNotifications();
}

// ===== SUPPRIMER UNE NOTIFICATION =====
async function supprimerNotification(id) {
  await fetch(`${API_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  chargerNotifications();
}

// ===== SUPPRIMER TOUTES LES NOTIFICATIONS =====
async function supprimerToutesNotifications() {
  await fetch(`${API_URL}/notifications/toutes`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  chargerNotifications();
}

// ===== PHOTO DE PROFIL =====
function ouvrirModalProfil() {
  document.getElementById('modalProfil').classList.remove('hidden');
}

function fermerModalProfil() {
  document.getElementById('modalProfil').classList.add('hidden');
}

function afficherPhotoProfil(photo) {
  const imgTag = `<img src="${photo}" class="w-full h-full object-cover rounded-full">`;
  document.getElementById('photoProfilNav').innerHTML = imgTag;
  document.getElementById('photoProfilSidebar').innerHTML = imgTag;
  document.getElementById('previewProfil').innerHTML = imgTag;
}

async function sauvegarderPhoto() {
  if (!photoBase64) {
    alert('Veuillez choisir une photo');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/update-photo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ photo: photoBase64 })
    });

    const result = await response.json();
    if (response.ok) {
      afficherPhotoProfil(photoBase64);
      fermerModalProfil();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Erreur photo:', error);
  }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function () {

  // Charger utilisateur + photo
  fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(user => {
    if (user.nom) document.getElementById('userNom').textContent = user.nom;
    if (user.photo) afficherPhotoProfil(user.photo);
  })
  .catch(() => {});

  // Preview photo avant sauvegarde
  document.getElementById('inputPhotoProfil').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      photoBase64 = e.target.result;
      document.getElementById('previewProfil').innerHTML = `<img src="${photoBase64}" class="w-full h-full object-cover rounded-full">`;
    };
    reader.readAsDataURL(file);
  });

  // Fermer panneau notifications si clic ailleurs
  document.addEventListener('click', function (e) {
    const panel = document.getElementById('panneauNotifications');
    const bell = document.getElementById('clochette');
    if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });

  chargerStats();
  chargerNotifications();
});

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  if (sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('hidden');
    sidebar.classList.add('flex', 'flex-col');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('hidden');
    sidebar.classList.remove('flex', 'flex-col');
    overlay.classList.add('hidden');
  }
}

// ===== MODAL UTILISATEURS =====
async function ouvrirModalUtilisateurs() {
  document.getElementById('modalUtilisateurs').classList.remove('hidden');

  try {
    const response = await fetch(`${API_URL}/auth/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await response.json();

    const liste = document.getElementById('listeUtilisateurs');
    liste.innerHTML = '';

    if (users.length === 0) {
      liste.innerHTML = '<p class="text-center text-[#AAAAAA] py-4">Aucun utilisateur</p>';
      return;
    }

    users.forEach(user => {
      const item = document.createElement('div');
      item.classList.add('flex', 'items-center', 'gap-4', 'px-4', 'py-3', 'border-b', 'border-[#F0F0F0]');
      item.innerHTML = `
        <div class="w-[40px] h-[40px] rounded-full overflow-hidden bg-[#45484B] flex items-center justify-center text-white flex-shrink-0">
          ${user.photo ? `<img src="${user.photo}" class="w-full h-full object-cover">` : '<i class="fa-solid fa-user text-[16px]"></i>'}
        </div>
        <div class="flex-1">
          <p class="text-[15px] font-semibold text-[#333333]">${user.nom}</p>
          <p class="text-[12px] text-[#AAAAAA]">${user.email}</p>
        </div>
        <span class="text-[12px] px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}">
          ${user.role}
        </span>
      `;
      liste.appendChild(item);
    });

  } catch (error) {
    console.error('Erreur utilisateurs:', error);
  }
}

function fermerModalUtilisateurs() {
  document.getElementById('modalUtilisateurs').classList.add('hidden');
}