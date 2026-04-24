// ===== NOTIFICATIONS (partagé entre dashboard et hotel_listes) =====

async function chargerNotifications() {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const notifications = await response.json();

    const nonLues = notifications.filter(n => !n.lu).length;
    document.getElementById('compteurNotifications').textContent = nonLues;

    const liste = document.getElementById('listeNotifications');
    liste.innerHTML = '';

    if (notifications.length === 0) {
      liste.innerHTML = '<p class="text-center text-[#AAAAAA] py-4">Aucune notification</p>';
      return;
    }

    notifications.forEach(notif => {
      const item = document.createElement('div');
      item.classList.add('px-4', 'py-3', 'border-b', 'border-[#F0F0F0]', 'flex', 'justify-between', 'items-start', 'gap-2');
      if (!notif.lu) item.classList.add('bg-[#FFF8E7]');
      item.innerHTML = `
        <div class="flex-1 cursor-pointer">
          <p class="text-[13px] text-[#333333]">${notif.message}</p>
          <p class="text-[11px] text-[#AAAAAA] mt-1">${new Date(notif.createdAt).toLocaleDateString('fr-FR')}</p>
        </div>
        <button onclick="supprimerNotification('${notif._id}')" class="text-[#AAAAAA] hover:text-red-500 text-[14px] ml-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
      item.querySelector('.flex-1').addEventListener('click', async () => {
        await fetch(`${API_URL}/notifications/${notif._id}/lue`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        chargerNotifications();
      });
      liste.appendChild(item);
    });
  } catch (error) {
    console.error('Erreur notifications:', error);
  }
}

function toggleNotifications() {
  const panel = document.getElementById('panneauNotifications');
  panel.classList.toggle('hidden');
  chargerNotifications();
}

async function marquerToutesLues() {
  await fetch(`${API_URL}/notifications/toutes/lues`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  chargerNotifications();
}

async function supprimerNotification(id) {
  await fetch(`${API_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  chargerNotifications();
}

async function supprimerToutesNotifications() {
  await fetch(`${API_URL}/notifications/toutes`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  chargerNotifications();
}