class PropertyDetailManager {
    constructor() {
        this.currentProperty = null;
        this.currentImageIndex = 0;
        this.init();
    }

    async init() {
        await this.loadProperty();
        this.setupEventListeners();
    }

    async loadProperty() {
        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = urlParams.get('id');
        
        if (!propertyId) {
            this.showError('No se especificó una propiedad');
            return;
        }

        // Cargar propiedad desde datos de ejemplo
        this.currentProperty = this.getPropertyById(propertyId);
        
        if (!this.currentProperty) {
            this.showError('Propiedad no encontrada');
            return;
        }

        this.renderProperty();
    }

    getPropertyById(id) {
        const properties = {
            'prop_rd_1': {
                id: 'prop_rd_1',
                codigo: '10264',
                titulo: 'Apartamento en Venta – Residencial Vista Sol Etapa II',
                ubicacion: 'La Barranquita, Santiago',
                ciudad: 'Santiago',
                sector: 'La Barranquita',
                precio: 125000,
                tipo: 'Apartamento',
                habitaciones: 3,
                banios: 2,
                parqueos: 1,
                area: '100.55 Mt2',
                descripcion: 'Hermoso apartamento en venta ubicado en el residencial Vista Sol Etapa II. Esta propiedad cuenta con amplios espacios, excelente iluminación natural y acabados de primera calidad. Ideal para familias que buscan comodidad y seguridad en una de las zonas más prestigiosas de Santiago.',
                caracteristicas: [
                    'Aire Acondicionado',
                    'Balcón',
                    'Cocina Integral',
                    'Pisos de Porcelanato',
                    'Clósets Empotrados',
                    'Área de Lavandería',
                    'Seguridad 24/7',
                    'Parque Infantil',
                    'Área Verde'
                ],
                imagenes: [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                    'https://images.unsplash.com-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
                ],
                agente: {
                    nombre: 'Laura García Valdez',
                    telefono: '+18295521083',
                    email: 'laura@tucasard.com'
                },
                lat: 19.4517,
                lng: -70.6970
            },
            'prop_rd_2': {
                id: 'prop_rd_2',
                codigo: '10265',
                titulo: 'Casa Familiar en Urbanización Cerrada',
                ubicacion: 'Punta Cana, La Altagracia',
                ciudad: 'Punta Cana',
                sector: 'Bávaro',
                precio: 275000,
                tipo: 'Casa',
                habitaciones: 4,
                banios: 3,
                parqueos: 2,
                area: '180 Mt2',
                descripcion: 'Espléndida casa familiar en urbanización cerrada con seguridad privada. Cuenta con amplio jardín, terraza y área de parrilla. Perfecta para disfrutar del clima caribeño y la tranquilidad de la zona.',
                caracteristicas: [
                    'Pileta',
                    'Jardín',
                    'Terraza',
                    'Parrilla',
                    'Cochera Techada',
                    'Estudio',
                    'Seguridad 24/7',
                    'Cerca de Playas'
                ],
                imagenes: [
                    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
                    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800'
                ],
                agente: {
                    nombre: 'Carlos Rodríguez',
                    telefono: '+18295521084',
                    email: 'carlos@tucasard.com'
                },
                lat: 18.5820,
                lng: -68.4055
            }
        };

        return properties[id];
    }

    renderProperty() {
        if (!this.currentProperty) return;

        // Actualizar breadcrumb
        document.getElementById('property-title-breadcrumb').textContent = this.currentProperty.titulo;

        // Renderizar galería
        this.renderGallery();

        // Renderizar información principal
        this.renderMainInfo();

        // Renderizar características
        this.renderFeatures();

        // Renderizar agente
        this.renderAgent();

        // Renderizar propiedades similares
        this.renderSimilarProperties();
    }

    renderGallery() {
        const mainImage = document.getElementById('main-property-image');
        const thumbsContainer = document.getElementById('gallery-thumbs');

        if (!mainImage || !thumbsContainer) return;

        // Imagen principal
        mainImage.src = this.currentProperty.imagenes[this.currentImageIndex];

        // Miniaturas
        thumbsContainer.innerHTML = this.currentProperty.imagenes.map((img, index) => `
            <div class="gallery-thumb ${index === this.currentImageIndex ? 'active' : ''}" 
                 onclick="propertyDetailManager.changeImage(${index})">
                <img src="${img}" alt="Imagen ${index + 1}">
            </div>
        `).join('');
    }

