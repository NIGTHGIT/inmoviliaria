/**
 * Obtener headers con autenticación
 */
function getAuthHeaders() {
    const sessionId = localStorage.getItem('sessionId');
    return {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
    };
}

/**
 * Formatear precio
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// ============================================
// FUNCIONES PARA DASHBOARD
// ============================================

/**
 * Cargar estadísticas del dashboard
 */
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/propiedades/stats/all`);
        const data = await response.json();
        
        if (data.success) {
            const stats = data.data;
            
            // Actualizar tarjetas de estadísticas
            document.getElementById('totalPropiedades').textContent = stats.total;
            document.getElementById('enVenta').textContent = stats.enVenta;
            document.getElementById('enAlquiler').textContent = stats.enAlquiler;
            document.getElementById('vendidas').textContent = stats.vendidas;
            document.getElementById('reservadas').textContent = stats.reservadas;
            document.getElementById('precioPromedio').textContent = formatPrice(stats.precioPromedio);
            
            // Actualizar gráficos
            updateCharts(stats.porTipo);
            
            // Actualizar hora
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('es-ES');
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

/**
 * Actualizar gráficos de barras
 */
function updateCharts(porTipo) {
    const total = porTipo.casas + porTipo.apartamentos + porTipo.terrenos + porTipo.locales;
    
    if (total === 0) return;
    
    // Casas
    const casasPercent = (porTipo.casas / total) * 100;
    document.getElementById('chartCasas').style.width = casasPercent + '%';
    document.getElementById('countCasas').textContent = porTipo.casas;
    
    // Apartamentos
    const apartamentosPercent = (porTipo.apartamentos / total) * 100;
    document.getElementById('chartApartamentos').style.width = apartamentosPercent + '%';
    document.getElementById('countApartamentos').textContent = porTipo.apartamentos;
    
    // Terrenos
    const terrenosPercent = (porTipo.terrenos / total) * 100;
    document.getElementById('chartTerrenos').style.width = terrenosPercent + '%';
    document.getElementById('countTerrenos').textContent = porTipo.terrenos;
    
    // Locales
    const localesPercent = (porTipo.locales / total) * 100;
    document.getElementById('chartLocales').style.width = localesPercent + '%';
    document.getElementById('countLocales').textContent = porTipo.locales;
}

// ============================================
// FUNCIONES PARA GESTIÓN DE PROPIEDADES
// ============================================

/**
 * Cargar propiedades con filtros
 */
async function loadPropiedades() {
    const tableBody = document.getElementById('propiedadesTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="7" class="loading">Cargando propiedades...</td></tr>';
    
    try {
        // Obtener filtros
        const tipo = document.getElementById('filterTipo')?.value || '';
        const estado = document.getElementById('filterEstado')?.value || '';
        const ubicacion = document.getElementById('filterUbicacion')?.value || '';
        
        // Construir URL con filtros
        const params = new URLSearchParams();
        if (tipo) params.append('tipo', tipo);
        if (estado) params.append('estado', estado);
        if (ubicacion) params.append('ubicacion', ubicacion);
        
        const response = await fetch(`${API_URL}/propiedades?${params}`);
        const data = await response.json();
        
        if (data.success) {
            if (data.data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No se encontraron propiedades</td></tr>';
                return;
            }
            
            tableBody.innerHTML = data.data.map(prop => `
                <tr>
                    <td>${prop.id}</td>
                    <td>${prop.titulo}</td>
                    <td><span class="badge badge-${prop.tipo}">${capitalizeFirst(prop.tipo)}</span></td>
                    <td>${formatPrice(prop.precio)}</td>
                    <td>${prop.ubicacion}</td>
                    <td><span class="badge badge-estado-${prop.estado.replace(' ', '-')}">${capitalizeFirst(prop.estado)}</span></td>
                    <td class="actions">
                        <button class="btn-icon btn-view" onclick="viewPropiedad(${prop.id})" title="Ver Detalles">
                            👁️
                        </button>
                        <button class="btn-icon btn-edit" onclick="editPropiedad(${prop.id})" title="Editar">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" onclick="deletePropiedad(${prop.id})" title="Eliminar">
                            🗑️
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error cargando propiedades:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="error">Error al cargar propiedades</td></tr>';
    }
}

