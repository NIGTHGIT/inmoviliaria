const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authController = require('../controllers/authController');

// Rutas (todas protegidas con autenticación)
router.post('/single', authController.requireAuth, uploadController.uploadImage);
router.post('/multiple', authController.requireAuth, uploadController.uploadMultipleImages);
router.delete('/:filename', authController.requireAuth, uploadController.deleteImage);

module.exports = router;
