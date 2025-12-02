const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./backend/config/config');
const propiedadesRoutes = require('./backend/routes/propiedades');
const proyectosRoutes = require('./backend/routes/proyectos');
const authRoutes = require('./backend/routes/auth');
const uploadRoutes = require('./backend/routes/upload');
const localStorage = require('./backend/utils/localStorage');

const app = express();

// Middleware - Aumentar límite para subida de imágenes en base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del frontend (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'frontend'), {
    extensions: ['html', 'htm']
}));

// Servir archivos subidos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'backend/storage/uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/propiedades', propiedadesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/proyectos', proyectosRoutes);

// Rutas para servir las páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/propiedades', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'propiedades.html'));
});

app.get('/servicios', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'servicios.html'));
});

app.get('/nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'nosotros.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'contacto.html'));
});

app.get('/proyectos', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'proyectos.html'));
});

// Rutas del panel de administración
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

app.get('/admin/propiedades', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin-propiedades.html'));
});

app.get('/admin/proyectos', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin-proyectos.html'));
});

// Rutas alternativas por si el navegador solicita variaciones
app.get('/admin-proyectos', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin-proyectos.html'));
});
app.get('/admin/proyectos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin-proyectos.html'));
});

// Fallback genérico: mapear rutas sin extensión a archivos "<ruta>.html" o "<ruta-reemplazada>.html"
app.get('*', (req, res, next) => {
    const raw = (req.path || '').replace(/^\/+|\/+$/g, '');
    if (!raw) return next();
    // Intento 1: ruta.html en raíz frontend
    const candidate1 = path.join(__dirname, 'frontend', `${raw}.html`);
    if (fs.existsSync(candidate1)) {
        return res.sendFile(candidate1);
    }
    // Intento 2: reemplazar "/" por "-" (ej.: /admin/proyectos -> admin-proyectos.html)
    const replaced = raw.replace(/\//g, '-');
    const candidate2 = path.join(__dirname, 'frontend', `${replaced}.html`);
    if (fs.existsSync(candidate2)) {
        return res.sendFile(candidate2);
    }
    next();
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(config.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${config.PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'frontend')}`);
    console.log(`🌍 Modo: ${config.NODE_ENV}`);

    try {
        const alreadySeeded = !!localStorage.getItem('seed50_done');
        if (!alreadySeeded) {
            const existing = localStorage.getItem('propiedades') || [];
            const maxId = existing.length ? Math.max(...existing.map(p => p.id || 0)) : 0;

            const cities = [
                'Santo Domingo', 'Santiago', 'San Cristóbal', 'San Francisco de Macorís',
                'La Romana', 'La Vega', 'Higüey', 'Bávaro', 'Puerto Plata', 'Baní',
                'Bonao', 'Moca', 'Nagua', 'Samaná', 'Jarabacoa', 'Constanza'
            ];
            const aptImages = [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'https://images.unsplash.com/photo-1598928506311-8f0c4b92fbc7?w=800'
            ];
            const houseImages = [
                'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800',
                'https://images.unsplash.com/photo-1560185008-b033106af212?w=800',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
            ];

            const now = new Date().toISOString();
            const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

            const newProps = [];
            for (let i = 1; i <= 50; i++) {
                const type = i % 2 === 0 ? 'casa' : 'apartamento';
                const city = cities[i % cities.length];
                const price = randomBetween(60000, 500000);
                const rooms = randomBetween(1, 4);
                const baths = Math.min(rooms, randomBetween(1, 3));
                const m2 = type === 'apartamento' ? randomBetween(60, 140) : randomBetween(120, 280);
                const parqueos = randomBetween(1, 2);
                const imgs = type === 'apartamento' ? aptImages : houseImages;

                newProps.push({
                    id: maxId + i,
                    titulo: type === 'apartamento' ? `Apartamento en ${city}` : `Casa en ${city}`,
                    tipo: type,
                    precio: price,
                    ubicacion: city,
                    habitaciones: rooms,
                    banos: baths,
                    metrosCuadrados: m2,
                    estado: 'en venta',
                    descripcion: `Hermosa ${type} en ${city} con excelente ubicación y acabados.`,
                    imagenes: imgs,
                    caracteristicas: type === 'apartamento'
                        ? ['Balcón', 'Seguridad 24/7', 'Parqueo']
                        : ['Jardín', 'Terraza', 'Cochera'],
                    fechaCreacion: now,
                    parqueos,
                    fechaActualizacion: now
                });
            }

            const merged = existing.concat(newProps);
            localStorage.setItem('propiedades', merged);
            localStorage.setItem('seed50_done', true);
            console.log(`🧪 Seed: agregadas ${newProps.length} propiedades (casas y apartamentos, ≤ US$500,000).`);
        }
    } catch (e) {
        console.error('Error en seed de propiedades:', e);
    }
});

module.exports = app;
