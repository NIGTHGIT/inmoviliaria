const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de login
router.post('/login', authController.login);

// Ruta de verificación de sesión
router.post('/verify', authController.verifySession);

// Ruta de logout
router.post('/logout', authController.logout);

module.exports = router;
