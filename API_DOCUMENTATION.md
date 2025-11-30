# API Backend - Inmobiliaria

API REST simple para gestión inmobiliaria usando localStorage simulado (archivos JSON).

## 🚀 Características

- ✅ Autenticación simple sin tokens
- ✅ CRUD completo de propiedades
- ✅ Filtros avanzados de búsqueda
- ✅ Estadísticas del sistema
- ✅ Persistencia con localStorage (archivos JSON)

## 📡 Endpoints Disponibles

### Autenticación

#### POST `/api/auth/login`
Login de usuario.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "sessionId": "session_1234567890_0.123456",
  "user": {
    "id": 1,
    "username": "admin",
    "nombre": "Administrador",
    "email": "admin@inmobiliaria.com",
    "role": "admin"
  }
}
```

**Usuarios por defecto:**
- Usuario: `admin` / Password: `admin123` (Rol: admin)
- Usuario: `agente` / Password: `agente123` (Rol: agente)

#### POST `/api/auth/verify`
Verificar sesión activa.

**Body:**
```json
{
  "sessionId": "session_1234567890_0.123456"
}
```

#### POST `/api/auth/logout`
Cerrar sesión.

**Body:**
```json
{
  "sessionId": "session_1234567890_0.123456"
}
```

---

### Propiedades (Públicas)

#### GET `/api/propiedades`
Obtener todas las propiedades con filtros opcionales.

**Query Parameters:**
- `tipo`: casa | apartamento | terreno | local
- `precioMin`: número
- `precioMax`: número
- `ubicacion`: texto
- `habitaciones`: número
- `estado`: en venta | en alquiler | vendido | reservado

**Ejemplo:**
```
GET /api/propiedades?tipo=casa&precioMin=100000&precioMax=300000&habitaciones=3
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Casa moderna en zona residencial",
      "tipo": "casa",
      "precio": 250000,
      "ubicacion": "San José Centro",
      "habitaciones": 3,
      "banos": 2,
      "metrosCuadrados": 150,
      "estado": "en venta",
      "descripcion": "Hermosa casa moderna...",
      "imagenes": ["url1", "url2"],
      "caracteristicas": ["Jardín", "Estacionamiento"],
      "fechaCreacion": "2025-11-29T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### GET `/api/propiedades/:id`
Obtener una propiedad específica por ID.

**Ejemplo:**
```
GET /api/propiedades/1
```

#### GET `/api/propiedades/stats/all`
Obtener estadísticas generales.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "enVenta": 6,
    "enAlquiler": 3,
    "vendidas": 1,
    "reservadas": 0,
    "porTipo": {
      "casas": 4,
      "apartamentos": 3,
      "terrenos": 2,
      "locales": 1
    },
    "precioPromedio": 180000
  }
}
```

---

### Propiedades (Protegidas - Requieren Autenticación)

**Nota:** Para usar estas rutas, debes incluir el header:
```
x-session-id: session_1234567890_0.123456
```

#### POST `/api/propiedades`
Crear nueva propiedad.

**Headers:**
```
x-session-id: session_1234567890_0.123456
```

**Body:**
```json
{
  "titulo": "Casa nueva",
  "tipo": "casa",
  "precio": 200000,
  "ubicacion": "San José",
  "habitaciones": 3,
  "banos": 2,
  "metrosCuadrados": 120,
  "estado": "en venta",
  "descripcion": "Descripción de la propiedad",
  "imagenes": ["url1", "url2"],
  "caracteristicas": ["Jardín", "Garage"]
}
```

#### PUT `/api/propiedades/:id`
Actualizar propiedad existente.

**Headers:**
```
x-session-id: session_1234567890_0.123456
```

**Body:** (Solo envía los campos que quieres actualizar)
```json
{
  "precio": 220000,
  "estado": "vendido"
}
```

#### DELETE `/api/propiedades/:id`
Eliminar propiedad.

**Headers:**
```
x-session-id: session_1234567890_0.123456
```

---

## 🔧 Uso desde JavaScript

### Ejemplo: Login
```javascript
async function login() {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Guardar sessionId en localStorage del navegador
    localStorage.setItem('sessionId', data.sessionId);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}
