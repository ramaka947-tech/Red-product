const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { envoyerEmailResetPassword } = require('../utils/email');
const Notification = require('../models/Notification');

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;

    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hash = await bcrypt.hash(motDePasse, 10);
    const user = await User.create({ nom, email, motDePasse: hash });

    // Créer notification de bienvenue
    await Notification.create({
      user: user._id,
      message: `Bienvenue ${user.nom} sur RED PRODUCT, la plateforme idéale pour gérer vos hôtels !`,
      type: 'bienvenue'
    });

    res.status(201).json({ message: 'Inscription réussie', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Connexion
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id, nom: user.nom }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Profil utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mot de passe oublié
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

// Modifier photo de profil
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

// Stats dashboard
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

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};