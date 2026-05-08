const API_URL = 'https://red-product-kjmc.onrender.com/api';
const token = sessionStorage.getItem('token');

// Déconnexion quand on quitte la fenêtre
window.addEventListener('pagehide', function () {
  sessionStorage.removeItem('token');
});

// ===== PROTECTION DE LA PAGE =====
if (!token) {
  window.location.href = 'connexion.html';
}

// ===== DECONNEXION =====
function deconnexion() {
  sessionStorage.removeItem('token');
  window.location.href = 'connexion.html';
}

// Empêcher retour arrière après déconnexion
window.history.pushState(null, '', window.location.href);
window.addEventListener('popstate', function () {
  if (!sessionStorage.getItem('token')) {
    window.location.href = 'connexion.html';
  }
});

// ===== MENU =====
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

// ===== LOADER STATS =====
function afficherLoaderStats() {
  const ids = ['compteurHotels', 'compteurUtilisateurs', 'compteurFormulaires', 'compteurMessages', 'compteurEmails', 'compteurEntites'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>';
  });
}

// ===== CHARGER STATS =====
async function chargerStats() {
  afficherLoaderStats();
  try {
    const responseHotels = await fetch(`${API_URL}/hotels`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (responseHotels.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = 'connexion.html';
      return;
    }

    const hotels = await responseHotels.json();
    document.getElementById('compteurHotels').textContent = hotels.length;

    const responseStats = await fetch(`${API_URL}/auth/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stats = await responseStats.json();
    document.getElementById('compteurUtilisateurs').textContent = stats.utilisateurs ?? 0;
    document.getElementById('compteurFormulaires').textContent = stats.formulaires ?? 0;
    document.getElementById('compteurMessages').textContent = stats.messages ?? 0;
    document.getElementById('compteurEmails').textContent = stats.emails ?? 0;
    document.getElementById('compteurEntites').textContent = stats.entites ?? 0;

  } catch (error) {
    console.error('Erreur stats:', error);
    const ids = ['compteurHotels', 'compteurUtilisateurs', 'compteurFormulaires', 'compteurMessages', 'compteurEmails', 'compteurEntites'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '0';
    });
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
  const nav = document.getElementById('photoProfilNav');
  const sidebar = document.getElementById('photoProfilSidebar');
  const preview = document.getElementById('previewProfil');
  if (nav) nav.innerHTML = imgTag;
  if (sidebar) sidebar.innerHTML = imgTag;
  if (preview) preview.innerHTML = imgTag;
}

async function sauvegarderPhoto() {
  if (!photoBase64) {
    alert('Veuillez choisir une photo');
    return;
  }

  const btn = document.querySelector('#modalProfil button[onclick="sauvegarderPhoto()"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Enregistrement...';
  }

  try {
    const response = await fetch(`${API_URL}/auth/update-photo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Enregistrer';
    }
  }
}

// ===== MODAL UTILISATEURS =====
async function ouvrirModalUtilisateurs() {
  document.getElementById('modalUtilisateurs').classList.remove('hidden');
  const liste = document.getElementById('listeUtilisateurs');
  liste.innerHTML = `
    <div class="flex justify-center py-8">
      <span class="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
    </div>`;

  try {
    const response = await fetch(`${API_URL}/auth/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await response.json();
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
    liste.innerHTML = '<p class="text-center text-red-400 py-4">Erreur de chargement</p>';
    console.error('Erreur utilisateurs:', error);
  }
}

function fermerModalUtilisateurs() {
  document.getElementById('modalUtilisateurs').classList.add('hidden');
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function () {

  fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(user => {
    if (user.nom) document.getElementById('userNom').textContent = user.nom;
    if (user.photo) afficherPhotoProfil(user.photo);
  })
  .catch(() => {});

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