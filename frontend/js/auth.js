// Configuración de la API
const API_URL = 'http://localhost:3000/api';

/**
 * Obtener el sessionId del localStorage
 */
function getSessionId() {
    return localStorage.getItem('sessionId');
}

/**
 * Obtener información del usuario
 */
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Login de usuario
 */
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Guardar sesión en localStorage
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Verificar sesión
 */
async function verifySession() {
    const sessionId = getSessionId();
    
    if (!sessionId) {
        return { success: false };
    }

    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });

        const data = await response.json();
        
        if (data.success) {
            // Actualizar información del usuario
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            // Sesión inválida, limpiar localStorage
            clearSession();
            return { success: false };
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
        return { success: false };
    }
}

/**
 * Logout
 */
async function logout() {
    const sessionId = getSessionId();
    
    if (sessionId) {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId })
            });
        } catch (error) {
            console.error('Error en logout:', error);
        }
    }
    
    clearSession();
    window.location.href = '/login';
}

/**
 * Limpiar sesión del localStorage
 */
function clearSession() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
}

/**
 * Verificar autenticación (redirigir si no está autenticado)
 */
async function checkAuth() {
    const result = await verifySession();
    
    if (!result.success) {
        window.location.href = '/login';
        return false;
    }
    
    // Actualizar UI con información del usuario
    updateUserUI(result.user);
    return true;
}

/**
 * Actualizar UI con información del usuario
 */
function updateUserUI(user) {
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    
    if (userNameEl) {
        userNameEl.textContent = user.nombre;
    }
    
    if (userRoleEl) {
        userRoleEl.textContent = user.role === 'admin' ? 'Administrador' : 'Agente Inmobiliario';
    }
}

/**
 * Manejo del formulario de login
 */
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');
        
        // Deshabilitar botón
        loginBtn.disabled = true;
        loginBtn.textContent = 'Iniciando sesión...';
        errorMessage.style.display = 'none';
        
        const result = await login(username, password);
        
        if (result.success) {
            // Redirigir al dashboard
            window.location.href = '/admin';
        } else {
            // Mostrar error
            errorMessage.textContent = result.message || 'Error al iniciar sesión';
            errorMessage.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesión';
        }
    });
}

/**
 * Verificar si está en página de login y ya está autenticado
 */
if (window.location.pathname === '/login') {
    verifySession().then(result => {
        if (result.success) {
            // Ya está autenticado, redirigir al dashboard
            window.location.href = '/admin';
        }
    });
}