/**
 * Capitalizar primera letra
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Limpiar filtros
 */
function clearFilters() {
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterEstado').value = '';
    document.getElementById('filterUbicacion').value = '';
    loadPropiedades();
}

/**
 * Mostrar modal para crear propiedad
 */
function showCreateModal() {
    document.getElementById('modalTitle').textContent = 'Nueva Propiedad';
    document.getElementById('propiedadForm').reset();
    document.getElementById('propiedadId').value = '';
    document.getElementById('propiedadModal').style.display = 'flex';
}

/**
 * Ver detalles de la propiedad
 */
async function viewPropiedad(id) {
    try {
        const response = await fetch(`${API_URL}/propiedades/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const prop = data.data;
            showViewModal(prop);
        }
    } catch (error) {
        console.error('Error cargando propiedad:', error);
        alert('Error al cargar la propiedad');
    }
}

/**
 * Mostrar modal de visualización
 */
function showViewModal(prop) {
    const modal = document.getElementById('viewModal');
    
    // Actualizar información
    document.getElementById('viewTitulo').textContent = prop.titulo;
    document.getElementById('viewTipo').textContent = capitalizeFirst(prop.tipo);
    document.getElementById('viewEstado').textContent = capitalizeFirst(prop.estado);
    document.getElementById('viewPrecio').textContent = formatPrice(prop.precio);
    document.getElementById('viewUbicacion').textContent = prop.ubicacion;
    document.getElementById('viewHabitaciones').textContent = prop.habitaciones || 'N/A';
    document.getElementById('viewBanos').textContent = prop.banos || 'N/A';
    const vp = document.getElementById('viewParqueos');
    if (vp) vp.textContent = prop.parqueos || 'N/A';
    document.getElementById('viewMetros').textContent = `${prop.metrosCuadrados} m²`;
    document.getElementById('viewDescripcion').textContent = prop.descripcion || 'Sin descripción';
    
    // Características
    const caracteristicasList = document.getElementById('viewCaracteristicas');
    if (prop.caracteristicas && prop.caracteristicas.length > 0) {
        caracteristicasList.innerHTML = prop.caracteristicas.map(c => `<li>${c}</li>`).join('');
    } else {
        caracteristicasList.innerHTML = '<li>Sin características</li>';
    }
    
    // Nuevo carrusel de imágenes mejorado
    const carouselContainer = document.getElementById('viewCarousel');
    if (prop.imagenes && prop.imagenes.length > 0) {
        carouselContainer.innerHTML = `
            <div class="carousel-main-container">
                <div class="carousel-images">
                    ${prop.imagenes.map((img, index) => `
                        <img src="${img}" alt="${prop.titulo} ${index + 1}" class="carousel-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                    `).join('')}
                </div>
                <span class="carousel-counter">1 / ${prop.imagenes.length}</span>
                <div class="carousel-controls">
                    <button class="carousel-btn prev" onclick="prevImage()" ${prop.imagenes.length <= 1 ? 'disabled' : ''}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <button class="carousel-btn next" onclick="nextImage()" ${prop.imagenes.length <= 1 ? 'disabled' : ''}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="carousel-thumbnails">
                ${prop.imagenes.map((img, index) => `
                    <div class="carousel-thumbnail ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})">
                        <img src="${img}" alt="Thumbnail ${index + 1}">
                    </div>
                `).join('')}
            </div>
        `;
        
        // Inicializar índice del carrusel
        window.currentImageIndex = 0;
        window.totalImages = prop.imagenes.length;
    } else {
        carouselContainer.innerHTML = '<p class="no-images">Sin imágenes disponibles</p>';
    }
    
    modal.style.display = 'flex';
}

/**
 * Cerrar modal de visualización
 */
function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

/**
 * Navegar al siguiente imagen
 */
function nextImage() {
    if (!window.totalImages || window.totalImages <= 1) return;
    
    window.currentImageIndex = (window.currentImageIndex + 1) % window.totalImages;
    updateCarousel();
}

/**
 * Navegar a la imagen anterior
 */
function prevImage() {
    if (!window.totalImages || window.totalImages <= 1) return;
    
    window.currentImageIndex = (window.currentImageIndex - 1 + window.totalImages) % window.totalImages;
    updateCarousel();
}

/**
 * Ir a una imagen específica
 */
function goToImage(index) {
    window.currentImageIndex = index;
    updateCarousel();
}

/**
 * Actualizar el carrusel mejorado con thumbnails
 */
function updateCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    const thumbnails = document.querySelectorAll('.carousel-thumbnail');
    const counter = document.querySelector('.carousel-counter');
    
    // Actualizar imágenes principales
    images.forEach((img, index) => {
        img.classList.toggle('active', index === window.currentImageIndex);
    });
    
    // Actualizar thumbnails
    thumbnails.forEach((thumb, index) => {
        if (index === window.currentImageIndex) {
            thumb.classList.add('active');
            // Scroll suave al thumbnail activo
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // Actualizar contador
    if (counter) {
        counter.textContent = `${window.currentImageIndex + 1} / ${window.totalImages}`;
    }
}

/**
 * Editar propiedad
 */
async function editPropiedad(id) {
    try {
        const response = await fetch(`${API_URL}/propiedades/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const prop = data.data;
            
            // Llenar formulario
            document.getElementById('modalTitle').textContent = 'Editar Propiedad';
            document.getElementById('propiedadId').value = prop.id;
            document.getElementById('titulo').value = prop.titulo;
            document.getElementById('tipo').value = prop.tipo;
            document.getElementById('estado').value = prop.estado;
            document.getElementById('precio').value = prop.precio;
            document.getElementById('metrosCuadrados').value = prop.metrosCuadrados;
            document.getElementById('habitaciones').value = prop.habitaciones;
            document.getElementById('banos').value = prop.banos;
            document.getElementById('ubicacion').value = prop.ubicacion;
            document.getElementById('descripcion').value = prop.descripcion || '';
            document.getElementById('imagenes').value = prop.imagenes?.join('\n') || '';
            document.getElementById('caracteristicas').value = prop.caracteristicas?.join(', ') || '';
            
            // Mostrar modal
            document.getElementById('propiedadModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error cargando propiedad:', error);
        alert('Error al cargar la propiedad');
    }
}

/**
 * Eliminar propiedad
 */
async function deletePropiedad(id) {
    if (!confirm('¿Está seguro que desea eliminar esta propiedad?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/propiedades/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Propiedad eliminada exitosamente');
            loadPropiedades();
        } else {
            alert(data.message || 'Error al eliminar la propiedad');
        }
    } catch (error) {
        console.error('Error eliminando propiedad:', error);
        alert('Error al eliminar la propiedad');
    }
}

