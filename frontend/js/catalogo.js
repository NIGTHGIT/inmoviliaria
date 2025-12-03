// Properties Page Functionality - Updated for Tropical Living RD
class PropertiesManager {
    constructor() {
        this.allProperties = [];
        this.filteredProperties = [];
        this.currentView = 'grid';
        this.loadLimit = 12;
        this.loadedCount = 0;
        
        this.init();
    }

    async init() {
        await this.loadProperties();
        this.setupEventListeners();
        
        // Verificar si hay resultados de búsqueda del home
        const searchResults = sessionStorage.getItem('searchResults');
        if (searchResults) {
            this.filteredProperties = JSON.parse(searchResults);
            sessionStorage.removeItem('searchResults');
        } else {
            this.applyFilters(); // Mostrar todas las propiedades inicialmente
        }
        
        this.renderProperties();
    }

    async loadProperties() {
        try {
            // Cargar las mismas propiedades que el catálogo
            const cached = JSON.parse(localStorage.getItem('tropical_properties'));
            if (cached && cached.length > 0) {
                this.allProperties = cached;
                return;
            }

            // Si no hay cache, cargar del catálogo
            const catalog = new CatalogManager();
            await catalog.loadProperties();
            this.allProperties = catalog.allProperties;
            
        } catch (error) {
            console.error('Error loading properties:', error);
            this.allProperties = this.getSampleProperties();
        }
    }

    getSampleProperties() {
        // Retornar propiedades de muestra si no hay datos
        return [
            {
                id: 'TL-001',
                title: 'Villa de Lujo en Punta Cana',
                price: 'US$ 850,000',
                location: 'Punta Cana, La Altagracia',
                image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
                type: 'villa',
                operation: 'venta',
                rooms: 5,
                bathrooms: 4,
                area: '550',
                parking: 3
            },
            // ... agregar más propiedades de muestra
        ];
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('filter-location').addEventListener('input', () => this.applyFilters());
        document.getElementById('filter-type').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-rooms').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-price').addEventListener('change', () => this.applyFilters());

