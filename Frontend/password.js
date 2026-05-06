document.getElementById('passwordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    const email = document.getElementById('email').value.trim();
    const msgDiv = document.getElementById('message');

    if (!email || !email.includes('@')) {
        msgDiv.textContent = 'Veuillez entrer un email valide.';
        msgDiv.classList.remove('hidden', 'text-green-600');
        msgDiv.classList.add('text-red-500');
        return;
    }

    btn.classList.add('btn-loader');
    btn.textContent = 'Envoi en cours...';
    msgDiv.classList.add('hidden');

    try {
        const response = await fetch('https://red-product-kjmc.onrender.com/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        msgDiv.textContent = result.message;
        msgDiv.classList.remove('hidden', 'text-red-500');
        msgDiv.classList.add('text-green-600');
        document.getElementById('passwordForm').reset();

    } catch (error) {
        msgDiv.textContent = 'Erreur de connexion au serveur.';
        msgDiv.classList.remove('hidden', 'text-green-600');
        msgDiv.classList.add('text-red-500');
    } finally {
        btn.classList.remove('btn-loader');
        btn.textContent = btnText;
    }
});