const express = require('express');
const router = express.Router();

// Obtener todas las propiedades
router.get('/', (req, res) => {
    res.json({
        message: 'Lista de propiedades',
        propiedades: []
    });
});

// Obtener una propiedad por ID
router.get('/:id', (req, res) => {
    res.json({
        message: `Propiedad con ID ${req.params.id}`,
        propiedad: {}
    });
});

// Crear una nueva propiedad
router.post('/', (req, res) => {
    res.json({
        message: 'Propiedad creada',
        propiedad: req.body
    });
});

module.exports = router;
