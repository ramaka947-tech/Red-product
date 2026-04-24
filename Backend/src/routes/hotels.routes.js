const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const { validateHotel } = require('../validators/auth.validator');
const {
  creerHotel,
  getHotels,
  getHotelById,
  modifierHotel,
  supprimerHotel
} = require('../controllers/hotel.controller');

router.get('/', protect, getHotels);
router.get('/:id', protect, getHotelById);
router.post('/', protect, validateHotel, creerHotel);
router.put('/:id', protect, modifierHotel);
router.delete('/:id', protect, supprimerHotel);

module.exports = router;