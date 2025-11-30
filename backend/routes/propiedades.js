const express = require('express');
const router = express.Router();
const propiedadesController = require('../controllers/propiedadesController');
const authController = require('../controllers/authController');

// Rutas públicas (sin autenticación)
// Obtener todas las propiedades con filtros
router.get('/', propiedadesController.getPropiedades);

// Obtener una propiedad por ID
router.get('/:id', propiedadesController.getPropiedadById);

// Obtener estadísticas (pública)
router.get('/stats/all', propiedadesController.getEstadisticas);

// Rutas protegidas (requieren autenticación)
// Crear una nueva propiedad
router.post('/', authController.requireAuth, propiedadesController.createPropiedad);

// Actualizar una propiedad
router.put('/:id', authController.requireAuth, propiedadesController.updatePropiedad);

// Eliminar una propiedad
router.delete('/:id', authController.requireAuth, propiedadesController.deletePropiedad);

module.exports = router;