/**
 * Cerrar modal
 */
function closeModal() {
    document.getElementById('propiedadModal').style.display = 'none';
    // Limpiar preview de imágenes
    const preview = document.getElementById('imagePreview');
    if (preview) preview.innerHTML = '';
}

/**
 * Preview de imágenes seleccionadas
 */
if (document.getElementById('imageFiles')) {
    document.getElementById('imageFiles').addEventListener('change', function(e) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';
        
        const files = Array.from(e.target.files);
        
        if (files.length > 10) {
            alert('Máximo 10 imágenes permitidas');
            e.target.value = '';
            return;
        }
        
        files.forEach((file, index) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`La imagen ${file.name} excede el tamaño máximo de 5MB`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-preview" onclick="removePreviewImage(${index})">✕</button>
                    <small>${file.name}</small>
                `;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    });
}

/**
 * Remover imagen del preview
 */
function removePreviewImage(index) {
    const fileInput = document.getElementById('imageFiles');
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    fileInput.files = dt.files;
    
    // Trigger change event para actualizar preview
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
}

/**
 * Convertir archivo a base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Subir imágenes al servidor
 */
async function uploadImages(files) {
    if (files.length === 0) return [];
    
    try {
        // Convertir archivos a base64
        const base64Images = await Promise.all(
            Array.from(files).map(file => fileToBase64(file))
        );
        
        const response = await fetch(`${API_URL}/upload/multiple`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': localStorage.getItem('sessionId')
            },
            body: JSON.stringify({ images: base64Images })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.urls;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error subiendo imágenes:', error);
        throw error;
    }
}

/**
 * Manejo del formulario de propiedad
 */
if (document.getElementById('propiedadForm')) {
    document.getElementById('propiedadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        
        try {
            const id = document.getElementById('propiedadId').value;
            
            // Subir imágenes desde archivos si hay
            let uploadedUrls = [];
            const fileInput = document.getElementById('imageFiles');
            if (fileInput && fileInput.files.length > 0) {
                submitBtn.textContent = 'Subiendo imágenes...';
                uploadedUrls = await uploadImages(fileInput.files);
            }
            
            // Preparar URLs de imágenes (archivos subidos + URLs manuales)
            const imagenesText = document.getElementById('imagenes').value;
            const manualUrls = imagenesText
                .split('\n')
                .map(url => url.trim())
                .filter(url => url.length > 0);
            
            const imagenes = [...uploadedUrls, ...manualUrls];
            
            const caracteristicasText = document.getElementById('caracteristicas').value;
            const caracteristicas = caracteristicasText
                .split(',')
                .map(car => car.trim())
                .filter(car => car.length > 0);
            
            const propiedadData = {
                titulo: document.getElementById('titulo').value,
                tipo: document.getElementById('tipo').value,
                estado: document.getElementById('estado').value,
                precio: parseFloat(document.getElementById('precio').value),
                metrosCuadrados: parseFloat(document.getElementById('metrosCuadrados').value),
                habitaciones: parseInt(document.getElementById('habitaciones').value) || 0,
                banos: parseInt(document.getElementById('banos').value) || 0,
                parqueos: parseInt(document.getElementById('parqueos').value) || 0,
                ubicacion: document.getElementById('ubicacion').value,
                descripcion: document.getElementById('descripcion').value,
                imagenes,
                caracteristicas
            };
            
            // Determinar si es crear o actualizar
            const url = id 
                ? `${API_URL}/propiedades/${id}` 
                : `${API_URL}/propiedades`;
            
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(propiedadData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert(id ? 'Propiedad actualizada exitosamente' : 'Propiedad creada exitosamente');
                closeModal();
                loadPropiedades();
            } else {
                alert(data.message || 'Error al guardar la propiedad');
            }
        } catch (error) {
            console.error('Error guardando propiedad:', error);
            alert('Error al guardar la propiedad');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar';
        }
    });
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const propiedadModal = document.getElementById('propiedadModal');
    const viewModal = document.getElementById('viewModal');
    
    if (event.target === propiedadModal) {
        closeModal();
    }
    
    if (event.target === viewModal) {
        closeViewModal();
    }
};

// ============================================
// MENÚ MÓVIL
// ============================================

/**
 * Inicializar menú móvil
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('mobileOverlay');
    const sidebar = document.getElementById('adminSidebar');
    
    if (!menuBtn || !overlay || !sidebar) return;
    
    // Toggle menú
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        sidebar.classList.toggle('mobile-active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open');
    });
    
    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        sidebar.classList.remove('mobile-active');
        overlay.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
    });
    
    // Cerrar al hacer clic en un link
    const navLinks = sidebar.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuBtn.classList.remove('active');
                sidebar.classList.remove('mobile-active');
                overlay.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
    });
}

// Inicializar menú móvil cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});
