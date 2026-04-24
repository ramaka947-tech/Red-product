// Validation inscription
exports.validateRegister = (req, res, next) => {
  const { nom, email, motDePasse } = req.body;

  if (!nom || nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom est obligatoire' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (!motDePasse || motDePasse.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  next();
};

// Validation connexion
exports.validateLogin = (req, res, next) => {
  const { email, motDePasse } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (!motDePasse) {
    return res.status(400).json({ message: 'Le mot de passe est obligatoire' });
  }

  next();
};

// Validation hotel
exports.validateHotel = (req, res, next) => {
  const { nom, adresse, email, telephone, prixParNuit } = req.body;

  if (!nom || nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom est obligatoire' });
  }

  if (!adresse || adresse.trim() === '') {
    return res.status(400).json({ message: "L'adresse est obligatoire" });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (!telephone || telephone.trim() === '') {
    return res.status(400).json({ message: 'Le téléphone est obligatoire' });
  }

  if (!prixParNuit || prixParNuit <= 0) {
    return res.status(400).json({ message: 'Le prix doit être supérieur à 0' });
  }

  next();
};