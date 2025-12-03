// Properties Page Manager
class PropertiesPageManager {
    constructor() {
        this.allProperties = [];
        this.filteredProperties = [];
        this.currentView = 'grid';
        this.loadLimit = 12;
        this.loadedCount = 0;
        this.currentFilters = {
            location: '',
            type: '',
            rooms: '',
            parking: '',
            maxPrice: '',
            operation: 'compra'
        };
        
        this.init();
    }

    async init() {
        await this.loadProperties();
        this.setupEventListeners();
        this.setupStickyFilter();
        this.applySearchFiltersFromURL();
        this.applyFilters(); // Mostrar propiedades iniciales
    }

    async loadProperties() {
        try {
            // Try cache first
            const cached = localStorage.getItem('properties_cache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                if (Date.now() - cacheData.timestamp < 3600000) {
                    this.allProperties = cacheData.data;
                    this.updatePropertiesCount();
                    return;
                }
            }

            // Try API
            const response = await fetch('https://api.tucasard.com/properties');
            if (response.ok) {
                this.allProperties = await response.json();
                localStorage.setItem('properties_cache', JSON.stringify({
                    data: this.allProperties,
                    timestamp: Date.now()
                }));
            } else {
                // Use sample data
                this.allProperties = this.getSampleProperties();
            }
            
            this.updatePropertiesCount();
        } catch (error) {
            console.error('Error loading properties:', error);
            this.allProperties = this.getSampleProperties();
            this.updatePropertiesCount();
        }
    }

    getSampleProperties() {
        return [
            {
                id: '1',
                title: 'Hermosa Casa en Piantini',
                price: 'US$ 450,000',
                location: 'Piantini, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                type: 'casa',
                rooms: 4,
                bathrooms: 3,
                area: '350',
                parking: 2,
                isForRent: false,
                description: 'Hermosa casa familiar en una de las mejores zonas de Santo Domingo.',
                features: ['Piscina', 'Jardín', 'Cocina equipada']
            },
            {
                id: '2',
                title: 'Apartamento Moderno en Naco',
                price: 'US$ 285,000',
                location: 'Naco, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                type: 'apartamento',
                rooms: 3,
                bathrooms: 2,
                area: '180',
                parking: 1,
                isForRent: false,
                description: 'Apartamento moderno con vista panorámica.',
                features: ['Terraza', 'Gimnasio', 'Piscina']
            },
            {
                id: '3',
                title: 'Villa de Lujo en Punta Cana',
                price: 'US$ 1,200,000',
                location: 'Punta Cana',
                image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
                type: 'villa',
                rooms: 5,
                bathrooms: 4,
                area: '650',
                parking: 3,
                isForRent: false,
                description: 'Villa de lujo frente al mar con acceso privado a playa.',
                features: ['Playa privada', 'Piscina infinita', 'Jardín tropical']
            },
            {
                id: '4',
                title: 'Penthouse en Bella Vista',
                price: 'US$ 2,500/mes',
                location: 'Bella Vista, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                type: 'penthouse',
                rooms: 4,
                bathrooms: 3,
                area: '320',
                parking: 2,
                isForRent: true,
                description: 'Penthouse exclusivo con terraza y vista 360°.',
                features: ['Terraza 360°', 'Jacuzzi', 'Vista panorámica']
            },
            {
                id: '5',
                title: 'Casa en Condominio Cerrado',
                price: 'US$ 1,800/mes',
                location: 'Los Cacicazgos, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                type: 'casa',
                rooms: 3,
                bathrooms: 2.5,
                area: '280',
                parking: 2,
                isForRent: true,
                description: 'Casa en condominio con seguridad 24/7 y áreas comunes.',
                features: ['Seguridad 24/7', 'Áreas verdes', 'Salón social']
            },
            {
                id: '6',
                title: 'Terreno Residencial en Santiago',
                price: 'US$ 150,000',
                location: 'Santiago de los Caballeros',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
                type: 'terreno',
                area: '1200',
                isForRent: false,
                description: 'Terreno plano ideal para construcción residencial.',
                features: ['Ubicación estratégica', 'Servicios básicos', 'Acceso pavimentado']
            },
            {
                id: '7',
                title: 'Apartamento Amueblado en Zona Colonial',
                price: 'US$ 1,200/mes',
                location: 'Zona Colonial, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                type: 'apartamento',
                rooms: 2,
                bathrooms: 1,
                area: '85',
                parking: 0,
                isForRent: true,
                description: 'Apartamento completamente amueblado en el corazón de la Zona Colonial.',
                features: ['Completamente amueblado', 'Aire acondicionado', 'Wi-Fi incluido']
            },
            {
                id: '8',
                title: 'Casa Familiar en Gazcue',
                price: 'US$ 380,000',
                location: 'Gazcue, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                type: 'casa',
                rooms: 3,
                bathrooms: 2,
                area: '220',
                parking: 1,
                isForRent: false,
                description: 'Casa familiar en zona residencial tranquila cerca del Malecón.',
                features: ['Patio trasero', 'Cocina remodelada', 'Seguridad']
            },
            {
                id: '9',
                title: 'Departamento de Lujo en Malecón Center',
                price: 'US$ 3,500/mes',
                location: 'Malecón, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                type: 'apartamento',
                rooms: 3,
                bathrooms: 2,
                area: '180',
                parking: 2,
                isForRent: true,
                description: 'Departamento de lujo con vista al mar Caribe en edificio de alta gama.',
                features: ['Vista al mar', 'Concierge 24/7', 'Gimnasio', 'Piscina']
            },
            {
                id: '10',
                title: 'Finca en Jarabacoa',
                price: 'US$ 750,000',
                location: 'Jarabacoa',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
                type: 'finca',
                rooms: 6,
                bathrooms: 4,
                area: '5000',
                parking: 4,
                isForRent: false,
                description: 'Finca espectacular en las montañas de Jarabacoa con río privado.',
                features: ['Río privado', 'Establo', 'Huerto orgánico', 'Mirador']
            },
            {
                id: '11',
                title: 'Estudio en Centro de la Ciudad',
                price: 'US$ 800/mes',
                location: 'Centro, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                type: 'apartamento',
                rooms: 1,
                bathrooms: 1,
                area: '45',
                parking: 0,
                isForRent: true,
                description: 'Estudio completamente amueblado ideal para estudiantes o profesionales.',
                features: ['Amueblado', 'Aire acondicionado', 'Seguridad 24/7', 'Lavandería']
            },
            {
                id: '12',
                title: 'Mansión en Casa de Campo',
                price: 'US$ 3,500,000',
                location: 'Casa de Campo, La Romana',
                image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
                type: 'villa',
                rooms: 8,
                bathrooms: 6,
                area: '1200',
                parking: 6,
                isForRent: false,
                description: 'Mansión de lujo en el exclusivo resort Casa de Campo con campo de golf privado.',
                features: ['Campo de golf privado', 'Helipuerto', 'Cinema en casa', 'Staff completo']
            }
        ];
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('filter-location')?.addEventListener('input', () => this.applyFilters());
        document.getElementById('filter-type')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-rooms')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-price')?.addEventListener('change', () => this.applyFilters());
        
        // Operation tabs
        document.querySelectorAll('.operation-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const operation = tab.dataset.operation;
                this.currentFilters.operation = operation;
                this.updateOperationTabs(operation);
                this.applyFilters();
            });
        });

        // Botón de búsqueda
        document.querySelector('.btn-filter-tucasa')?.addEventListener('click', () => this.applyFilters());

        // Botones de vista
        document.querySelectorAll('.view-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e.target.dataset.view || e.target.closest('.view-option').dataset.view));
        });

        // Botón cargar más
        document.getElementById('load-more-properties')?.addEventListener('click', () => this.loadMore());

        // Buscar por Enter
        document.getElementById('filter-location')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFilters();
            }
        });

        // Clear filters button
        document.getElementById('clear-filters')?.addEventListener('click', () => this.clearFilters());

        // Initialize favorite buttons
        this.initFavoriteButtons();
    }

    updateOperationTabs(activeOperation) {
        document.querySelectorAll('.operation-tab').forEach(tab => {
            if (tab.dataset.operation === activeOperation) {
                tab.classList.add('active');
                tab.querySelector('i').className = activeOperation === 'compra' ? 'fas fa-home' : 'fas fa-key';
            } else {
                tab.classList.remove('active');
                tab.querySelector('i').className = activeOperation === 'compra' ? 'far fa-home' : 'far fa-key';
            }
        });
    }

    applyFilters() {
        // Get current filter values
        this.currentFilters = {
            location: document.getElementById('filter-location')?.value || '',
            type: document.getElementById('filter-type')?.value || '',
            rooms: document.getElementById('filter-rooms')?.value || '',
            maxPrice: document.getElementById('filter-price')?.value || '',
            operation: this.currentFilters.operation || 'compra'
        };

        // Filter properties
        this.filteredProperties = this.allProperties.filter(property => {
            // Filter by operation
            if (this.currentFilters.operation === 'compra' && property.isForRent) return false;
            if (this.currentFilters.operation === 'alquiler' && !property.isForRent) return false;

            // Filter by location
            if (this.currentFilters.location && 
                !property.location.toLowerCase().includes(this.currentFilters.location.toLowerCase())) {
                return false;
            }

            // Filter by type
            if (this.currentFilters.type && property.type !== this.currentFilters.type) {
                return false;
            }

            // Filter by rooms
            if (this.currentFilters.rooms) {
                if (this.currentFilters.rooms === '4+' && property.rooms < 4) return false;
                if (this.currentFilters.rooms !== '4+' && property.rooms != this.currentFilters.rooms) return false;
            }

            // Filter by price
            if (this.currentFilters.maxPrice) {
                const priceNum = this.extractPriceNumber(property.price);
                if (priceNum > parseInt(this.currentFilters.maxPrice)) return false;
            }

            return true;
        });

        this.loadedCount = Math.min(this.loadLimit, this.filteredProperties.length);
        this.renderProperties();
        this.updatePropertiesCount();
        this.updateActiveFiltersDisplay();
    }

    extractPriceNumber(priceString) {
        if (!priceString) return 0;
        const match = priceString.match(/[\d,]+/);
        if (match) {
            return parseInt(match[0].replace(/,/g, ''));
        }
        return 0;
    }

    renderProperties() {
        const gridContainer = document.getElementById('properties-grid');
        const listContainer = document.getElementById('properties-list');
        
        if (!listContainer && gridContainer) {
            // Crear contenedor de lista si no existe
            const listDiv = document.createElement('div');
            listDiv.id = 'properties-list';
            listDiv.className = 'properties-list-tucasa';
            gridContainer.parentNode.insertBefore(listDiv, gridContainer.nextSibling);
        }

        if (this.currentView === 'grid') {
            document.getElementById('properties-list').style.display = 'none';
            document.getElementById('properties-grid').style.display = 'grid';
            this.renderGridView();
        } else {
            document.getElementById('properties-grid').style.display = 'none';
            document.getElementById('properties-list').style.display = 'flex';
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

        // Re-initialize favorite buttons
        this.initFavoriteButtons();
    }

    renderGridView() {
        const container = document.getElementById('properties-grid');
        const propertiesToShow = this.filteredProperties.slice(0, this.loadedCount);

        if (propertiesToShow.length === 0) {
            container.innerHTML = `
                <div class="empty-state-tucasa" style="grid-column: 1/-1;">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron propiedades</h3>
                    <p>Intenta con otros filtros de búsqueda</p>
                    <button class="btn-primary-tucasa" onclick="propertiesPageManager.clearFilters()">
                        <i class="fas fa-times"></i> Limpiar Filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = propertiesToShow.map(property => this.createPropertyCard(property)).join('');
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
                    <button class="btn-primary-tucasa" onclick="propertiesPageManager.clearFilters()">
                        <i class="fas fa-times"></i> Limpiar Filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = propertiesToShow.map(property => this.createListCard(property)).join('');
    }

    createPropertyCard(property) {
        const badgeColor = property.isForRent ? 'alquiler' : 'venta';
        const badgeText = property.isForRent ? 'Alquiler' : 'Venta';
        const isFavorite = this.isFavorite(property.id);

        return `
            <div class="property-card-tucasa" data-id="${property.id}" data-type="${property.type}" data-operation="${badgeColor}">
                <div class="property-image-tucasa">
                    <img src="${property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                         alt="${property.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                    <div class="property-badge-tucasa ${badgeColor}">${badgeText}</div>
                    <button class="favorite-btn-tucasa" data-id="${property.id}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <div class="property-price-tucasa">${property.price || 'Consultar'}</div>
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
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20la%20propiedad%20${encodeURIComponent(property.title)}" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    createListCard(property) {
        const badgeColor = property.isForRent ? 'alquiler' : 'venta';
        const badgeText = property.isForRent ? 'Alquiler' : 'Venta';
        const isFavorite = this.isFavorite(property.id);

        return `
            <div class="property-list-item">
                <div class="list-image-container">
                    <img src="${property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                         alt="${property.title}" 
                         class="list-image"
                         onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                    <div class="property-badge-tucasa ${badgeColor}">${badgeText}</div>
                    <button class="favorite-btn-tucasa" data-id="${property.id}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="list-content">
                    <div class="list-header">
                        <h3>${property.title}</h3>
                        <p class="property-location-tucasa">
                            <i class="fas fa-map-marker-alt"></i> ${property.location}
                        </p>
                        <div class="list-price">${property.price || 'Consultar'}</div>
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
                        <button class="favorite-btn-tucasa" data-id="${property.id}">
                            <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20la%20propiedad%20${encodeURIComponent(property.title)}" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
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
        
        // Scroll suave a las nuevas propiedades
        setTimeout(() => {
            const newProperties = document.querySelectorAll('.property-card-tucasa, .property-list-item');
            if (newProperties.length > 0) {
                newProperties[newProperties.length - 1].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 100);
    }

    clearFilters() {
        // Reset all filter inputs
        document.getElementById('filter-location').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-rooms').value = '';
        document.getElementById('filter-price').value = '';
        
        // Reset operation to compra
        this.currentFilters.operation = 'compra';
        this.updateOperationTabs('compra');
        
        // Apply filters
        this.applyFilters();
        
        // Show notification
        this.showMessage('Filtros limpiados', 'success');
        
        // Clear URL parameters
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, '', url);
        
        // Clear session storage
        sessionStorage.removeItem('lastSearch');
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
        this.renderProperties();
    }

    initFavoriteButtons() {
        document.querySelectorAll('.favorite-btn-tucasa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const propertyId = btn.dataset.id;
                this.toggleFavorite(propertyId);
                
                // Update icon immediately
                const isFavorite = this.isFavorite(propertyId);
                btn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>`;
                btn.classList.toggle('active', isFavorite);
            });
        });
    }

    isFavorite(propertyId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(fav => fav.id === propertyId);
    }

    updatePropertiesCount() {
        const countElement = document.getElementById('properties-count');
        if (countElement) {
            const operationText = this.currentFilters.operation === 'compra' ? 'en venta' : 'en alquiler';
            countElement.textContent = `${this.filteredProperties.length} Propiedades ${operationText}`;
        }
    }

    updateActiveFiltersDisplay() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;

        const activeFilters = [];
        
        if (this.currentFilters.location) {
            activeFilters.push({
                label: `Ubicación: ${this.currentFilters.location}`,
                key: 'location'
            });
        }
        
        if (this.currentFilters.type) {
            const typeLabels = {
                'casa': 'Casa',
                'apartamento': 'Apartamento',
                'villa': 'Villa',
                'penthouse': 'Penthouse',
                'terreno': 'Terreno',
                'local': 'Local Comercial'
            };
            activeFilters.push({
                label: `Tipo: ${typeLabels[this.currentFilters.type] || this.currentFilters.type}`,
                key: 'type'
            });
        }
        
        if (this.currentFilters.rooms) {
            activeFilters.push({
                label: `Habitaciones: ${this.currentFilters.rooms}+`,
                key: 'rooms'
            });
        }
        
        if (this.currentFilters.maxPrice) {
            const price = parseInt(this.currentFilters.maxPrice);
            activeFilters.push({
                label: `Precio máximo: US$ ${price.toLocaleString()}`,
                key: 'maxPrice'
            });
        }

        if (activeFilters.length > 0) {
            activeFiltersContainer.innerHTML = `
                <div class="active-filters-header">
                    <h4>Filtros aplicados:</h4>
                    <button class="clear-all-filters" onclick="propertiesPageManager.clearFilters()">
                        <i class="fas fa-times"></i> Limpiar todo
                    </button>
                </div>
                <div class="active-filters-list">
                    ${activeFilters.map(filter => `
                        <span class="active-filter">
                            ${filter.label}
                            <button class="remove-filter" onclick="propertiesPageManager.removeFilter('${filter.key}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </span>
                    `).join('')}
                </div>
            `;
            activeFiltersContainer.style.display = 'block';
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    removeFilter(filterKey) {
        switch(filterKey) {
            case 'location':
                document.getElementById('filter-location').value = '';
                break;
            case 'type':
                document.getElementById('filter-type').value = '';
                break;
            case 'rooms':
                document.getElementById('filter-rooms').value = '';
                break;
            case 'maxPrice':
                document.getElementById('filter-price').value = '';
                break;
        }
        this.applyFilters();
    }

    setupStickyFilter() {
        const filterSection = document.querySelector('.filters-section-tucasa');
        const header = document.querySelector('.header-tucasa');
        
        if (!filterSection) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 150) {
                filterSection.classList.add('sticky');
                filterSection.style.top = '0';
            } else {
                filterSection.classList.remove('sticky');
                filterSection.style.top = '';
            }
        });
    }

    applySearchFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const lastSearch = sessionStorage.getItem('lastSearch');
        
        let filters = {};
        
        if (urlParams.toString()) {
            filters = {
                location: urlParams.get('ubicacion'),
                type: urlParams.get('propiedad'),
                rooms: urlParams.get('habitaciones'),
                maxPrice: urlParams.get('precio'),
                operation: urlParams.get('tipo') || 'compra'
            };
        } else if (lastSearch) {
            filters = JSON.parse(lastSearch);
        }
        
        // Apply filters to controls
        this.applyFiltersToControls(filters);
        
        // Apply filters after a short delay
        setTimeout(() => {
            this.applyFilters();
            
            // Show filter message
            if (Object.keys(filters).length > 0) {
                this.showFilterMessage(filters);
            }
        }, 100);
    }

    applyFiltersToControls(filters) {
        if (filters.location) {
            document.getElementById('filter-location').value = filters.location;
        }
        
        if (filters.type) {
            document.getElementById('filter-type').value = filters.type;
        }
        
        if (filters.rooms) {
            document.getElementById('filter-rooms').value = filters.rooms;
        }
        
        if (filters.maxPrice) {
            document.getElementById('filter-price').value = filters.maxPrice;
        }
        
        if (filters.operation) {
            this.currentFilters.operation = filters.operation;
            this.updateOperationTabs(filters.operation);
        }
    }

    showFilterMessage(filters) {
        const messages = [];
        
        if (filters.operation) {
            messages.push(`Operación: ${filters.operation === 'compra' ? 'Compra' : 'Alquiler'}`);
        }
        
        if (filters.location) {
            messages.push(`Ubicación: ${filters.location}`);
        }
        
        if (filters.type) {
            messages.push(`Tipo: ${this.getPropertyTypeLabel(filters.type)}`);
        }
        
        if (filters.rooms) {
            messages.push(`Habitaciones: ${filters.rooms}+`);
        }
        
        if (filters.maxPrice) {
            const price = parseInt(filters.maxPrice);
            messages.push(`Precio máximo: US$ ${price.toLocaleString()}`);
        }
        
        if (messages.length > 0) {
            const message = `Filtros aplicados: ${messages.join(', ')}`;
            this.showMessage(message, 'info');
        }
    }

    getPropertyTypeLabel(type) {
        const labels = {
            'casa': 'Casa',
            'apartamento': 'Apartamento',
            'villa': 'Villa',
            'penthouse': 'Penthouse',
            'terreno': 'Terreno',
            'local': 'Local Comercial'
        };
        return labels[type] || type;
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.propertiesPageManager = new PropertiesPageManager();
});