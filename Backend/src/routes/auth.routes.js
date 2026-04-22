const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword } = require('../controllers/userController');
const protect = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;