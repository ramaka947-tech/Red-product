const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, updatePhoto, getStats, getAllUsers, activerCompte } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/update-photo', protect, updatePhoto);
router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/activer/:token', activerCompte);

module.exports = router;