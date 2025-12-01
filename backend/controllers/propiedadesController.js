const localStorage = require('../utils/localStorage');

/**
 * Controlador de Propiedades
 * CRUD completo con filtros avanzados
 */

// Inicializar propiedades de ejemplo si no existen
function initializePropiedades() {
    let propiedades = localStorage.getItem('propiedades');
    if (!propiedades) {
        propiedades = [
            {
                id: 1,
                titulo: 'Casa moderna en zona residencial',
                tipo: 'casa',
                precio: 250000,
                ubicacion: 'San José Centro',
                habitaciones: 3,
                banos: 2,
                metrosCuadrados: 150,
                estado: 'en venta',
                descripcion: 'Hermosa casa moderna con acabados de lujo, amplio jardín y estacionamiento para 2 vehículos.',
                imagenes: [
                    'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
                ],
                caracteristicas: ['Jardín', 'Estacionamiento', 'Seguridad 24/7'],
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 2,
                titulo: 'Apartamento céntrico amueblado',
                tipo: 'apartamento',
                precio: 800,
                ubicacion: 'Centro Comercial',
                habitaciones: 2,
                banos: 1,
                metrosCuadrados: 75,
                estado: 'en alquiler',
                descripcion: 'Apartamento completamente amueblado, cerca de centros comerciales y transporte público.',
                imagenes: [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
                ],
                caracteristicas: ['Amueblado', 'Cerca transporte', 'Gym'],
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 3,
                titulo: 'Terreno para desarrollo',
                tipo: 'terreno',
                precio: 180000,
                ubicacion: 'Zona Industrial',
                habitaciones: 0,
                banos: 0,
                metrosCuadrados: 500,
                estado: 'en venta',
                descripcion: 'Terreno ideal para desarrollo comercial o industrial, con todos los servicios.',
                imagenes: [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
                ],
                caracteristicas: ['Servicios completos', 'Zona comercial'],
                fechaCreacion: new Date().toISOString()
            }
        ];
        localStorage.setItem('propiedades', propiedades);
    }
    return propiedades;
}

// Obtener todas las propiedades con filtros
exports.getPropiedades = (req, res) => {
    try {
        let propiedades = initializePropiedades();
        
        // Aplicar filtros
        const { tipo, precioMin, precioMax, ubicacion, habitaciones, estado } = req.query;
        
        if (tipo) {
            propiedades = propiedades.filter(p => p.tipo === tipo);
        }
        
        if (precioMin) {
            propiedades = propiedades.filter(p => p.precio >= parseFloat(precioMin));
        }
        
        if (precioMax) {
            propiedades = propiedades.filter(p => p.precio <= parseFloat(precioMax));
        }
        
        if (ubicacion) {
            propiedades = propiedades.filter(p => 
                p.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())
            );
        }
        
        if (habitaciones) {
            propiedades = propiedades.filter(p => p.habitaciones >= parseInt(habitaciones));
        }
        
        if (estado) {
            const norm = estado.toLowerCase().replace(/\s+/g, ' ');
            propiedades = propiedades.filter(p => (p.estado || '').toLowerCase() === norm);
        }
        
        res.json({
            success: true,
            data: propiedades,
            total: propiedades.length
        });
    } catch (error) {
        console.error('Error obteniendo propiedades:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Obtener una propiedad por ID
exports.getPropiedadById = (req, res) => {
    try {
        const { id } = req.params;
        const propiedades = initializePropiedades();
        const propiedad = propiedades.find(p => p.id === parseInt(id));
        
        if (!propiedad) {
            return res.status(404).json({
                success: false,
                message: 'Propiedad no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: propiedad
        });
    } catch (error) {
        console.error('Error obteniendo propiedad:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Crear nueva propiedad
exports.createPropiedad = (req, res) => {
    try {
        const propiedades = initializePropiedades();
        
        // Generar nuevo ID
        const newId = propiedades.length > 0 
            ? Math.max(...propiedades.map(p => p.id)) + 1 
            : 1;
        
        const nuevaPropiedad = {
            id: newId,
            titulo: req.body.titulo,
            tipo: req.body.tipo,
            precio: parseFloat(req.body.precio),
            ubicacion: req.body.ubicacion,
            habitaciones: parseInt(req.body.habitaciones) || 0,
            banos: parseInt(req.body.banos) || 0,
            parqueos: parseInt(req.body.parqueos) || 0,
            metrosCuadrados: parseFloat(req.body.metrosCuadrados),
            estado: req.body.estado || 'en venta',
            descripcion: req.body.descripcion || '',
            imagenes: req.body.imagenes || [],
            caracteristicas: req.body.caracteristicas || [],
            fechaCreacion: new Date().toISOString()
        };
        
        propiedades.push(nuevaPropiedad);
        localStorage.setItem('propiedades', propiedades);
        
        res.status(201).json({
            success: true,
            message: 'Propiedad creada exitosamente',
            data: nuevaPropiedad
        });
    } catch (error) {
        console.error('Error creando propiedad:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Actualizar propiedad
exports.updatePropiedad = (req, res) => {
    try {
        const { id } = req.params;
        let propiedades = initializePropiedades();
        const index = propiedades.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Propiedad no encontrada'
            });
        }
        
        // Actualizar solo los campos proporcionados
        const propiedadActualizada = {
            ...propiedades[index],
            ...req.body,
            id: parseInt(id), // Mantener el ID original
            fechaActualizacion: new Date().toISOString()
        };
        
        propiedades[index] = propiedadActualizada;
        localStorage.setItem('propiedades', propiedades);
        
        res.json({
            success: true,
            message: 'Propiedad actualizada exitosamente',
            data: propiedadActualizada
        });
    } catch (error) {
        console.error('Error actualizando propiedad:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Eliminar propiedad
exports.deletePropiedad = (req, res) => {
    try {
        const { id } = req.params;
        let propiedades = initializePropiedades();
        const index = propiedades.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Propiedad no encontrada'
            });
        }
        
        propiedades.splice(index, 1);
        localStorage.setItem('propiedades', propiedades);
        
        res.json({
            success: true,
            message: 'Propiedad eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando propiedad:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Obtener estadísticas
exports.getEstadisticas = (req, res) => {
    try {
        const propiedades = initializePropiedades();
        
        const estadisticas = {
            total: propiedades.length,
            enVenta: propiedades.filter(p => p.estado === 'en venta').length,
            enAlquiler: propiedades.filter(p => p.estado === 'en alquiler').length,
            vendidas: propiedades.filter(p => p.estado === 'vendido').length,
            reservadas: propiedades.filter(p => p.estado === 'reservado').length,
            porTipo: {
                casas: propiedades.filter(p => p.tipo === 'casa').length,
                apartamentos: propiedades.filter(p => p.tipo === 'apartamento').length,
                terrenos: propiedades.filter(p => p.tipo === 'terreno').length,
                locales: propiedades.filter(p => p.tipo === 'local').length
            },
            precioPromedio: propiedades.reduce((sum, p) => sum + p.precio, 0) / propiedades.length
        };
        
        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
