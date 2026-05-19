const fetch = require('node-fetch');

const envoyerEmailResetPassword = async (email) => {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'RED PRODUCT', email: 'ramaka947@gmail.com' },
      to: [{ email }],
      subject: 'Réinitialisation de votre mot de passe',
      htmlContent: `<p>Cliquez pour vous connecter : <a href="https://red-product-xi.vercel.app/connexion.html">Se connecter</a></p>`
    })
  });
};

const envoyerEmailActivation = async (email, nom, token) => {
  const lien = `https://red-product-kjmc.onrender.com/api/auth/activer/${token}`;
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'RED PRODUCT', email: 'ramaka947@gmail.com' },
      to: [{ email }],
      subject: 'Activez votre compte RED PRODUCT',
      htmlContent: `<p>Bonjour ${nom}, cliquez pour activer : <a href="${lien}">Activer mon compte</a></p>`
    })
  });
};

module.exports = { envoyerEmailResetPassword, envoyerEmailActivation };