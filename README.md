# Inmobiliaria - Aplicación Web

Aplicación web para gestión de propiedades inmobiliarias, desarrollada con Node.js y Express.

## 📁 Estructura del Proyecto

```
inmoviliaria/
├── backend/
│   ├── config/
│   │   └── config.js          # Configuración del servidor
│   └── routes/
│       └── propiedades.js     # Rutas API para propiedades
├── frontend/
│   ├── css/
│   │   └── styles.css         # Estilos de la aplicación
│   ├── js/
│   │   └── app.js             # Lógica del cliente
│   └── index.html             # Página principal
├── server.js                   # Servidor Express
├── package.json               # Dependencias del proyecto
└── .gitignore                 # Archivos ignorados por Git
```

## 🚀 Instalación

1. Instalar las dependencias:
```bash
npm install
```

## ▶️ Ejecución

Para ejecutar en modo desarrollo:
```bash
npm run dev
```

Para ejecutar en modo producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **HTML5/CSS3** - Frontend
- **JavaScript** - Lógica del cliente

## 📋 Características

- ✅ Servidor Express configurado
- ✅ Servir archivos estáticos del frontend
- ✅ API REST para propiedades
- ✅ Interfaz de usuario responsive
- ✅ Diseño moderno y atractivo

## 🔧 Configuración

El servidor se configura en `backend/config/config.js`. Por defecto:
- Puerto: 3000
- Entorno: development
