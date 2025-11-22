const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const config = require('./backend/config/config');
const propiedadesRoutes = require('./backend/routes/propiedades');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'frontend'), {
    extensions: ['html', 'htm']
}));

// Rutas de la API
app.use('/api/propiedades', propiedadesRoutes);

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
