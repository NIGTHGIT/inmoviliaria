const express = require('express');
const path = require('path');
const config = require('./backend/config/config');
const propiedadesRoutes = require('./backend/routes/propiedades');
const authRoutes = require('./backend/routes/auth');
const uploadRoutes = require('./backend/routes/upload');

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

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(config.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${config.PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'frontend')}`);
    console.log(`🌍 Modo: ${config.NODE_ENV}`);
});

module.exports = app;
