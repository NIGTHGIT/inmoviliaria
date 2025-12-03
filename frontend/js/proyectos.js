// Projects Page Functionality
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupEventListeners();
    }

    async loadProjects() {
        try {
            // Intentar cargar de la API
            const response = await fetch('https://api.tucasard.com/projects');
            if (response.ok) {
                this.projects = await response.json();
            } else {
                // Datos de ejemplo si la API falla
                this.projects = this.getSampleProjects();
            }
            
            this.renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = this.getSampleProjects();
            this.renderProjects();
        }
    }

    getSampleProjects() {
        return [
            {
                id: 'proj1',
                title: 'Residencial Vista al Mar',
                location: 'Boca Chica, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                description: 'Proyecto residencial de lujo con vista al mar Caribe. 50 apartamentos de 2 y 3 habitaciones con amenities de primera categoría.',
                type: 'apartamentos',
                status: 'en_venta',
                features: ['Piscina', 'Gimnasio', 'Área BBQ', 'Seguridad 24/7'],
                price: 'Desde US$ 250,000'
            },
            // Agregar más proyectos de ejemplo...
        ];
    }

    setupEventListeners() {
        // Cerrar modal
        document.getElementById('projectDetailClose').addEventListener('click', () => {
            this.hideProjectDetail();
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('projectDetailModal').addEventListener('click', (e) => {
            if (e.target.id === 'projectDetailModal') {
                this.hideProjectDetail();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideProjectDetail();
            }
        });
    }

    renderProjects() {
        const container = document.getElementById('projectsContainer');
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state-tucasa">
                    <i class="fas fa-building"></i>
                    <h3>No hay proyectos disponibles</h3>
                    <p>Pronto tendremos nuevos proyectos inmobiliarios</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.projects.map(project => `
            <div class="project-card-tucasa" data-id="${project.id}">
                <div class="project-header-tucasa">
                    <img src="${project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}" 
                         alt="${project.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'">
                    <div class="project-badge-tucasa">${this.getStatusText(project.status)}</div>
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
                    
                    <div class="project-actions">
                        <button class="btn-primary-tucasa" onclick="projectsManager.showProjectDetail('${project.id}')">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </button>
                        <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20el%20proyecto%20${encodeURIComponent(project.title)}" 
                           class="btn-outline-tucasa" target="_blank">
                            <i class="fab fa-whatsapp"></i> Más Info
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
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

    showProjectDetail(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectDetailModal');
        const content = document.getElementById('projectDetailContent');

        content.innerHTML = `
            <div class="detail-header">
                <div>
                    <h2>${project.title}</h2>
                    <span class="detail-badge">${this.getStatusText(project.status)}</span>
                </div>
                <div class="detail-price">${project.price || 'Consultar'}</div>
            </div>
            
            <p class="detail-location">
                <i class="fas fa-map-marker-alt"></i> ${project.location}
            </p>
            
            <div class="detail-info">
                <div class="detail-info-item">
                    <span>Tipo de Proyecto</span>
                    <strong>${project.type || 'Residencial'}</strong>
                </div>
                <div class="detail-info-item">
                    <span>Unidades</span>
                    <strong>${project.units || '50+'}</strong>
                </div>
                <div class="detail-info-item">
                    <span>Entrega Estimada</span>
                    <strong>${project.delivery || '2024-2025'}</strong>
                </div>
            </div>
            
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
            
            ${project.gallery && project.gallery.length > 0 ? `
                <div class="detail-gallery">
                    <h3>Galería</h3>
                    <div class="detail-gallery-grid">
                        ${project.gallery.slice(0, 4).map(img => `
                            <img src="${img}" class="detail-image" alt="${project.title}">
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
                    <a href="contacto.html" class="btn-secondary-tucasa">
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
    }

    hideProjectDetail() {
        const modal = document.getElementById('projectDetailModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.projectsManager = new ProjectsManager();
});