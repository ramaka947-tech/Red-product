document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const motDePasse = document.getElementById('motDePasse').value;
    const terms = document.getElementById('terms').checked;
    const errorMsg = document.getElementById('errorMsg');

    if (!terms) {
        errorMsg.textContent = 'Veuillez accepter les termes et la politique.';
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email, motDePasse })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = 'connexion.html';
        } else {
            errorMsg.textContent = result.message;
            errorMsg.classList.remove('hidden');
        }
    } catch (error) {
        errorMsg.textContent = 'Erreur de connexion au serveur.';
        errorMsg.classList.remove('hidden');
    }
});