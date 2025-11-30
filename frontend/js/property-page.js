class PropertiesPageManager {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentView = 'grid';
        this.init();
    }

    async init() {
        await this.loadProperties();
        this.renderProperties();
        this.setupEventListeners();
    }

    async loadProperties() {
        // Datos de ejemplo
        this.properties = [
            {
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
            {
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
            },
            {
                id: 'prop_rd_3',
                titulo: 'Apartamento Amueblado en Alquiler',
                precio: 1300,
                ubicacion: 'Santo Domingo Este',
                tipo: 'apartamento',
                habitaciones: 2,
                banios: 2,
                parqueos: 1,
                area: '85 m²',
                imagenes: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
                estado: 'en_alquiler'
            },
            {
                id: 'prop_rd_4',
                titulo: 'Villa de Lujo con Pileta',
                precio: 450000,
                ubicacion: 'Bávaro, Punta Cana',
                tipo: 'villa',
                habitaciones: 5,
                banios: 4,
                parqueos: 3,
                area: '320 m²',
                imagenes: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600'],
                estado: 'en_venta'
            }
        ];

        this.filteredProperties = [...this.properties];
    }

    renderProperties() {
        const grid = document.getElementById('properties-grid');
        const countElement = document.getElementById('properties-count');

        if (!grid || !countElement) return;

        countElement.textContent = `${this.filteredProperties.length} propiedades encontradas`;

        if (this.currentView === 'grid') {
            grid.innerHTML = this.filteredProperties.map(property => this.createPropertyCard(property)).join('');
        } else {
            grid.innerHTML = this.filteredProperties.map(property => this.createPropertyList(property)).join('');
        }
    }

    createPropertyCard(property) {
        return `
            <div class="property-card-tucasa">
                <div class="property-image-tucasa">
                    <img src="${property.imagenes[0]}" alt="${property.titulo}">
                    <div class="property-badge-tucasa">${this.getStatusText(property.estado)}</div>
                    <div class="property-price-tucasa">${this.formatPrice(property.precio)}</div>
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
                        <button class="btn-outline-tucasa" onclick="propertiesManager.toggleFavorite('${property.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createPropertyList(property) {
        return `
            <div class="property-list-item-tucasa">
                <div class="property-list-image">
                    <img src="${property.imagenes[0]}" alt="${property.titulo}">
                </div>
                <div class="property-list-info">
                    <h3>${property.titulo}</h3>
                    <p class="property-list-location">
                        <i class="fas fa-map-marker-alt"></i> ${property.ubicacion}
                    </p>
                    <div class="property-list-features">
                        <span><i class="fas fa-bed"></i> ${property.habitaciones}</span>
                        <span><i class="fas fa-bath"></i> ${property.banios}</span>
                        <span><i class="fas fa-car"></i> ${property.parqueos}</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
                    </div>
                </div>
                <div class="property-list-actions">
                    <div class="property-list-price">${this.formatPrice(property.precio)}</div>
                    <a href="propiedad-detalle.html?id=${property.id}" class="btn-primary-tucasa">Ver Detalles</a>
                </div>
            </div>
        `;
    }

    applyFilters() {
        const location = document.getElementById('filter-location').value.toLowerCase();
        const type = document.getElementById('filter-type').value;
        const rooms = document.getElementById('filter-rooms').value;
        const price = document.getElementById('filter-price').value;

        this.filteredProperties = this.properties.filter(property => {
            const matchesLocation = !location || property.ubicacion.toLowerCase().includes(location);
            const matchesType = !type || property.tipo === type;
            const matchesRooms = !rooms || property.habitaciones >= parseInt(rooms);
            const matchesPrice = !price || property.precio <= parseInt(price);

            return matchesLocation && matchesType && matchesRooms && matchesPrice;
        });

        this.renderProperties();
    }

    toggleFavorite(propertyId) {
        // Implementar lógica de favoritos
        console.log('Toggle favorite:', propertyId);
    }

    switchView(view) {
        this.currentView = view;
        this.renderProperties();
        
        // Actualizar botones activos
        document.querySelectorAll('.view-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
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

    setupEventListeners() {
        // View options
        document.querySelectorAll('.view-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Filter inputs (búsqueda en tiempo real)
        document.querySelectorAll('#filter-location, #filter-type, #filter-rooms, #filter-price').forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-properties');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Implementar carga de más propiedades
                alert('Funcionalidad de cargar más propiedades');
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.propertiesManager = new PropertiesPageManager();
});