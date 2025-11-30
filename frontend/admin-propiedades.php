<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Propiedades - Admin</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <div class="logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Inmobiliaria</span>
            </div>
            
            <nav class="sidebar-nav">
                <a href="/admin" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Dashboard</span>
                </a>
                <a href="/admin/propiedades" class="nav-item active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Propiedades</span>
                </a>
                <a href="/" class="nav-item" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>Ver Sitio</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="user-details">
                        <span class="user-name">Administrador</span>
                        <span class="user-email">admin@inmobiliaria.com</span>
                    </div>
                </div>
                <button onclick="logout()" class="logout-btn" title="Cerrar Sesión">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Header -->
            <header class="admin-header">
                <div class="header-content">
                    <div class="header-left">
                        <h1>Gestión de Propiedades</h1>
                        <p class="header-subtitle">Administra y controla todas las propiedades del sistema</p>
                    </div>
                    <div class="header-actions">
                        <button onclick="showCreateModal()" class="btn-primary btn-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Nueva Propiedad
                        </button>
                        <button onclick="loadPropiedades()" class="btn-secondary btn-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <div class="content-area">
                <!-- Filtros -->
                <div class="filters-card">
                    <h3>Filtros de Búsqueda</h3>
                    <div class="filters-row">
                        <div class="form-group">
                            <label for="filterTipo">Tipo</label>
                            <select id="filterTipo" onchange="loadPropiedades()">
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="terreno">Terreno</option>
                                <option value="local">Local Comercial</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filterEstado">Estado</label>
                            <select id="filterEstado" onchange="loadPropiedades()">
                                <option value="">Todos</option>
                                <option value="en venta">En Venta</option>
                                <option value="en alquiler">En Alquiler</option>
                                <option value="vendido">Vendido</option>
                                <option value="reservado">Reservado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filterUbicacion">Ubicación</label>
                            <input type="text" id="filterUbicacion" placeholder="Buscar por ubicación">
                        </div>
                        <div class="form-group">
                            <button onclick="loadPropiedades()" class="btn-primary">Buscar</button>
                            <button onclick="clearFilters()" class="btn-secondary">Limpiar</button>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Ubicación</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="propiedadesTableBody">
                            <tr>
                                <td colspan="7" class="loading">Cargando propiedades...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Vista móvil de tarjetas -->
                <div class="table-mobile-view" id="propiedadesMobile"></div>
            </div>
        </main>
    </div>

    <!-- Modal: Agregar/Editar Propiedad -->
    <div id="propiedadModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Agregar Nueva Propiedad</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            
            <form id="propiedadForm" class="modal-form">
                <input type="hidden" id="propiedadId" name="propiedadId">
                <div class="form-row">
                    <div class="form-group">
                        <label for="titulo">Título *</label>
                        <input type="text" id="titulo" name="titulo" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="tipo">Tipo *</label>
                        <select id="tipo" name="tipo" required>
                            <option value="">Seleccionar...</option>
                            <option value="casa">Casa</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="terreno">Terreno</option>
                            <option value="local">Local Comercial</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="ubicacion">Ubicación *</label>
                        <input type="text" id="ubicacion" name="ubicacion" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="precio">Precio (USD) *</label>
                        <input type="number" id="precio" name="precio" required min="0" step="0.01">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="metrosCuadrados">Metros Cuadrados *</label>
                        <input type="number" id="metrosCuadrados" name="metrosCuadrados" required min="1" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label for="habitaciones">Habitaciones</label>
                        <input type="number" id="habitaciones" name="habitaciones" min="0" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="banos">Baños</label>
                        <input type="number" id="banos" name="banos" min="0" value="0">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" rows="4" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="estado">Estado *</label>
                    <select id="estado" name="estado" required>
                        <option value="en venta">En Venta</option>
                        <option value="en alquiler">En Alquiler</option>
                        <option value="vendido">Vendido</option>
                        <option value="reservado">Reservado</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="imageFiles">Subir Imágenes (máx. 10, 5MB cada una)</label>
                    <input type="file" id="imageFiles" name="imageFiles" accept="image/*" multiple>
                    <small class="form-help">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Seleccione hasta 10 imágenes (máximo 5MB cada una)
                    </small>
                    <div id="imagePreview" class="image-preview"></div>
                </div>
                
                <div class="form-group">
                    <label for="imagenes">O URLs de Imágenes (una por línea)</label>
                    <textarea id="imagenes" name="imagenes" rows="3" placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"></textarea>
                    <small class="form-help">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Ingrese una URL por línea
                    </small>
                </div>
                
                <div class="form-group">
                    <label for="caracteristicas">Características (separadas por coma)</label>
                    <textarea id="caracteristicas" name="caracteristicas" rows="2" placeholder="Jardín, Estacionamiento, Seguridad 24/7"></textarea>
                    <small class="form-help">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Separe cada característica con una coma
                    </small>
                </div>
                
                <div class="modal-actions">
                    <button type="button" onclick="closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" id="submitBtn" class="btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal: Ver Detalles -->
    <div id="viewModal" class="modal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2 id="viewTitulo">Detalles de la Propiedad</h2>
                <button class="close-btn" onclick="closeViewModal()">&times;</button>
            </div>
            
            <div class="view-content">
                <!-- Carrusel de Imágenes -->
                <div id="viewCarousel" class="view-carousel"></div>
                
                <!-- Información Principal -->
                <div class="property-details">
                    <!-- Grid de Información Básica -->
                    <div class="view-info-grid">
                        <div class="view-info-item">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                </svg>
                                Tipo
                            </span>
                            <span id="viewTipo" class="view-value"></span>
                        </div>
                        
                        <div class="view-info-item">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                Ubicación
                            </span>
                            <span id="viewUbicacion" class="view-value"></span>
                        </div>
                        
                        <div class="view-info-item view-price">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="1" x2="12" y2="23"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                                Precio
                            </span>
                            <span id="viewPrecio" class="view-value"></span>
                        </div>
                        
                        <div class="view-info-item">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                </svg>
                                Metros²
                            </span>
                            <span id="viewMetros" class="view-value"></span>
                        </div>
                        
                        <div class="view-info-item">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                Habitaciones
                            </span>
                            <span id="viewHabitaciones" class="view-value"></span>
                        </div>
                        
                        <div class="view-info-item">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1 0l-1 1a1.5 1.5 0 0 0 0 1L7 9"/>
                                    <path d="M15 6 17.5 3.5a1.5 1.5 0 0 0 1 0l1 1a1.5 1.5 0 0 0 0 1L17 9"/>
                                    <rect x="6" y="14" width="12" height="8" rx="2"/>
                                </svg>
                                Baños
                            </span>
                            <span id="viewBanos" class="view-value"></span>
                        </div>
                        
                        <div class="view-info-item">
                            <span class="view-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                Estado
                            </span>
                            <span id="viewEstado" class="view-value"></span>
                        </div>
                    </div>
                    
                    <!-- Descripción -->
                    <div class="view-section">
                        <h3>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Descripción
                        </h3>
                        <p id="viewDescripcion" class="view-description"></p>
                    </div>
                    
                    <!-- Características -->
                    <div class="view-section">
                        <h3>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                            Características
                        </h3>
                        <ul id="viewCaracteristicas" class="view-caracteristicas"></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay para mobile menu -->
    <div class="mobile-overlay" id="mobileOverlay"></div>

    <script src="../js/auth.js"></script>
    <script src="../js/admin.js"></script>
</body>
</html>