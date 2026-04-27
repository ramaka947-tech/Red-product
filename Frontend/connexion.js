document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    btn.classList.add('btn-loader');
    btn.textContent = 'Connexion...';

    const email = document.getElementById('email').value;
    const motDePasse = document.getElementById('motDePasse').value;

    try {
      const response = await fetch('https://red-product-kjmc.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        sessionStorage.setItem('token', result.token);
        window.location.href = 'index.html';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
    } finally {
      btn.classList.remove('btn-loader');
      btn.textContent = btnText;
    }
});