// Favoritos.js - Funcionalidad completa
class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.selectedForComparison = new Set();
        this.init();
    }

    async init() {
        await this.loadFavorites();
        this.setupEventListeners();
        this.renderFavorites();
        this.updateSummary();
        
        // Verificar si hay propiedades en el localStorage de ejemplo
        await this.checkForSampleData();
    }

    async checkForSampleData() {
        // Si no hay favoritos, mostrar datos de ejemplo para demo
        if (this.favorites.length === 0 && localStorage.getItem('showSampleFavorites') !== 'false') {
            const addSample = confirm('¿Deseas ver datos de ejemplo para probar la funcionalidad de favoritos?');
            
            if (addSample) {
                await this.addSampleFavorites();
                localStorage.setItem('showSampleFavorites', 'false');
            } else {
                localStorage.setItem('showSampleFavorites', 'false');
            }
        }
    }

    async addSampleFavorites() {
        const sampleProperties = [
            {
                id: 'fav1',
                title: 'Penthouse de Lujo en Piantini',
                price: 'US$ 850,000',
                location: 'Piantini, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
                type: 'apartamento',
                rooms: 4,
                bathrooms: 3,
                parking: 2,
                area: '280 m²',
                description: 'Penthouse de lujo con vistas panorámicas, acabados premium y amenities exclusivos.',
                features: ['Terraza privada', 'Piscina', 'Gimnasio', 'Vista panorámica', 'Cocina gourmet'],
                addedDate: new Date().toISOString()
            },
            {
                id: 'fav2',
                title: 'Villa con Piscina en Casa de Campo',
                price: 'US$ 1,200,000',
                location: 'Casa de Campo, La Romana',
                image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600',
                type: 'villa',
                rooms: 5,
                bathrooms: 4,
                parking: 3,
                area: '450 m²',
                description: 'Villa espectacular en comunidad exclusiva con acceso a campo de golf y marina.',
                features: ['Piscina privada', 'Jardín', 'BBQ area', 'Seguridad 24/7', 'Cocina al aire libre'],
                addedDate: new Date(Date.now() - 86400000).toISOString() // Ayer
            },
            {
                id: 'fav3',
                title: 'Apartamento Moderno en Naco',
                price: 'US$ 325,000',
                location: 'Naco, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                type: 'apartamento',
                rooms: 3,
                bathrooms: 2,
                parking: 1,
                area: '180 m²',
                description: 'Apartamento completamente renovado en edificio con amenities y ubicación privilegiada.',
                features: ['Balcón', 'Área social', 'Estacionamiento techado', 'Seguridad', 'Cerca de amenities'],
                addedDate: new Date(Date.now() - 172800000).toISOString() // Hace 2 días
            }
        ];

        this.favorites = sampleProperties;
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.renderFavorites();
        this.updateSummary();
        this.showToast('¡Datos de ejemplo agregados!', 'success');
    }

    async loadFavorites() {
        try {
            // Cargar de localStorage
            const stored = localStorage.getItem('favorites');
            this.favorites = stored ? JSON.parse(stored) : [];
            
            // También intentar cargar de API si existe
            if (this.favorites.length === 0) {
                const response = await fetch('https://api.tucasard.com/favorites');
                if (response.ok) {
                    const apiFavorites = await response.json();
                    this.favorites = apiFavorites;
                    localStorage.setItem('favorites', JSON.stringify(apiFavorites));
                }
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            this.favorites = [];
        }
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        // También enviar a API si está configurada
        this.syncWithAPI();
    }

    async syncWithAPI() {
        // En producción, aquí se sincronizaría con el backend
        try {
            const response = await fetch('https://api.tucasard.com/favorites/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ favorites: this.favorites })
            });
            
            if (!response.ok) {
                console.warn('No se pudo sincronizar con la API');
            }
        } catch (error) {
            console.error('Error syncing favorites:', error);
        }
    }

    setupEventListeners() {
        // Botón limpiar todos
        document.getElementById('clear-all-favorites')?.addEventListener('click', () => this.clearAllFavorites());
        
        // Botón compartir
        document.getElementById('share-favorites')?.addEventListener('click', () => this.shareFavorites());
        
        // Botón exportar
        document.getElementById('export-favorites')?.addEventListener('click', () => this.exportFavorites());
        
        // Botón comparar
        document.getElementById('compare-favorites')?.addEventListener('click', () => this.openCompareModal());
        
        // Modal de comparación
        document.getElementById('close-compare')?.addEventListener('click', () => this.closeCompareModal());
        document.getElementById('clear-comparison')?.addEventListener('click', () => this.clearComparison());
        document.getElementById('download-comparison')?.addEventListener('click', () => this.downloadComparison());
        
        // Cerrar modal al hacer clic fuera
        document.getElementById('compare-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'compare-modal') {
                this.closeCompareModal();
            }
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('compare-modal').style.display !== 'none') {
                this.closeCompareModal();
            }
        });
        
        // Escuchar cambios en localStorage desde otras pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === 'favorites') {
                this.loadFavorites();
                this.renderFavorites();
                this.updateSummary();
            }
        });
    }

    renderFavorites() {
        const grid = document.getElementById('favorites-grid');
        const emptyState = document.getElementById('favorites-empty');
        const actions = document.getElementById('favorites-actions');
        const summary = document.getElementById('favorites-summary');
        const counter = document.getElementById('favorites-counter');
        
        // Actualizar contador
        counter.textContent = this.favorites.length;
        
        if (this.favorites.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            actions.style.display = 'none';
            summary.style.display = 'none';
            return;
        }
        
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        actions.style.display = 'flex';
        summary.style.display = 'block';
        
        grid.innerHTML = this.favorites.map((favorite, index) => `
            <div class="favorite-card-tucasa" data-id="${favorite.id}">
                <div class="property-image-tucasa">
                    <img src="${favorite.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                         alt="${favorite.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                    <div class="property-badge-tucasa">${favorite.type || 'Propiedad'}</div>
                    <div class="property-price-tucasa">${favorite.price || 'Consultar'}</div>
                    <div class="favorite-actions">
                        <button class="favorite-remove" onclick="favoritesManager.removeFavorite('${favorite.id}')" 
                                title="Eliminar de favoritos">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="compare-checkbox ${this.selectedForComparison.has(favorite.id) ? 'selected' : ''}" 
                                onclick="favoritesManager.toggleComparison('${favorite.id}')"
                                title="${this.selectedForComparison.has(favorite.id) ? 'Quitar de comparación' : 'Comparar propiedad'}">
                            <i class="fas ${this.selectedForComparison.has(favorite.id) ? 'fa-check-square' : 'fa-balance-scale'}"></i>
                        </button>
                    </div>
                </div>
                <div class="property-info-tucasa">
                    <h3 class="property-title-tucasa">${favorite.title}</h3>
                    <p class="property-location-tucasa">
                        <i class="fas fa-map-marker-alt"></i> ${favorite.location}
                    </p>
                    <div class="property-features-tucasa">
                        <span><i class="fas fa-bed"></i> ${favorite.rooms || 'N/A'} hab</span>
                        <span><i class="fas fa-bath"></i> ${favorite.bathrooms || 'N/A'} baños</span>
                        <span><i class="fas fa-car"></i> ${favorite.parking || 'N/A'} parq</span>
                        ${favorite.area ? `<span><i class="fas fa-ruler-combined"></i> ${favorite.area}</span>` : ''}
                    </div>
                    <div class="property-description-tucasa">
                        <p>${favorite.description ? favorite.description.substring(0, 120) + '...' : 'Sin descripción disponible.'}</p>
                    </div>
                    <div class="property-actions-tucasa">
                        <a href="detalle-propiedad.html?id=${favorite.id}" class="btn-primary-tucasa">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </a>
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20la%20propiedad%20${encodeURIComponent(favorite.title)}" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i> Contactar
                        </a>
                    </div>
                    ${favorite.addedDate ? `
                        <div class="favorite-added-date">
                            <small><i class="far fa-calendar"></i> Agregado el ${new Date(favorite.addedDate).toLocaleDateString('es-ES')}</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    updateSummary() {
        if (this.favorites.length === 0) return;
        
        // Calcular rango de precios
        const prices = this.favorites.map(fav => {
            const priceStr = fav.price || '0';
            const priceNum = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
            return priceNum;
        }).filter(price => price > 0);
        
        let priceRange = 'Consultar';
        if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            priceRange = `US$ ${this.formatNumber(minPrice)} - US$ ${this.formatNumber(maxPrice)}`;
        }
        
        // Tipos de propiedades
        const types = {};
        this.favorites.forEach(fav => {
            const type = fav.type || 'otros';
            types[type] = (types[type] || 0) + 1;
        });
        const typesText = Object.entries(types)
            .map(([type, count]) => `${count} ${type}`)
            .join(', ');
        
        // Ubicaciones únicas
        const locations = new Set(this.favorites.map(fav => fav.location).filter(loc => loc));
        const locationsText = `${locations.size} ubicación${locations.size !== 1 ? 'es' : ''}`;
        
        // Actualizar DOM
        document.getElementById('price-range').textContent = priceRange;
        document.getElementById('property-types').textContent = typesText || 'Variados';
        document.getElementById('locations-count').textContent = locationsText;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    removeFavorite(propertyId) {
        const property = this.favorites.find(fav => fav.id === propertyId);
        if (!property) return;
        
        if (confirm(`¿Estás seguro de que quieres eliminar "${property.title}" de tus favoritos?`)) {
            const index = this.favorites.findIndex(fav => fav.id === propertyId);
            if (index !== -1) {
                this.favorites.splice(index, 1);
                this.selectedForComparison.delete(propertyId);
                this.saveFavorites();
                this.renderFavorites();
                this.updateSummary();
                this.showToast('Propiedad eliminada de favoritos', 'success');
                
                // Disparar evento personalizado para que otras páginas se actualicen
                window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
                    detail: { favorites: this.favorites } 
                }));
            }
        }
    }

    clearAllFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No hay favoritos para eliminar', 'info');
            return;
        }
        
        if (confirm(`¿Estás seguro de que quieres eliminar todas las propiedades (${this.favorites.length}) de tus favoritos?`)) {
            this.favorites = [];
            this.selectedForComparison.clear();
            this.saveFavorites();
            this.renderFavorites();
            this.updateSummary();
            this.showToast('Todos los favoritos han sido eliminados', 'success');
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
                detail: { favorites: [] } 
            }));
        }
    }

    toggleComparison(propertyId) {
        if (this.selectedForComparison.has(propertyId)) {
            this.selectedForComparison.delete(propertyId);
        } else {
            if (this.selectedForComparison.size >= 4) {
                this.showToast('Máximo 4 propiedades para comparar', 'error');
                return;
            }
            this.selectedForComparison.add(propertyId);
        }
        
        // Actualizar UI
        this.renderFavorites();
        
        // Actualizar contador en botón de comparar
        const compareBtn = document.getElementById('compare-favorites');
        if (compareBtn) {
            const count = this.selectedForComparison.size;
            compareBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Comparar ${count > 0 ? `(${count})` : ''}`;
        }
    }

    openCompareModal() {
        if (this.selectedForComparison.size < 2) {
            this.showToast('Selecciona al menos 2 propiedades para comparar', 'error');
            return;
        }
        
        const modal = document.getElementById('compare-modal');
        const compareGrid = document.getElementById('compare-grid');
        
        // Filtrar propiedades seleccionadas
        const selectedProperties = this.favorites.filter(fav => 
            this.selectedForComparison.has(fav.id)
        );
        
        // Generar tabla de comparación
        compareGrid.innerHTML = selectedProperties.map(property => `
            <div class="compare-item selected" data-id="${property.id}">
                <div class="compare-item-header">
                    <h4>${property.title}</h4>
                    <button class="compare-remove-item" onclick="favoritesManager.toggleComparison('${property.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <img src="${property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                     alt="${property.title}" 
                     class="compare-image"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                <div class="compare-details">
                    <div class="compare-detail">
                        <span>Precio:</span>
                        <strong>${property.price || 'Consultar'}</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Ubicación:</span>
                        <strong>${property.location || 'N/A'}</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Habitaciones:</span>
                        <strong>${property.rooms || 'N/A'}</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Baños:</span>
                        <strong>${property.bathrooms || 'N/A'}</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Parqueos:</span>
                        <strong>${property.parking || 'N/A'}</strong>
                    </div>
                    ${property.area ? `
                        <div class="compare-detail">
                            <span>Área:</span>
                            <strong>${property.area}</strong>
                        </div>
                    ` : ''}
                    <div class="compare-actions">
                        <a href="detalle-propiedad.html?id=${property.id}" class="btn-primary-tucasa">
                            Ver Detalles
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeCompareModal() {
        document.getElementById('compare-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    clearComparison() {
        this.selectedForComparison.clear();
        this.closeCompareModal();
        this.renderFavorites();
        this.showToast('Comparación limpiada', 'success');
    }

    async downloadComparison() {
        const selectedProperties = this.favorites.filter(fav => 
            this.selectedForComparison.has(fav.id)
        );
        
        if (selectedProperties.length === 0) {
            this.showToast('No hay propiedades seleccionadas para exportar', 'error');
            return;
        }
        
        // Crear contenido para el PDF/Excel
        const content = `
            COMPARACIÓN DE PROPIEDADES - TU Casa RD
            Fecha: ${new Date().toLocaleDateString('es-ES')}
            
            ${selectedProperties.map((prop, index) => `
            PROPIEDAD ${index + 1}:
            --------------------------
            Título: ${prop.title}
            Precio: ${prop.price || 'Consultar'}
            Ubicación: ${prop.location || 'N/A'}
            Habitaciones: ${prop.rooms || 'N/A'}
            Baños: ${prop.bathrooms || 'N/A'}
            Parqueos: ${prop.parking || 'N/A'}
            Área: ${prop.area || 'N/A'}
            Descripción: ${prop.description || 'Sin descripción'}
            Tipo: ${prop.type || 'Propiedad'}
            --------------------------
            `).join('\n')}
            
            Información de Contacto:
            TU Casa RD
            Tel: +1 (809) 123-4567
            WhatsApp: +1 (809) 987-6543
            Email: info@tucasard.com
        `;
        
        // Crear y descargar archivo
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comparacion-propiedades-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Comparación descargada', 'success');
    }

    exportFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No hay favoritos para exportar', 'info');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalProperties: this.favorites.length,
            properties: this.favorites.map(fav => ({
                ...fav,
                exportedDate: new Date().toISOString()
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favoritos-tucasard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Favoritos exportados exitosamente', 'success');
    }

    shareFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No hay favoritos para compartir', 'info');
            return;
        }
        
        const shareText = `🌟 Mis propiedades favoritas en TU Casa RD 🌟\n\n` +
            `He guardado ${this.favorites.length} propiedades que me interesan:\n\n` +
            this.favorites.slice(0, 5).map((fav, i) => 
                `${i + 1}. ${fav.title} - ${fav.price}\n   📍 ${fav.location}\n`
            ).join('\n') +
            `\n¡Échales un vistazo! 👀\n\n` +
            `🔗 ${window.location.origin}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mis propiedades favoritas - TU Casa RD',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('¡Lista copiada al portapapeles!', 'success');
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('¡Lista copiada al portapapeles!', 'success');
        }
    }

    showToast(message, type = 'info') {
        // Remover toast anteriores
        const existingToasts = document.querySelectorAll('.favorite-toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Crear nuevo toast
        const toast = document.createElement('div');
        toast.className = `favorite-toast ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast-content">
                <h4>${type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</h4>
                <p>${message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Función global para agregar/remover favoritos desde otras páginas
window.addToFavorites = function(property) {
    if (!window.favoritesManager) {
        // Si no está inicializado, inicializar primero
        window.favoritesManager = new FavoritesManager();
    }
    
    const exists = window.favoritesManager.favorites.some(fav => fav.id === property.id);
    if (!exists) {
        window.favoritesManager.favorites.push({
            ...property,
            addedDate: new Date().toISOString()
        });
        window.favoritesManager.saveFavorites();
        window.favoritesManager.showToast('Propiedad agregada a favoritos', 'success');
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
            detail: { favorites: window.favoritesManager.favorites } 
        }));
        
        return true;
    }
    return false;
};

window.removeFromFavorites = function(propertyId) {
    if (!window.favoritesManager) return false;
    
    const index = window.favoritesManager.favorites.findIndex(fav => fav.id === propertyId);
    if (index !== -1) {
        window.favoritesManager.favorites.splice(index, 1);
        window.favoritesManager.selectedForComparison.delete(propertyId);
        window.favoritesManager.saveFavorites();
        window.favoritesManager.showToast('Propiedad eliminada de favoritos', 'success');
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
            detail: { favorites: window.favoritesManager.favorites } 
        }));
        
        return true;
    }
    return false;
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
    
    // También inicializar en otras páginas que tengan botones de favoritos
    if (document.querySelector('.favorite-btn-tucasa')) {
        window.favoritesManager.setupFavoriteButtons();
    }
});

// Agregar este método al FavoritesManager para botones en otras páginas
FavoritesManager.prototype.setupFavoriteButtons = function() {
    document.querySelectorAll('.favorite-btn-tucasa').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const propertyId = btn.dataset.propertyId;
            if (!propertyId) return;
            
            // En una implementación real, aquí obtendrías los datos de la propiedad
            // Por ahora, usar datos del dataset
            const property = {
                id: propertyId,
                title: btn.dataset.propertyTitle || 'Propiedad',
                price: btn.dataset.propertyPrice || 'Consultar',
                location: btn.dataset.propertyLocation || 'Ubicación no especificada',
                image: btn.dataset.propertyImage,
                type: btn.dataset.propertyType || 'propiedad'
            };
            
            const isCurrentlyFavorite = this.favorites.some(fav => fav.id === propertyId);
            
            if (isCurrentlyFavorite) {
                this.removeFavorite(propertyId);
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove('active');
            } else {
                if (this.addToFavorites(property)) {
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                    btn.classList.add('active');
                }
            }
        });
    });
};