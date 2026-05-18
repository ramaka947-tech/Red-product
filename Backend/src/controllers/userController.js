const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { envoyerEmailResetPassword, envoyerEmailActivation } = require('../utils/email');
const Notification = require('../models/Notification');

// ===== INSCRIPTION =====
exports.register = async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;

    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hash = await bcrypt.hash(motDePasse, 10);
    const tokenActivation = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      nom,
      email,
      motDePasse: hash,
      estActif: false,
      tokenActivation
    });

    await envoyerEmailActivation(email, nom, tokenActivation);

    await Notification.create({
      user: user._id,
      message: `Bienvenue ${user.nom} sur RED PRODUCT ! Veuillez activer votre compte via l'email envoyé.`,
      type: 'bienvenue'
    });

    res.status(201).json({ message: 'Inscription réussie ! Vérifiez votre email pour activer votre compte.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== ACTIVATION DU COMPTE =====
exports.activerCompte = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ tokenActivation: token });
    if (!user) {
      return res.status(400).send(`
        <div style="font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0;">
          <h2 style="color: red;">❌ Lien invalide ou déjà utilisé.</h2>
          <a href="https://red-product-xi.vercel.app/connexion.html"
             style="display: inline-block; background: #45484B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
            Retour à la connexion
          </a>
        </div>
      `);
    }

    user.estActif = true;
    user.tokenActivation = '';
    await user.save();

    res.send(`
      <div style="font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0;">
        <h2 style="color: #45484B;">✅ Compte activé avec succès !</h2>
        <p>Votre compte RED PRODUCT est maintenant actif.</p>
        <a href="https://red-product-xi.vercel.app/connexion.html" 
           style="display: inline-block; background: #45484B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Se connecter
        </a>
      </div>
    `);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== CONNEXION =====
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.estActif) {
      return res.status(403).json({ message: 'Compte non activé. Vérifiez votre email pour activer votre compte.' });
    }

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user._id, nom: user.nom, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== PROFIL UTILISATEUR CONNECTÉ =====
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== MOT DE PASSE OUBLIÉ =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'Si cet e-mail existe, vous recevrez les instructions sous peu.' });
    }

    await envoyerEmailResetPassword(email);

    res.status(200).json({ message: 'Si cet e-mail existe, vous recevrez les instructions sous peu.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== MODIFIER PHOTO DE PROFIL =====
exports.updatePhoto = async (req, res) => {
  try {
    const { photo } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photo },
      { new: true }
    ).select('-motDePasse');
    res.status(200).json({ message: 'Photo mise à jour', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== STATS DASHBOARD =====
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      utilisateurs: totalUsers,
      formulaires: 0,
      messages: 0,
      emails: 0,
      entites: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== OBTENIR TOUS LES UTILISATEURS =====
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};