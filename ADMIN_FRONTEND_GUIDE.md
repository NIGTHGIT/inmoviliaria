# Panel de Administración - Frontend

## 🎨 Archivos Creados

### Páginas HTML/PHP
- **`login.php`** - Página de inicio de sesión
- **`admin.php`** - Dashboard principal con estadísticas
- **`admin-propiedades.php`** - Gestión CRUD de propiedades

### JavaScript
- **`js/auth.js`** - Manejo de autenticación (login, logout, verificación)
- **`js/admin.js`** - Operaciones CRUD y funciones del dashboard

### Estilos
- **`css/admin.css`** - Estilos completos para el panel de administración

---

## 🚀 Cómo Usar

### 1. Iniciar el Servidor

```bash
npm start
```

El servidor estará en: `http://localhost:3000`

### 2. Acceder al Panel de Administración

**URL de Login:** `http://localhost:3000/login`

**Credenciales:**
- **Admin:** usuario `admin` / contraseña `admin123`
- **Agente:** usuario `agente` / contraseña `agente123`

### 3. Navegación

Después de iniciar sesión, tendrás acceso a:

- **Dashboard** (`/admin`) - Estadísticas y resumen general
- **Gestión de Propiedades** (`/admin/propiedades`) - CRUD completo

---

## 📊 Funcionalidades Implementadas

### ✅ Sistema de Autenticación
- Login con usuario y contraseña
- Sesión almacenada en localStorage del navegador
- Verificación automática de sesión
- Protección de rutas (redirección si no está autenticado)
- Logout

### ✅ Dashboard
- **Tarjetas de Estadísticas:**
  - Total de propiedades
  - Propiedades en venta
  - Propiedades en alquiler
  - Propiedades vendidas

- **Gráficos de Barras:**
  - Distribución por tipo (casas, apartamentos, terrenos, locales)
  - Actualización en tiempo real

- **Información General:**
  - Precio promedio
  - Propiedades reservadas
  - Última actualización

### ✅ Gestión de Propiedades

#### **Listar Propiedades**
- Tabla con todas las propiedades
- Información: ID, Título, Tipo, Precio, Ubicación, Estado
- Badges de colores para tipos y estados

#### **Filtros Avanzados**
- Por tipo (casa, apartamento, terreno, local)
- Por estado (en venta, alquiler, vendido, reservado)
- Por ubicación (búsqueda de texto)
- Botón para limpiar filtros

#### **Crear Propiedad**
Modal con formulario completo:
- Título *
- Tipo * (casa, apartamento, terreno, local)
- Estado * (en venta, alquiler, vendido, reservado)
- Precio *
- Metros cuadrados *
- Habitaciones
- Baños
- Ubicación *
- Descripción
- URLs de imágenes (una por línea)
- Características (separadas por coma)

#### **Editar Propiedad**
- Click en botón ✏️ para editar
- Se llena automáticamente el formulario
- Guarda cambios con el mismo modal

#### **Eliminar Propiedad**
- Click en botón 🗑️
- Confirmación antes de eliminar

---

## 🎨 Diseño

### Características del Diseño
- **Responsive:** Se adapta a móviles, tablets y desktop
- **Sidebar Fijo:** Navegación lateral siempre visible
- **Colores Modernos:** Esquema azul profesional
- **Animaciones Suaves:** Transiciones en hover y clicks
- **Badges de Color:** Estados visuales para tipos y estados

### Paleta de Colores
- Primario: `#2563eb` (azul)
- Éxito: `#10b981` (verde)
- Peligro: `#ef4444` (rojo)
- Advertencia: `#f59e0b` (naranja)
- Sidebar: `#1e293b` (gris oscuro)

---

## 📱 Responsive

### Desktop (>768px)
- Sidebar de 260px
- Tabla completa visible
- Grid de 4 columnas en estadísticas

### Tablet (481px - 768px)
- Sidebar de 200px
- Grid adaptativo
- Tabla con scroll horizontal

### Mobile (<480px)
- Sidebar colapsado (solo iconos, 60px)
- Estadísticas en columna única
- Filtros apilados verticalmente

---

## 🔐 Seguridad

### Frontend
- Verificación de sesión en cada página protegida
- Redirección automática al login si no está autenticado
- Almacenamiento seguro del sessionId en localStorage

### Backend
- Middleware `requireAuth` protege rutas de creación/edición/eliminación
- Validación del sessionId en cada petición protegida
- Sistema de sesiones simple sin tokens JWT (ideal para proyectos académicos)

---

## 📝 Estructura de Datos

