const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
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

// Middleware para ejecutar archivos PHP
function servePHP(phpFile) {
    return (req, res) => {
        const filePath = path.join(__dirname, 'frontend', phpFile);
        const php = spawn('php', [filePath]);
        
        let output = '';
        let errorOutput = '';
        
        php.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        php.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        php.on('close', (code) => {
            if (code !== 0) {
                console.error('PHP Error:', errorOutput);
                res.status(500).send('Error al procesar la página');
            } else {
                res.send(output);
            }
        });
    };
}

// Rutas para servir las páginas PHP
app.get('/', servePHP('index.php'));
app.get('/propiedades', servePHP('propiedades.php'));
app.get('/servicios', servePHP('servicios.php'));
app.get('/nosotros', servePHP('nosotros.php'));
app.get('/contacto', servePHP('contacto.php'));

// Rutas del panel de administración
app.get('/login', servePHP('login.php'));
app.get('/admin', servePHP('admin.php'));
app.get('/admin/propiedades', servePHP('admin-propiedades.php'));

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
