// Redirige si déjà connecté
if (sessionStorage.getItem('token')) {
  window.location.replace('index.html');
}