        // Botón de búsqueda
        const filterBtn = document.querySelector('.btn-filter-tucasa');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.applyFilters());
        }

        // Botones de vista
        document.querySelectorAll('.view-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e.target.dataset.view || e.currentTarget.dataset.view));
        });

        // Botón cargar más
        const loadMoreBtn = document.getElementById('load-more-properties');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        // Buscar por Enter
        const locationInput = document.getElementById('filter-location');
        if (locationInput) {
            locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }
    }

    applyFilters() {
        const location = document.getElementById('filter-location').value.toLowerCase();
        const type = document.getElementById('filter-type').value;
        const rooms = document.getElementById('filter-rooms').value;
        const price = document.getElementById('filter-price').value;

        this.filteredProperties = this.allProperties.filter(property => {
            // Filtrar por ubicación
            if (location && !property.location.toLowerCase().includes(location)) {
                return false;
            }

            // Filtrar por tipo
            if (type && property.type !== type) {
                return false;
            }

            // Filtrar por habitaciones
            if (rooms && property.rooms) {
                if (rooms === '4+' && property.rooms < 4) return false;
                if (rooms !== '4+' && property.rooms != rooms) return false;
            }

            // Filtrar por precio (parsear el precio)
            if (price) {
                const maxPrice = parseInt(price);
                const propPrice = this.parsePrice(property.price);
                if (propPrice > maxPrice) return false;
            }

            return true;
        });

        this.loadedCount = Math.min(this.loadLimit, this.filteredProperties.length);
        this.renderProperties();
        this.updatePropertiesCount();
    }

    parsePrice(priceString) {
        if (!priceString) return 0;
        
        // Convertir "US$ 850,000" o "US$ 3,500/mes" a número
        const cleanPrice = priceString
            .replace(/[^0-9.]/g, '')
            .replace(/\./g, '')
            .replace(',', '');
            
        return parseInt(cleanPrice) || 0;
    }

    renderProperties() {
        const gridContainer = document.getElementById('properties-grid');
        
        // Crear contenedor de lista si no existe
        let listContainer = document.getElementById('properties-list');
        if (!listContainer) {
            listContainer = document.createElement('div');
            listContainer.id = 'properties-list';
            listContainer.className = 'properties-list-tucasa';
            gridContainer.parentNode.insertBefore(listContainer, gridContainer.nextSibling);
        }

        if (this.currentView === 'grid') {
            listContainer.style.display = 'none';
            gridContainer.style.display = 'grid';
            this.renderGridView();
        } else {
            gridContainer.style.display = 'none';
            listContainer.style.display = 'flex';
            this.renderListView();
        }

        // Mostrar/ocultar botón de cargar más
        const loadMoreBtn = document.getElementById('load-more-properties');
        if (loadMoreBtn) {
            if (this.loadedCount < this.filteredProperties.length) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }

        // Actualizar contador
        this.updatePropertiesCount();
    }

    renderGridView() {
        const container = document.getElementById('properties-grid');
        const propertiesToShow = this.filteredProperties.slice(0, this.loadedCount);

        if (propertiesToShow.length === 0) {
            container.innerHTML = `
                <div class="empty-state-tucasa">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron propiedades</h3>
                    <p>Intenta con otros filtros de búsqueda</p>
                    <button class="btn-primary-tucasa" onclick="propertiesManager.clearFilters()">
                        Limpiar Filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = propertiesToShow.map(property => `
            <div class="property-card-tucasa" data-id="${property.id}">
                <div class="property-image-tucasa">
                    <img src="${property.image}" 
                         alt="${property.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                    <div class="property-badge-tucasa">${property.operation === 'venta' ? 'VENTA' : 'ALQUILER'}</div>
                    <button class="favorite-btn-tucasa" onclick="propertiesManager.toggleFavorite('${property.id}')">
                        <i class="${this.isFavorite(property.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <div class="property-price-tucasa">${property.price}</div>
                </div>
                <div class="property-info-tucasa">
                    <h3 class="property-title-tucasa">${property.title}</h3>
                    <p class="property-location-tucasa">
                        <i class="fas fa-map-marker-alt"></i> ${property.location}
                    </p>
                    <div class="property-features-tucasa">
                        ${property.rooms ? `<span><i class="fas fa-bed"></i> ${property.rooms} hab</span>` : ''}
                        ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} baños</span>` : ''}
                        ${property.parking ? `<span><i class="fas fa-car"></i> ${property.parking} parq</span>` : ''}
                        ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area} m²</span>` : ''}
                    </div>
                    <div class="property-actions-tucasa">
                        <a href="detalle-propiedad.html?id=${property.id}" class="btn-primary-tucasa">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </a>
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20${encodeURIComponent(property.title)}%20%28${property.id}%29" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderListView() {
        const container = document.getElementById('properties-list');
        const propertiesToShow = this.filteredProperties.slice(0, this.loadedCount);

        if (propertiesToShow.length === 0) {
            container.innerHTML = `
                <div class="empty-state-tucasa">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron propiedades</h3>
                    <p>Intenta con otros filtros de búsqueda</p>
                    <button class="btn-primary-tucasa" onclick="propertiesManager.clearFilters()">
                        Limpiar Filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = propertiesToShow.map(property => `
            <div class="property-list-item">
                <img src="${property.image}" 
                     alt="${property.title}" 
                     class="list-image"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                <div class="list-content">
                    <div class="list-header">
                        <h3>${property.title}</h3>
                        <p class="property-location-tucasa">
                            <i class="fas fa-map-marker-alt"></i> ${property.location}
                        </p>
                        <div class="list-price">${property.price}</div>
                        <div class="property-badge-tucasa" style="display:inline-block; margin-top:0.5rem;">
                            ${property.operation === 'venta' ? 'VENTA' : 'ALQUILER'}
                        </div>
                    </div>
                    <div class="list-features">
                        ${property.rooms ? `<span><i class="fas fa-bed"></i> ${property.rooms} hab</span>` : ''}
                        ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} baños</span>` : ''}
                        ${property.parking ? `<span><i class="fas fa-car"></i> ${property.parking} parq</span>` : ''}
                        ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area} m²</span>` : ''}
                    </div>
                    <div class="property-description-tucasa">
                        <p>${property.description ? property.description.substring(0, 150) + '...' : 'Sin descripción disponible.'}</p>
                    </div>
                    <div class="list-actions">
                        <a href="detalle-propiedad.html?id=${property.id}" class="btn-primary-tucasa">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </a>
                        <button class="favorite-btn-tucasa" onclick="propertiesManager.toggleFavorite('${property.id}')">
                            <i class="${this.isFavorite(property.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20${encodeURIComponent(property.title)}" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    changeView(view) {
        this.currentView = view;
        
        // Actualizar botones activos
        document.querySelectorAll('.view-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderProperties();
    }

    loadMore() {
        this.loadedCount = Math.min(this.loadedCount + this.loadLimit, this.filteredProperties.length);
        this.renderProperties();
    }

    clearFilters() {
        document.getElementById('filter-location').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-rooms').value = '';
        document.getElementById('filter-price').value = '';
        this.applyFilters();
    }

    toggleFavorite(propertyId) {
        const property = this.allProperties.find(p => p.id === propertyId);
        if (!property) return;

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const propertyIndex = favorites.findIndex(fav => fav.id === propertyId);

        if (propertyIndex === -1) {
            favorites.push(property);
            this.showMessage('Propiedad agregada a favoritos', 'success');
        } else {
            favorites.splice(propertyIndex, 1);
            this.showMessage('Propiedad eliminada de favoritos', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Actualizar iconos
        this.updateFavoriteIcons();
    }

    isFavorite(propertyId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(fav => fav.id === propertyId);
    }

    updateFavoriteIcons() {
        document.querySelectorAll('.favorite-btn-tucasa').forEach(btn => {
            const propertyCard = btn.closest('[data-id]');
            if (!propertyCard) return;
            
            const propertyId = propertyCard.dataset.id;
            const icon = btn.querySelector('i');
            
            if (this.isFavorite(propertyId)) {
                icon.className = 'fas fa-heart';
                btn.classList.add('active');
            } else {
                icon.className = 'far fa-heart';
                btn.classList.remove('active');
            }
        });
    }

    updatePropertiesCount() {
        const countElement = document.getElementById('properties-count');
        if (countElement) {
            countElement.textContent = `${this.filteredProperties.length} Propiedades Disponibles`;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-tucasa ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 2000;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            animation: slideIn 0.3s ease;
        `;
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.propertiesManager = new PropertiesManager();
});