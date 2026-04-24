document.getElementById('passwordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const msgDiv = document.getElementById('message');

    if (!email) {
        msgDiv.textContent = 'Veuillez entrer votre adresse e-mail.';
        msgDiv.classList.remove('hidden', 'text-green-600');
        msgDiv.classList.add('text-red-500');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
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
    }
});