### Usuario en localStorage
```javascript
{
  "id": 1,
  "username": "admin",
  "nombre": "Administrador",
  "email": "admin@inmobiliaria.com",
  "role": "admin"
}
```

### Propiedad
```javascript
{
  "id": 1,
  "titulo": "Casa moderna",
  "tipo": "casa",
  "precio": 250000,
  "ubicacion": "San José",
  "habitaciones": 3,
  "banos": 2,
  "metrosCuadrados": 150,
  "estado": "en venta",
  "descripcion": "Hermosa casa...",
  "imagenes": ["url1", "url2"],
  "caracteristicas": ["Jardín", "Estacionamiento"],
  "fechaCreacion": "2025-11-29T00:00:00.000Z"
}
```

---

## 🛠️ API Utilizada

El frontend consume la API REST del backend:

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verificar sesión
- `POST /api/auth/logout` - Logout

### Propiedades (Públicas)
- `GET /api/propiedades` - Listar con filtros
- `GET /api/propiedades/:id` - Ver detalle
- `GET /api/propiedades/stats/all` - Estadísticas

### Propiedades (Protegidas)
- `POST /api/propiedades` - Crear
- `PUT /api/propiedades/:id` - Actualizar
- `DELETE /api/propiedades/:id` - Eliminar

**Nota:** Las rutas protegidas requieren el header:
```
x-session-id: <sessionId>
```

---

## 🎯 Flujo de Trabajo

### 1. Login
```
Usuario ingresa credenciales → 
POST /api/auth/login → 
Guardar sessionId y user en localStorage → 
Redirigir a /admin
```

### 2. Ver Dashboard
```
Cargar /admin → 
Verificar sesión → 
Cargar estadísticas (GET /api/propiedades/stats/all) → 
Mostrar gráficos y números
```

### 3. Gestionar Propiedades
```
Cargar /admin/propiedades → 
Verificar sesión → 
Cargar propiedades (GET /api/propiedades) → 
Aplicar filtros si existen → 
Mostrar tabla
```

### 4. Crear Propiedad
```
Click en "Nueva Propiedad" → 
Mostrar modal → 
Llenar formulario → 
POST /api/propiedades (con header x-session-id) → 
Recargar tabla
```

### 5. Editar Propiedad
```
Click en botón editar (✏️) → 
GET /api/propiedades/:id → 
Llenar formulario en modal → 
PUT /api/propiedades/:id (con header x-session-id) → 
Recargar tabla
```

### 6. Eliminar Propiedad
```
Click en botón eliminar (🗑️) → 
Confirmar → 
DELETE /api/propiedades/:id (con header x-session-id) → 
Recargar tabla
```

---

## 🐛 Troubleshooting

### "No autenticado" después de login
- Verificar que `localStorage` tenga `sessionId` y `user`
- Abrir DevTools → Application → Local Storage
- Verificar que el servidor backend esté corriendo

### No se cargan las propiedades
- Verificar URL de API en `js/auth.js` y `js/admin.js`
- Por defecto es `http://localhost:3000/api`
- Verificar en DevTools → Network las peticiones

### Errores CORS
- El servidor Express debe tener CORS configurado
- Si hay problemas, agregar en `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

### Modal no se cierra
- Click fuera del modal para cerrarlo
- Click en X
- Click en "Cancelar"

---

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `css/admin.css`:

```css
:root {
    --admin-primary: #2563eb;  /* Color principal */
    --admin-sidebar: #1e293b;  /* Color sidebar */
    --admin-success: #10b981;  /* Color éxito */
    --admin-danger: #ef4444;   /* Color peligro */
}
```

### Cambiar Logo
En el sidebar, edita `sidebar-header` en cada página:

```html
<div class="sidebar-header">
    <h2>🏢 Tu Nombre</h2>
</div>
```

### Agregar Más Campos
1. Agrega el campo en el formulario (`admin-propiedades.php`)
2. Actualiza la función de envío en `js/admin.js`
3. Actualiza el backend para aceptar el nuevo campo

---

## ✨ Características Adicionales

### Ya implementadas:
✅ Login/Logout
✅ Dashboard con estadísticas
✅ CRUD completo de propiedades
✅ Filtros avanzados
✅ Diseño responsive
✅ Animaciones suaves

### Puedes agregar:
- Sistema de favoritos
- Modo oscuro
- Comparador de propiedades
- Exportar a PDF/Excel
- Subida de imágenes (actualmente solo URLs)
- Gestión de usuarios
- Notificaciones

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que el servidor backend esté corriendo
2. Verifica la consola del navegador (F12)
3. Verifica la consola del servidor
4. Revisa `API_DOCUMENTATION.md` para detalles de la API

¡El panel de administración está listo para usar! 🚀
