document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    const errorMsg = document.getElementById('errorMsg');

    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const motDePasse = document.getElementById('motDePasse').value;
    const terms = document.getElementById('terms').checked;

    // Validation
    if (!nom) {
        errorMsg.textContent = 'Le nom est obligatoire.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!email || !email.includes('@')) {
        errorMsg.textContent = 'Veuillez entrer un email valide.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!motDePasse || motDePasse.length < 6) {
        errorMsg.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!terms) {
        errorMsg.textContent = 'Veuillez accepter les termes et la politique.';
        errorMsg.classList.remove('hidden');
        return;
    }

    // Loader
    btn.classList.add('btn-loader');
    btn.textContent = 'Inscription...';
    errorMsg.classList.add('hidden');

    try {
        const response = await fetch('https://red-product-kjmc.onrender.com/api/auth/register', {
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
    } finally {
        btn.classList.remove('btn-loader');
        btn.textContent = btnText;
    }
});