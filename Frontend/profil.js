// ===== PHOTO DE PROFIL (partagé entre dashboard et hotel_listes) =====
let photoBase64 = '';

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

// ===== INITIALISER PHOTO AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', function () {
  
  // Preview avant sauvegarde
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

  // Charger la photo existante
  fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(user => {
    if (user.photo) afficherPhotoProfil(user.photo);
  })
  .catch(() => {});
});