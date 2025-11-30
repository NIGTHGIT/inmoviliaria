class FavoritesManager {
    constructor() {
        this.favorites = new Set();
        this.storageKey = 'tucasa_favorites';
        this.init();
    }

    init() {
        this.loadFavorites();
        this.setupEventListeners();
        this.updateFavoritesCount();
    }

    loadFavorites() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.favorites = new Set(JSON.parse(saved));
        }
        this.renderFavorites();
    }

    saveFavorites() {
        localStorage.setItem(this.storageKey, JSON.stringify([...this.favorites]));
        this.updateFavoritesCount();
        this.renderFavorites();
    }

    toggleFavorite(propertyId) {
        if (this.favorites.has(propertyId)) {
            this.favorites.delete(propertyId);
            this.showNotification('Propiedad removida de favoritos', 'info');
        } else {
            this.favorites.add(propertyId);
            this.showNotification('Propiedad agregada a favoritos');
        }
        this.saveFavorites();
        this.updateFavoriteButton(propertyId);
    }

    isFavorite(propertyId) {
        return this.favorites.has(propertyId);
    }

    updateFavoriteButton(propertyId) {
        const buttons = document.querySelectorAll(`[data-property-id="${propertyId}"]`);
        buttons.forEach(button => {
            const icon = button.querySelector('i');
            if (this.favorites.has(propertyId)) {
                button.classList.add('active');
                if (icon) icon.className = 'fas fa-heart';
            } else {
                button.classList.remove('active');
                if (icon) icon.className = 'far fa-heart';
            }
        });
    }

    updateFavoritesCount() {
        const count = this.favorites.size;
        
        // Actualizar en el nav
        const navFavorites = document.querySelector('a[href="favoritos.html"]');
        if (navFavorites) {
            const existingBadge = navFavorites.querySelector('.favorites-badge');
            if (count > 0) {
                if (existingBadge) {
                    existingBadge.textContent = count;
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'favorites-badge';
                    badge.textContent = count;
                    navFavorites.appendChild(badge);
                }
            } else if (existingBadge) {
                existingBadge.remove();
            }
        }
    }

    getFavoriteProperties() {
        // Datos de ejemplo - en un proyecto real vendrían de una API
        const allProperties = {
            'prop_rd_1': {
                id: 'prop_rd_1',
                titulo: 'Apartamento en Residencial Vista Sol',
                precio: 125000,
                ubicacion: 'La Barranquita, Santiago',
                tipo: 'apartamento',
                habitaciones: 3,
                banios: 2,
                parqueos: 1,
                area: '100.55 m²',
                imagenes: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'],
                estado: 'en_venta'
            },
            'prop_rd_2': {
                id: 'prop_rd_2',
                titulo: 'Casa Familiar en Urbanización Cerrada',
                precio: 275000,
                ubicacion: 'Punta Cana, La Altagracia',
                tipo: 'casa',
                habitaciones: 4,
                banios: 3,
                parqueos: 2,
                area: '180 m²',
                imagenes: ['https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600'],
                estado: 'en_venta'
            }
        };

        return [...this.favorites].map(id => allProperties[id]).filter(prop => prop !== undefined);
    }

    renderFavorites() {
        const grid = document.getElementById('favorites-grid');
        const emptyState = document.getElementById('favorites-empty');
        const actions = document.getElementById('favorites-actions');

        if (!grid || !emptyState || !actions) return;

        const favoriteProperties = this.getFavoriteProperties();

        if (favoriteProperties.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            actions.style.display = 'none';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        actions.style.display = 'block';

        grid.innerHTML = favoriteProperties.map(property => `
            <div class="property-card-tucasa">
                <div class="property-image-tucasa">
                    <img src="${property.imagenes[0]}" alt="${property.titulo}">
                    <div class="property-badge-tucasa">${this.getStatusText(property.estado)}</div>
                    <div class="property-price-tucasa">${this.formatPrice(property.precio)}</div>
                    <button class="favorite-btn-tucasa active" 
                            data-property-id="${property.id}"
                            onclick="favoritesManager.toggleFavorite('${property.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="property-info-tucasa">
                    <h3 class="property-title-tucasa">${property.titulo}</h3>
                    <p class="property-location-tucasa">
                        <i class="fas fa-map-marker-alt"></i> ${property.ubicacion}
                    </p>
                    <div class="property-features-tucasa">
                        <span><i class="fas fa-bed"></i> ${property.habitaciones} hab.</span>
                        <span><i class="fas fa-bath"></i> ${property.banios} baños</span>
                        <span><i class="fas fa-car"></i> ${property.parqueos} parq.</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
                    </div>
                    <div class="property-actions-tucasa">
                        <a href="propiedad-detalle.html?id=${property.id}" class="btn-primary-tucasa">Ver Detalles</a>
                        <button class="btn-outline-tucasa" onclick="favoritesManager.toggleFavorite('${property.id}')">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    clearAllFavorites() {
        if (confirm('¿Estás seguro de que quieres eliminar todas tus propiedades favoritas?')) {
            this.favorites.clear();
            this.saveFavorites();
            this.showNotification('Todos los favoritos han sido eliminados', 'info');
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    getStatusText(estado) {
        const statusMap = {
            'en_venta': 'VENTA',
            'en_alquiler': 'ALQUILER'
        };
        return statusMap[estado] || estado;
    }

    showNotification(message, type = 'success') {
        // Crear notificación simple
        alert(message);
    }

    setupEventListeners() {
        // Los event listeners se manejan en los botones individuales
    }
}

// Funciones globales
function clearAllFavorites() {
    if (window.favoritesManager) {
        window.favoritesManager.clearAllFavorites();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
});