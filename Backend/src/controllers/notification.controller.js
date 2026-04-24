const Notification = require('../models/Notification');

// Obtenir toutes les notifications de l'utilisateur
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer une notification comme lue
exports.marquerCommeLue = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { lu: true });
    res.status(200).json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer toutes les notifications comme lues
exports.marquerToutesCommeLues = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { lu: true });
    res.status(200).json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Compter les notifications non lues
exports.compterNonLues = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, lu: false });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une notification
exports.supprimerNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer toutes les notifications
exports.supprimerToutes = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.status(200).json({ message: 'Toutes les notifications supprimées' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};