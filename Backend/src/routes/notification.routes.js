const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const {
  getNotifications,
  marquerCommeLue,
  marquerToutesCommeLues,
  compterNonLues,
  supprimerNotification,
  supprimerToutes
} = require('../controllers/notification.controller');

router.get('/', protect, getNotifications);
router.get('/count', protect, compterNonLues);
router.put('/toutes/lues', protect, marquerToutesCommeLues);
router.put('/:id/lue', protect, marquerCommeLue);
router.delete('/toutes', protect, supprimerToutes);
router.delete('/:id', protect, supprimerNotification);

module.exports = router;