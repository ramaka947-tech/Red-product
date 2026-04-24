const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

document.addEventListener('DOMContentLoaded', function () {

  // ===== PROTECTION DE LA PAGE =====
  //const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
      .catch(() => { });
  }

  // ===== MENU =====
  function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
  }
  window.toggleMenu = toggleMenu;

  // ===== MODAL CREER =====
  function openModal() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  window.openModal = openModal;

  function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.body.style.overflow = '';
  }
  window.closeModal = closeModal;

  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
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
    try {
      const response = await fetch(`${API_URL}/hotels`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const hotels = await response.json();

      const container = document.getElementById('hotels-container');
      container.innerHTML = '';

      document.getElementById('compteurHotels').textContent = hotels.length;

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
      console.error('Erreur chargement hôtels:', error);
    }
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

  // ===== CREER UN HOTEL =====
  document.getElementById('hotelForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const photoFile = document.getElementById('photo').files[0];
    let photoBase64 = '';
    if (photoFile) {
      photoBase64 = await convertirEnBase64(photoFile);
    }

    const data = {
      nom: document.getElementById('nom').value,
      adresse: document.getElementById('adresse').value,
      email: document.getElementById('email').value,
      telephone: document.getElementById('telephone').value,
      prixParNuit: document.getElementById('prixParNuit').value,
      devise: document.getElementById('devise').value,
      photo: photoBase64
    };

    try {
      const response = await fetch(`${API_URL}/hotels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        closeModal();
        document.getElementById('hotelForm').reset();
        chargerHotels();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur création hôtel:', error);
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  // Lancer au chargement
  chargerHotels();

  // Fermer le panneau si on clique ailleurs
  document.addEventListener('click', function (e) {
    const panel = document.getElementById('panneauNotifications');
    const bell = document.getElementById('clochette');
    if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });

});

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