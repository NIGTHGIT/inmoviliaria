// Projects Page Manager
class ProjectsPageManager {
    constructor() {
        this.allProjects = [];
        this.filteredProjects = [];
        this.currentFilters = {
            status: '',
            location: '',
            type: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
        this.setupProjectModal();
    }

    async loadProjects() {
        try {
            // Try cache first
            const cached = localStorage.getItem('projects_cache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                if (Date.now() - cacheData.timestamp < 3600000) {
                    this.allProjects = cacheData.data;
                    return;
                }
            }

            // Try API
            const response = await fetch('https://api.tucasard.com/projects');
            if (response.ok) {
                this.allProjects = await response.json();
                localStorage.setItem('projects_cache', JSON.stringify({
                    data: this.allProjects,
                    timestamp: Date.now()
                }));
            } else {
                // Use sample data
                this.allProjects = this.getSampleProjects();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.allProjects = this.getSampleProjects();
        }
    }

    getSampleProjects() {
        return [
            {
                id: '1',
                title: 'Residencial Vista al Mar',
                location: 'Boca Chica, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                description: 'Proyecto residencial de lujo con vista al mar Caribe. 50 apartamentos de 2 y 3 habitaciones con amenities de primera categoría.',
                type: 'apartamentos',
                status: 'en_venta',
                features: ['Piscina', 'Gimnasio', 'Área BBQ', 'Seguridad 24/7', 'Parque infantil', 'Salón social'],
                price: 'Desde US$ 250,000',
                units: '50 unidades',
                delivery: 'Diciembre 2024',
                full_description: 'Residencial Vista al Mar es un proyecto innovador que combina diseño contemporáneo con la belleza natural del Caribe. Cada apartamento cuenta con acabados de lujo, cocinas equipadas con electrodomésticos de última generación y amplios balcones con vista al mar. El proyecto incluye áreas comunes exclusivas y está ubicado a solo 5 minutos de la playa.',
                gallery: [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                    'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800',
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w-800'
                ]
            },
            {
                id: '2',
                title: 'Condominio Las Palmas',
                location: 'Punta Cana',
                image: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800',
                description: 'Exclusivo condominio de villas frente al mar con acceso privado a playa y campo de golf.',
                type: 'villas',
                status: 'pre_venta',
                features: ['Playa privada', 'Campo de golf', 'Spa', 'Restaurante', 'Marina'],
                price: 'Desde US$ 850,000',
                units: '25 villas',
                delivery: 'Junio 2025',
                full_description: 'Condominio Las Palmas redefine el concepto de lujo en Punta Cana. Cada villa cuenta con diseño arquitectónico único, piscina privada y acceso directo a una de las playas más hermosas del Caribe. El proyecto incluye membresía al campo de golf de 18 hoyos y servicios de conserjería personalizada.',
                gallery: [
                    'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800',
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
                ]
            },
            {
                id: '3',
                title: 'Torre Panorámica',
                location: 'Piantini, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                description: 'Torre residencial de 25 pisos con vista panorámica 360° de la ciudad.',
                type: 'apartamentos',
                status: 'en_construccion',
                features: ['Vista 360°', 'Helipuerto', 'Piscina infinito', 'Gimnasio premium', 'Cinema'],
                price: 'Desde US$ 450,000',
                units: '80 apartamentos',
                delivery: 'Marzo 2025',
                full_description: 'Torre Panorámica es el edificio más alto de la zona, ofreciendo vistas espectaculares desde cada apartamento. Con diseño arquitectónico vanguardista y tecnología smart home integrada, representa lo último en living urbano. Incluye amenities de clase mundial y servicios de hotel.',
                gallery: [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
                ]
            },
            {
                id: '4',
                title: 'Eco Residencial Montaña Verde',
                location: 'Jarabacoa',
                image: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800',
                description: 'Proyecto sostenible en las montañas con casas ecológicas y energía renovable.',
                type: 'casas',
                status: 'terminado',
                features: ['Energía solar', 'Huerto orgánico', 'Sendero ecológico', 'Río privado', 'Establo'],
                price: 'Desde US$ 320,000',
                units: '40 casas',
                delivery: 'Entregado',
                full_description: 'Eco Residencial Montaña Verde combina lujo con sustentabilidad. Cada casa está diseñada con materiales ecológicos, sistemas de captación de agua lluvia y paneles solares. El proyecto preserva el 70% del área natural y cuenta con su propio río privado y senderos ecológicos.',
                gallery: [
                    'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800'
                ]
            },
            {
                id: '5',
                title: 'Puerto Escondido',
                location: 'Las Terrenas, Samaná',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                description: 'Complejo de apartamentos y bungalows frente al mar con marina privada.',
                type: 'mixto',
                status: 'en_venta',
                features: ['Marina privada', 'Restaurante gourmet', 'Spa thalasso', 'Deportes acuáticos', 'Kids club'],
                price: 'Desde US$ 280,000',
                units: '60 unidades',
                delivery: 'Agosto 2024',
                full_description: 'Puerto Escondido es un desarrollo único que combina residencias con marina deportiva. Ideal para amantes del mar, ofrece acceso directo a una de las bahías más protegidas de Samaná. El proyecto incluye escuela de vela y servicios náuticos completos.',
                gallery: [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
                ]
            },
            {
                id: '6',
                title: 'Urban Lofts Zona Colonial',
                location: 'Zona Colonial, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800',
                description: 'Lofts modernos en edificios históricos restaurados en el corazón colonial.',
                type: 'lofts',
                status: 'pre_venta',
                features: ['Diseño histórico', 'Techos altos', 'Patios internos', 'Estacionamiento', 'Locales comerciales'],
                price: 'Desde US$ 180,000',
                units: '30 lofts',
                delivery: 'Noviembre 2024',
                full_description: 'Urban Lofts rescata la arquitectura colonial del siglo XVI adaptándola a las necesidades modernas. Cada loft mantiene elementos originales como vigas de madera y paredes de piedra, combinados con tecnología y diseño contemporáneo. Ubicación privilegiada a pasos de los principales atractivos turísticos.',
                gallery: [
                    'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800'
                ]
            }
        ];
    }

    setupEventListeners() {
        // Filter event listeners
        document.getElementById('filter-status')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-location')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-type')?.addEventListener('change', () => this.applyFilters());
        
        // Clear filters
        document.getElementById('clear-project-filters')?.addEventListener('click', () => this.clearFilters());
        
        // Apply filters button
        document.querySelector('.btn-filter-projects')?.addEventListener('click', () => this.applyFilters());
        
        // Enter key in location filter
        document.getElementById('filter-location')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFilters();
            }
        });
    }

    applyFilters() {
        // Get filter values
        this.currentFilters = {
            status: document.getElementById('filter-status')?.value || '',
            location: document.getElementById('filter-location')?.value || '',
            type: document.getElementById('filter-type')?.value || ''
        };

        // Filter projects
        this.filteredProjects = this.allProjects.filter(project => {
            // Filter by status
            if (this.currentFilters.status && project.status !== this.currentFilters.status) {
                return false;
            }

            // Filter by location
            if (this.currentFilters.location && 
                !project.location.toLowerCase().includes(this.currentFilters.location.toLowerCase())) {
                return false;
            }

            // Filter by type
            if (this.currentFilters.type && project.type !== this.currentFilters.type) {
                return false;
            }

            return true;
        });

        this.renderProjects();
        this.updateResultsCount();
        this.updateActiveFiltersDisplay();
    }

    renderProjects() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        const projectsToShow = this.filteredProjects.length > 0 ? this.filteredProjects : this.allProjects;

        if (projectsToShow.length === 0) {
            container.innerHTML = `
                <div class="empty-state-tucasa" style="grid-column: 1/-1;">
                    <i class="fas fa-building"></i>
                    <h3>No se encontraron proyectos</h3>
                    <p>No hay proyectos que coincidan con tus filtros</p>
                    <button class="btn-primary-tucasa" onclick="projectsPageManager.clearFilters()">
                        <i class="fas fa-times"></i> Limpiar Filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = projectsToShow.map(project => this.createProjectCard(project)).join('');
        
        // Add click events to view details buttons
        projectsToShow.forEach(project => {
            const viewBtn = document.querySelector(`.view-project-details[data-id="${project.id}"]`);
            if (viewBtn) {
                viewBtn.addEventListener('click', () => this.showProjectDetail(project.id));
            }
        });
    }

    createProjectCard(project) {
        const statusText = this.getStatusText(project.status);
        const statusClass = this.getStatusClass(project.status);

        return `
            <div class="project-card-tucasa" data-id="${project.id}">
                <div class="project-header-tucasa">
                    <img src="${project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'}" 
                         alt="${project.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'">
                    <div class="project-badge-tucasa ${statusClass}">${statusText}</div>
                </div>
                <div class="project-content-tucasa">
                    <h3>${project.title}</h3>
                    <p class="project-location">
                        <i class="fas fa-map-marker-alt"></i> ${project.location}
                    </p>
                    <p class="project-description">${project.description}</p>
                    
                    ${project.features && project.features.length > 0 ? `
                        <div class="project-features">
                            ${project.features.slice(0, 3).map(feature => `
                                <span class="project-feature">
                                    <i class="fas fa-check"></i> ${feature}
                                </span>
                            `).join('')}
                            ${project.features.length > 3 ? `<span class="project-feature">+${project.features.length - 3} más</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="project-info-grid">
                        <div class="project-info-item">
                            <span class="project-info-label">Tipo</span>
                            <span class="project-info-value">${this.getTypeText(project.type)}</span>
                        </div>
                        <div class="project-info-item">
                            <span class="project-info-label">Unidades</span>
                            <span class="project-info-value">${project.units || 'N/A'}</span>
                        </div>
                        <div class="project-info-item">
                            <span class="project-info-label">Entrega</span>
                            <span class="project-info-value">${project.delivery || 'Por definir'}</span>
                        </div>
                    </div>
                    
                    <div class="project-price">${project.price}</div>
                    
                    <div class="project-actions">
                        <button class="btn-primary-tucasa view-project-details" data-id="${project.id}">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </button>
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20el%20proyecto%20${encodeURIComponent(project.title)}" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i> Más Info
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'en_venta': 'En Venta',
            'pre_venta': 'Pre-Venta',
            'en_construccion': 'En Construcción',
            'terminado': 'Terminado'
        };
        return statusMap[status] || 'Proyecto';
    }

    getStatusClass(status) {
        const classMap = {
            'en_venta': 'venta',
            'pre_venta': 'pre-venta',
            'en_construccion': 'construccion',
            'terminado': 'terminado'
        };
        return classMap[status] || '';
    }

    getTypeText(type) {
        const typeMap = {
            'apartamentos': 'Apartamentos',
            'villas': 'Villas',
            'casas': 'Casas',
            'mixto': 'Mixto',
            'lofts': 'Lofts'
        };
        return typeMap[type] || type;
    }

    updateResultsCount() {
        const resultsElement = document.getElementById('projects-results-count');
        if (resultsElement) {
            const count = this.filteredProjects.length > 0 ? this.filteredProjects.length : this.allProjects.length;
            resultsElement.textContent = `${count} proyectos encontrados`;
        }
    }

    updateActiveFiltersDisplay() {
        const activeFiltersContainer = document.getElementById('active-project-filters');
        if (!activeFiltersContainer) return;

        const activeFilters = [];
        
        if (this.currentFilters.status) {
            activeFilters.push({
                label: `Estado: ${this.getStatusText(this.currentFilters.status)}`,
                key: 'status'
            });
        }
        
        if (this.currentFilters.location) {
            activeFilters.push({
                label: `Ubicación: ${this.currentFilters.location}`,
                key: 'location'
            });
        }
        
        if (this.currentFilters.type) {
            activeFilters.push({
                label: `Tipo: ${this.getTypeText(this.currentFilters.type)}`,
                key: 'type'
            });
        }

        if (activeFilters.length > 0) {
            activeFiltersContainer.innerHTML = `
                <div class="active-filters-header">
                    <h4>Filtros aplicados:</h4>
                    <button class="clear-all-filters" onclick="projectsPageManager.clearFilters()">
                        <i class="fas fa-times"></i> Limpiar todo
                    </button>
                </div>
                <div class="active-filters-list">
                    ${activeFilters.map(filter => `
                        <span class="active-filter">
                            ${filter.label}
                            <button class="remove-filter" onclick="projectsPageManager.removeFilter('${filter.key}')">
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
            case 'status':
                document.getElementById('filter-status').value = '';
                break;
            case 'location':
                document.getElementById('filter-location').value = '';
                break;
            case 'type':
                document.getElementById('filter-type').value = '';
                break;
        }
        this.applyFilters();
    }

    clearFilters() {
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-location').value = '';
        document.getElementById('filter-type').value = '';
        
        this.applyFilters();
        
        this.showMessage('Filtros limpiados', 'success');
    }

    setupProjectModal() {
        const modal = document.getElementById('projectDetailModal');
        const closeBtn = document.getElementById('projectDetailClose');
        
        if (!modal || !closeBtn) return;
        
        // Close modal when clicking close button
        closeBtn.addEventListener('click', () => this.hideProjectDetail());
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideProjectDetail();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideProjectDetail();
            }
        });
    }

    showProjectDetail(projectId) {
        const project = this.allProjects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectDetailModal');
        const content = document.getElementById('projectDetailContent');

        const statusText = this.getStatusText(project.status);
        const statusClass = this.getStatusClass(project.status);

        content.innerHTML = `
            <div class="detail-header">
                <div>
                    <h2>${project.title}</h2>
                    <span class="detail-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="detail-price">${project.price}</div>
            </div>
            
            <p class="detail-location">
                <i class="fas fa-map-marker-alt"></i> ${project.location}
            </p>
            
            <div class="detail-info">
                <div class="detail-info-item">
                    <span>Tipo de Proyecto</span>
                    <strong>${this.getTypeText(project.type)}</strong>
                </div>
                <div class="detail-info-item">
                    <span>Unidades</span>
                    <strong>${project.units || 'N/A'}</strong>
                </div>
                <div class="detail-info-item">
                    <span>Entrega Estimada</span>
                    <strong>${project.delivery || 'Por definir'}</strong>
                </div>
            </div>
            
            ${project.gallery && project.gallery.length > 0 ? `
                <div class="detail-gallery-section">
                    <h3>Galería del Proyecto</h3>
                    <div class="detail-gallery">
                        ${project.gallery.map((img, index) => `
                            <img src="${img}" class="detail-image" alt="${project.title} - Imagen ${index + 1}"
                                 onclick="projectsPageManager.openImageGallery('${project.id}', ${index})">
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-description">
                <h3>Descripción del Proyecto</h3>
                <p>${project.description}</p>
                ${project.full_description ? `<p>${project.full_description}</p>` : ''}
            </div>
            
            ${project.features && project.features.length > 0 ? `
                <div class="detail-features">
                    <h3>Características y Amenidades</h3>
                    <div class="detail-features-list">
                        ${project.features.map(feature => `
                            <div class="detail-feature-item">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-actions">
                <div class="detail-contact">
                    <h4>¿Interesado en este proyecto?</h4>
                    <p>Contáctanos para agendar una visita o recibir más información</p>
                </div>
                <div class="detail-buttons">
                    <a href="contacto.html?proyecto=${encodeURIComponent(project.title)}" class="btn-secondary-tucasa">
                        <i class="fas fa-envelope"></i> Contactar
                    </a>
                    <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20el%20proyecto%20${encodeURIComponent(project.title)}" 
                       class="whatsapp-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Scroll to top of modal content
        content.scrollTop = 0;
    }

    hideProjectDetail() {
        const modal = document.getElementById('projectDetailModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    openImageGallery(projectId, startIndex) {
        const project = this.allProjects.find(p => p.id === projectId);
        if (!project || !project.gallery || project.gallery.length === 0) return;

        // Create image gallery modal
        const galleryModal = document.createElement('div');
        galleryModal.className = 'image-gallery-modal';
        galleryModal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="gallery-nav prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="gallery-main-image">
                    <img src="${project.gallery[startIndex]}" alt="Imagen ${startIndex + 1}">
                </div>
                <button class="gallery-nav next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="gallery-thumbnails">
                    ${project.gallery.map((img, index) => `
                        <img src="${img}" 
                             class="gallery-thumb ${index === startIndex ? 'active' : ''}" 
                             alt="Miniatura ${index + 1}"
                             data-index="${index}">
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(galleryModal);

        // Add gallery functionality
        let currentIndex = startIndex;
        const mainImage = galleryModal.querySelector('.gallery-main-image img');
        const thumbnails = galleryModal.querySelectorAll('.gallery-thumb');
        
        function updateGallery(index) {
            currentIndex = index;
            mainImage.src = project.gallery[currentIndex];
            mainImage.alt = `Imagen ${currentIndex + 1}`;
            
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentIndex);
            });
        }
        
        // Event listeners
        galleryModal.querySelector('.gallery-close').addEventListener('click', () => {
            galleryModal.remove();
        });
        
        galleryModal.querySelector('.gallery-nav.prev').addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + project.gallery.length) % project.gallery.length;
            updateGallery(newIndex);
        });
        
        galleryModal.querySelector('.gallery-nav.next').addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % project.gallery.length;
            updateGallery(newIndex);
        });
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                updateGallery(parseInt(thumb.dataset.index));
            });
        });
        
        // Close on escape
        document.addEventListener('keydown', function galleryKeyHandler(e) {
            if (e.key === 'Escape') {
                galleryModal.remove();
                document.removeEventListener('keydown', galleryKeyHandler);
            } else if (e.key === 'ArrowLeft') {
                const newIndex = (currentIndex - 1 + project.gallery.length) % project.gallery.length;
                updateGallery(newIndex);
            } else if (e.key === 'ArrowRight') {
                const newIndex = (currentIndex + 1) % project.gallery.length;
                updateGallery(newIndex);
            }
        });
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
    window.projectsPageManager = new ProjectsPageManager();
});