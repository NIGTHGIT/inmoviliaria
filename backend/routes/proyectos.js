const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const authController = require('../controllers/authController');

// Públicas
router.get('/', proyectosController.getProyectos);
router.get('/:id', proyectosController.getProyectoById);

// Protegidas
router.post('/', authController.requireAuth, proyectosController.createProyecto);
router.put('/:id', authController.requireAuth, proyectosController.updateProyecto);
router.delete('/:id', authController.requireAuth, proyectosController.deleteProyecto);

module.exports = router;