    renderMainInfo() {
        document.getElementById('property-detail-title').textContent = this.currentProperty.titulo;
        document.getElementById('property-location-detail').innerHTML = 
            `<i class="fas fa-map-marker-alt"></i> ${this.currentProperty.ubicacion}`;
        
        document.getElementById('property-price-main').textContent = 
            this.formatPrice(this.currentProperty.precio);

        // Resumen
        document.getElementById('property-code').textContent = this.currentProperty.codigo;
        document.getElementById('property-type').textContent = this.currentProperty.tipo;
        document.getElementById('property-city').textContent = this.currentProperty.ciudad;
        document.getElementById('property-sector').textContent = this.currentProperty.sector;
        document.getElementById('property-rooms').textContent = this.currentProperty.habitaciones;
        document.getElementById('property-parking').textContent = this.currentProperty.parqueos;
        document.getElementById('property-area').textContent = this.currentProperty.area;
        document.getElementById('property-bathrooms').textContent = this.currentProperty.banios;

        // Descripción
        document.getElementById('property-description-text').textContent = this.currentProperty.descripcion;

        // Dirección completa para el mapa
        document.getElementById('property-full-address').textContent = this.currentProperty.ubicacion;
    }

    renderFeatures() {
        const featuresGrid = document.getElementById('features-grid');
        if (!featuresGrid) return;

        featuresGrid.innerHTML = this.currentProperty.caracteristicas.map(feature => `
            <div class="feature-item-detail">
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    renderAgent() {
        document.getElementById('agent-name').textContent = this.currentProperty.agente.nombre;
        document.getElementById('agent-phone').textContent = this.currentProperty.agente.telefono;
        document.getElementById('agent-email').textContent = this.currentProperty.agente.email;

        // Actualizar enlaces de contacto
        const callBtn = document.querySelector('.btn-call-tucasa');
        const whatsappBtn = document.querySelector('.btn-whatsapp-tucasa');
        
        if (callBtn) {
            callBtn.href = `tel:${this.currentProperty.agente.telefono}`;
        }
        
        if (whatsappBtn) {
            const message = `Hola, estoy interesado en la propiedad: ${this.currentProperty.titulo}`;
            whatsappBtn.href = `https://wa.me/${this.currentProperty.agente.telefono.replace('+', '')}?text=${encodeURIComponent(message)}`;
        }
    }

    renderSimilarProperties() {
        const similarContainer = document.getElementById('similar-properties');
        if (!similarContainer) return;

        // Propiedades similares de ejemplo
        const similarProperties = [
            {
                id: 'prop_rd_3',
                titulo: 'Apartamento en Torre Moderna',
                precio: 145000,
                imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300',
                tipo: 'Apartamento'
            },
            {
                id: 'prop_rd_4', 
                titulo: 'Casa con Pileta',
                precio: 320000,
                imagen: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=300',
                tipo: 'Casa'
            }
        ];

        similarContainer.innerHTML = similarProperties.map(prop => `
            <a href="propiedad-detalle.html?id=${prop.id}" class="similar-property">
                <img src="${prop.imagen}" alt="${prop.titulo}">
                <div class="similar-property-info">
                    <h4>${prop.titulo}</h4>
                    <div class="similar-property-price">${this.formatPrice(prop.precio)}</div>
                    <small>${prop.tipo}</small>
                </div>
            </a>
        `).join('');
    }

    changeImage(index) {
        if (typeof index === 'number') {
            // Navegación por flechas
            this.currentImageIndex = (this.currentImageIndex + index + this.currentProperty.imagenes.length) % this.currentProperty.imagenes.length;
        } else {
            // Click directo en miniatura
            this.currentImageIndex = index;
        }

        const mainImage = document.getElementById('main-property-image');
        const thumbs = document.querySelectorAll('.gallery-thumb');

        if (mainImage) {
            mainImage.src = this.currentProperty.imagenes[this.currentImageIndex];
        }

        // Actualizar estado activo de miniaturas
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === this.currentImageIndex);
        });
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    showError(message) {
        const main = document.querySelector('.property-details-tucasa');
        if (main) {
            main.innerHTML = `
                <div class="container-tucasa">
                    <div class="error-state" style="text-align: center; padding: 4rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--accent-orange); margin-bottom: 1rem;"></i>
                        <h2>Propiedad No Encontrada</h2>
                        <p>${message}</p>
                        <a href="propiedades.html" class="btn-primary-tucasa" style="margin-top: 2rem;">
                            Volver a Propiedades
                        </a>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Formulario de interés
        const interestForm = document.getElementById('interest-form');
        if (interestForm) {
            interestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleInterestForm(e.target);
            });
        }
    }

    handleInterestForm(form) {
        const formData = new FormData(form);
        const nombre = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const telefono = form.querySelector('input[type="tel"]').value;
        const mensaje = form.querySelector('textarea').value;

        const data = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            mensaje: mensaje,
            propiedad: this.currentProperty.titulo,
            codigo: this.currentProperty.codigo
        };

        // Simular envío
        console.log('Formulario de interés:', data);
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
        form.reset();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.propertyDetailManager = new PropertyDetailManager();
});

// Función global para cambiar imágenes
function changeImage(direction) {
    if (window.propertyDetailManager) {
        window.propertyDetailManager.changeImage(direction);
    }
}