const API_URL = 'https://red-product-kjmc.onrender.com/api';
const token = sessionStorage.getItem('token');

// ===== PROTECTION DE LA PAGE =====
if (!token) {
  window.location.href = 'connexion.html';
}

// ===== DECONNEXION =====
function deconnexion() {
  sessionStorage.removeItem('token');
  window.location.href = 'connexion.html';
}
window.deconnexion = deconnexion;

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

// ===== RECHERCHE HOTELS =====
function rechercherHotels(query) {
  const cartes = document.querySelectorAll('#hotels-container > div');
  const recherche = query.toLowerCase();

  cartes.forEach(carte => {
    const nom = carte.querySelector('h2').textContent.toLowerCase();
    const adresse = carte.querySelector('p').textContent.toLowerCase();
    const prix = carte.querySelector('p:last-child').textContent.toLowerCase();

    if (nom.includes(recherche) || adresse.includes(recherche) || prix.includes(recherche)) {
      carte.style.display = 'block';
    } else {
      carte.style.display = 'none';
    }
  });
}

// ===== CONVERTIR IMAGE EN BASE64 =====
function convertirEnBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Fonction afficher erreur
function afficherErreur(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.classList.add('border-red-500');

  let errDiv = field.parentElement.querySelector('.err-msg');
  if (!errDiv) {
    errDiv = document.createElement('p');
    errDiv.classList.add('err-msg', 'text-red-500', 'text-[12px]', 'mt-1');
    field.parentElement.appendChild(errDiv);
  }
  errDiv.textContent = message;

  field.addEventListener('input', () => {
    field.classList.remove('border-red-500');
    errDiv.remove();
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', function () {

  // ===== AFFICHER UTILISATEUR =====
  fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(user => {
    if (user.nom) document.getElementById('userNom').textContent = user.nom;
  })
  .catch(() => {});

  // ===== MODAL CREER =====
  function openModal() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  window.openModal = openModal;

  function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.body.style.overflow = '';
    document.getElementById('hotelForm').reset();
    document.getElementById('previewHotelPhoto').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mb-2 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-[13px]">Ajouter une photo</span>
    `;
  }
  window.closeModal = closeModal;

  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // ===== PREVIEW IMAGE HOTEL =====
  document.getElementById('photo').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('previewHotelPhoto');
      preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
    };
    reader.readAsDataURL(file);
  });

  // ===== MODAL DETAILS =====
  function ouvrirModalDetails(hotel) {
    document.getElementById('detailNom').textContent = hotel.nom;
    document.getElementById('detailAdresse').textContent = hotel.adresse;
    document.getElementById('detailEmail').textContent = hotel.email;
    document.getElementById('detailTelephone').textContent = hotel.telephone;
    document.getElementById('detailPrix').textContent = Number(hotel.prixParNuit).toLocaleString('fr-FR') + ' ' + hotel.devise.toUpperCase() + ' par nuit';
    document.getElementById('detailPhoto').src = hotel.photo || 'https://placehold.co/400x200?text=Hotel';

    document.getElementById('btnModifierDetail').onclick = () => {
      closeModalDetails();
      ouvrirModalModifier(hotel._id, hotel.nom, hotel.adresse, hotel.email, hotel.telephone, hotel.prixParNuit, hotel.devise);
    };

    document.getElementById('btnSupprimerDetail').onclick = () => {
      closeModalDetails();
      supprimerHotel(hotel._id);
    };

    document.getElementById('modalDetails').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModalDetails() {
    document.getElementById('modalDetails').classList.add('hidden');
    document.body.style.overflow = '';
  }
  window.closeModalDetails = closeModalDetails;

  // ===== CHARGER LES HOTELS =====
  async function chargerHotels() {
    const container = document.getElementById('hotels-container');
    container.innerHTML = '<div class="loader-hotels"></div>';

    try {
      const response = await fetch(`${API_URL}/hotels`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        sessionStorage.removeItem('token');
        window.location.href = 'connexion.html';
        return;
      }

      const hotels = await response.json();
      container.innerHTML = '';
      document.getElementById('compteurHotels').textContent = hotels.length;

      if (hotels.length === 0) {
        container.innerHTML = '<p class="text-center text-[#AAAAAA] py-10 col-span-4">Aucun hôtel pour le moment</p>';
        return;
      }

      hotels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      hotels.forEach(hotel => {
        const carte = document.createElement('div');
        carte.classList.add('bg-white', 'rounded-xl', 'overflow-hidden', 'shadow-sm');
        carte.style.cursor = 'pointer';
        carte.innerHTML = `
          <img src="${hotel.photo || 'https://placehold.co/400x200?text=Hotel'}" 
               class="w-full h-[180px] object-cover">
          <div class="p-3">
            <p class="text-[#8D4B38] text-[12px]">${hotel.adresse}</p>
            <h2 class="font-semibold text-[16px]">${hotel.nom}</h2>
            <p class="text-[13px] text-[#555555]">${Number(hotel.prixParNuit).toLocaleString('fr-FR')} ${hotel.devise.toUpperCase()} par nuit</p>
          </div>
        `;
        carte.addEventListener('click', () => ouvrirModalDetails(hotel));
        container.appendChild(carte);
      });

    } catch (error) {
      container.innerHTML = '<p class="text-center text-red-500 py-10 col-span-4">Erreur de chargement</p>';
      console.error('Erreur chargement hôtels:', error);
    }
  }

  // ===== CREER UN HOTEL =====
  document.getElementById('hotelForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nom = document.getElementById('nom').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const prixParNuit = document.getElementById('prixParNuit').value;

    if (!nom) return afficherErreur('nom', 'Le nom est obligatoire');
    if (!adresse) return afficherErreur('adresse', "L'adresse est obligatoire");
    if (!email || !email.includes('@')) return afficherErreur('email', 'Email invalide');
    if (!telephone) return afficherErreur('telephone', 'Le téléphone est obligatoire');
    if (!prixParNuit || prixParNuit <= 0) return afficherErreur('prixParNuit', 'Le prix doit être supérieur à 0');

    const btn = this.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    btn.classList.add('btn-loader');
    btn.textContent = 'Enregistrement...';

    const photoFile = document.getElementById('photo').files[0];
    let photoBase64 = '';
    if (photoFile) {
      photoBase64 = await convertirEnBase64(photoFile);
    }

    const data = { nom, adresse, email, telephone, prixParNuit, devise: document.getElementById('devise').value, photo: photoBase64 };

    try {
      const response = await fetch(`${API_URL}/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        closeModal();
        chargerHotels();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur création hôtel:', error);
    } finally {
      btn.classList.remove('btn-loader');
      btn.textContent = btnText;
    }
  });

  // ===== MODAL MODIFIER =====
  function ouvrirModalModifier(id, nom, adresse, email, telephone, prix, devise) {
    document.getElementById('editId').value = id;
    document.getElementById('editNom').value = nom;
    document.getElementById('editAdresse').value = adresse;
    document.getElementById('editEmail').value = email;
    document.getElementById('editTelephone').value = telephone;
    document.getElementById('editPrix').value = prix;
    document.getElementById('editDevise').value = devise;
    document.getElementById('modalModifier').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  window.ouvrirModalModifier = ouvrirModalModifier;

  function closeModalModifier() {
    document.getElementById('modalModifier').classList.add('hidden');
    document.body.style.overflow = '';
  }
  window.closeModalModifier = closeModalModifier;

  document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    btn.classList.add('btn-loader');
    btn.textContent = 'Modification...';

    const id = document.getElementById('editId').value;
    const data = {
      nom: document.getElementById('editNom').value,
      adresse: document.getElementById('editAdresse').value,
      email: document.getElementById('editEmail').value,
      telephone: document.getElementById('editTelephone').value,
      prixParNuit: document.getElementById('editPrix').value,
      devise: document.getElementById('editDevise').value,
    };

    try {
      const response = await fetch(`${API_URL}/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        closeModalModifier();
        chargerHotels();
      } else {
        alert('Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur modification:', error);
    } finally {
      btn.classList.remove('btn-loader');
      btn.textContent = btnText;
    }
  });

  // ===== SUPPRIMER UN HOTEL =====
  async function supprimerHotel(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet hôtel ?')) return;

    try {
      const response = await fetch(`${API_URL}/hotels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        chargerHotels();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  }
  window.supprimerHotel = supprimerHotel;

  // Fermer panneau notifications si clic ailleurs
  document.addEventListener('click', function (e) {
    const panel = document.getElementById('panneauNotifications');
    const bell = document.getElementById('clochette');
    if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });

  chargerHotels();
  chargerNotifications();

});