```

### Ejemplo: Obtener propiedades con filtros
```javascript
async function getPropiedades() {
  const params = new URLSearchParams({
    tipo: 'casa',
    precioMin: 100000,
    precioMax: 300000,
    estado: 'en venta'
  });
  
  const response = await fetch(`http://localhost:3000/api/propiedades?${params}`);
  const data = await response.json();
  
  console.log(data.data); // Array de propiedades
}
```

### Ejemplo: Crear propiedad (requiere autenticación)
```javascript
async function crearPropiedad() {
  const sessionId = localStorage.getItem('sessionId');
  
  const response = await fetch('http://localhost:3000/api/propiedades', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionId
    },
    body: JSON.stringify({
      titulo: 'Casa nueva',
      tipo: 'casa',
      precio: 200000,
      ubicacion: 'San José',
      habitaciones: 3,
      banos: 2,
      metrosCuadrados: 120,
      estado: 'en venta',
      descripcion: 'Hermosa casa',
      imagenes: [],
      caracteristicas: ['Jardín']
    })
  });
  
  const data = await response.json();
  console.log(data);
}
```

### Ejemplo: Actualizar propiedad
```javascript
async function actualizarPropiedad(id) {
  const sessionId = localStorage.getItem('sessionId');
  
  const response = await fetch(`http://localhost:3000/api/propiedades/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionId
    },
    body: JSON.stringify({
      precio: 250000,
      estado: 'vendido'
    })
  });
  
  const data = await response.json();
  console.log(data);
}
```

### Ejemplo: Eliminar propiedad
```javascript
async function eliminarPropiedad(id) {
  const sessionId = localStorage.getItem('sessionId');
  
  const response = await fetch(`http://localhost:3000/api/propiedades/${id}`, {
    method: 'DELETE',
    headers: {
      'x-session-id': sessionId
    }
  });
  
  const data = await response.json();
  console.log(data);
}
```

---

## 📂 Estructura de Datos

### Propiedad
```javascript
{
  id: number,
  titulo: string,
  tipo: 'casa' | 'apartamento' | 'terreno' | 'local',
  precio: number,
  ubicacion: string,
  habitaciones: number,
  banos: number,
  metrosCuadrados: number,
  estado: 'en venta' | 'en alquiler' | 'vendido' | 'reservado',
  descripcion: string,
  imagenes: string[],
  caracteristicas: string[],
  fechaCreacion: string (ISO Date),
  fechaActualizacion?: string (ISO Date)
}
```

### Usuario
```javascript
{
  id: number,
  username: string,
  password: string,
  nombre: string,
  email: string,
  role: 'admin' | 'agente'
}
```

---

## 💾 Almacenamiento

Los datos se guardan en la carpeta `backend/storage/` como archivos JSON:
- `propiedades.json` - Lista de propiedades
- `users.json` - Lista de usuarios
- `sessions.json` - Sesiones activas

---

## 🛠️ Testing con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Obtener propiedades
curl http://localhost:3000/api/propiedades

# Obtener propiedades con filtros
curl "http://localhost:3000/api/propiedades?tipo=casa&precioMin=100000"

# Crear propiedad (reemplaza SESSION_ID)
curl -X POST http://localhost:3000/api/propiedades \
  -H "Content-Type: application/json" \
  -H "x-session-id: SESSION_ID" \
  -d '{"titulo":"Casa nueva","tipo":"casa","precio":200000,"ubicacion":"San José","habitaciones":3,"banos":2,"metrosCuadrados":120,"estado":"en venta"}'
```

---

## 🚀 Iniciar Servidor

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`
