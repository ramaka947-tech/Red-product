const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, updatePhoto, getStats, getAllUsers } = require('../controllers/userController');
const protect = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/update-photo', protect, updatePhoto);
router.get('/stats', protect, getStats);
router.get('/users', protect, getAllUsers);

module.exports = router;