// Protection des pages - redirige si pas connecté
if (!sessionStorage.getItem('token')) {
  window.location.replace('connexion.html');
}