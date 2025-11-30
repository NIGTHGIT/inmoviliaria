const localStorage = require('../utils/localStorage');

/**
 * Controlador de Autenticación
 * Sistema simple sin tokens
 */

// Inicializar usuarios por defecto si no existen
function initializeUsers() {
    let users = localStorage.getItem('users');
    if (!users) {
        users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                nombre: 'Administrador',
                email: 'admin@inmobiliaria.com',
                role: 'admin'
            },
        ];
        localStorage.setItem('users', users);
    }
    return users;
}

// Login simple
exports.login = (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        const users = initializeUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Crear sesión simple
        const sessionId = `session_${Date.now()}_${Math.random()}`;
        let sessions = localStorage.getItem('sessions') || {};
        sessions[sessionId] = {
            userId: user.id,
            username: user.username,
            nombre: user.nombre,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('sessions', sessions);

        res.json({
            success: true,
            message: 'Login exitoso',
            sessionId,
            user: {
                id: user.id,
                username: user.username,
                nombre: user.nombre,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Verificar sesión
exports.verifySession = (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID requerido'
            });
        }

        const sessions = localStorage.getItem('sessions') || {};
        const session = sessions[sessionId];

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Sesión inválida o expirada'
            });
        }

        res.json({
            success: true,
            user: session
        });
    } catch (error) {
        console.error('Error verificando sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Logout
exports.logout = (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID requerido'
            });
        }

        let sessions = localStorage.getItem('sessions') || {};
        delete sessions[sessionId];
        localStorage.setItem('sessions', sessions);

        res.json({
            success: true,
            message: 'Logout exitoso'
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Middleware para verificar autenticación
exports.requireAuth = (req, res, next) => {
    try {
        const sessionId = req.headers['x-session-id'];

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        const sessions = localStorage.getItem('sessions') || {};
        const session = sessions[sessionId];

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Sesión inválida o expirada'
            });
        }

        req.user = session;
        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
