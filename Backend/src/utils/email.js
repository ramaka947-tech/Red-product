const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ===== EMAIL RESET MOT DE PASSE =====
const envoyerEmailResetPassword = async (email) => {
  const mailOptions = {
    from: `"RED PRODUCT" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: #f0f0f0; border-radius: 10px;">
        <h2 style="color: #45484B;">RED PRODUCT</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour continuer :</p>
        <a href="https://red-product-xi.vercel.app/connexion.html" 
           target="_blank"
           style="display: inline-block; background: #45484B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0; cursor: pointer;">
          Se connecter
        </a>
        <p style="color: #999; font-size: 12px;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// ===== EMAIL ACTIVATION COMPTE =====
const envoyerEmailActivation = async (email, nom, token) => {
  const lienActivation = `https://red-product-kjmc.onrender.com/api/auth/activer/${token}`;

  const mailOptions = {
    from: `"RED PRODUCT" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Activez votre compte RED PRODUCT',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: #f0f0f0; border-radius: 10px;">
        <h2 style="color: #45484B;">RED PRODUCT</h2>
        <p>Bonjour <strong>${nom}</strong>,</p>
        <p>Merci de vous être inscrit sur RED PRODUCT.</p>
        <p>Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
        <a href="${lienActivation}" 
           target="_blank"
           style="display: inline-block; background: #45484B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0; cursor: pointer;">
          Activer mon compte
        </a>
        <p style="color: #999; font-size: 12px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { envoyerEmailResetPassword, envoyerEmailActivation };