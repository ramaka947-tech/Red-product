document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

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
        window.location.href = 'hotel_listes.html';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
    }
  });