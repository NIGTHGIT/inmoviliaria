// Property Detail Page Manager
class PropertyDetailManager {
    constructor() {
        this.property = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.agent = {
            name: 'Laura García Valdez',
            phone: '+1 (829) 552-1083',
            email: 'laura@tucasard.com',
            title: 'Agente Inmobiliario Senior'
        };
        
        this.init();
    }

    async init() {
        const propertyId = this.getPropertyId();
        if (!propertyId) {
            this.showError('ID de propiedad no especificado');
            return;
        }

        await this.loadProperty(propertyId);
        this.renderPropertyDetails();
        this.setupEventListeners();
        this.setupContactButtons();
        this.setupInterestForm();
        this.updatePageTitle();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getPropertyId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadProperty(id) {
        try {
            // Try to load from cache first
            const cached = localStorage.getItem('properties_cache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                this.property = cacheData.data.find(p => p.id === id);
            }
            
            // If not in cache, try API
            if (!this.property) {
                const response = await fetch(`https://api.tucasard.com/properties/${id}`);
                if (response.ok) {
                    this.property = await response.json();
                } else {
                    throw new Error('Propiedad no encontrada');
                }
            }

            if (!this.property) {
                throw new Error('Propiedad no encontrada');
            }

            // Prepare images
            this.images = this.property.images || [
                this.property.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
            ];
            
            // Ensure we have at least 3 images for the gallery
            while (this.images.length < 3) {
                this.images.push(this.images[0]);
            }
            
        } catch (error) {
            console.error('Error loading property:', error);
            this.property = this.getSampleProperty(id);
            this.images = [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
            ];
        }
    }

    getSampleProperty(id) {
        const sampleProperties = {
            '1': {
                id: '1',
                title: 'Hermosa Casa en Piantini',
                price: 'US$ 450,000',
                location: 'Piantini, Santo Domingo',
                type: 'casa',
                rooms: 4,
                bathrooms: 3,
                area: '350',
                parking: 2,
                code: 'PROP-001',
                isForRent: false,
                description: 'Hermosa casa familiar en una de las mejores zonas de Santo Domingo. Esta propiedad cuenta con amplios espacios, diseño moderno y todas las comodidades que tu familia necesita. Incluye piscina, jardín tropical y área de BBQ perfecta para reuniones familiares.',
                features: [
                    'Piscina climatizada',
                    'Jardín tropical',
                    'Cocina equipada con isla',
                    'Sistema de seguridad 24/7',
                    'Área de lavado independiente',
                    'Estacionamiento techado para 2 vehículos',
                    'Aire acondicionado en todas las habitaciones',
                    'Sistema de agua caliente solar',
                    'Terraza con vista al jardín',
                    'Closet empotrado en todas las habitaciones'
                ]
            },
            '2': {
                id: '2',
                title: 'Apartamento Moderno en Naco',
                price: 'US$ 285,000',
                location: 'Naco, Santo Domingo',
                type: 'apartamento',
                rooms: 3,
                bathrooms: 2,
                area: '180',
                parking: 1,
                code: 'PROP-002',
                isForRent: false,
                description: 'Apartamento moderno con vista panorámica de la ciudad. Ubicado en uno de los edificios más exclusivos de Naco, este apartamento ofrece lujo y comodidad en el corazón de Santo Domingo.',
                features: [
                    'Vista panorámica',
                    'Terraza privada',
                    'Gimnasio equipado',
                    'Piscina comunitaria',
                    'Salón de eventos',
                    'Concierge 24/7',
                    'Aire acondicionado central',
                    'Cocina moderna con electrodomésticos de acero inoxidable',
                    'Balcón con vista',
                    'Estacionamiento asignado'
                ]
            }
        };
        
        return sampleProperties[id] || sampleProperties['1'];
    }

    renderPropertyDetails() {
        if (!this.property) {
            this.showError('No se pudo cargar la información de la propiedad');
            return;
        }

        // Update breadcrumb
        document.getElementById('breadcrumb-title').textContent = this.property.title;

        // Title and location
        document.getElementById('property-detail-title').textContent = this.property.title;
        document.getElementById('property-location-detail').innerHTML = `
            <i class="fas fa-map-marker-alt"></i> ${this.property.location}
        `;

        // Price with badge
        const badgeType = this.property.isForRent ? 'Alquiler' : 'Venta';
        const badgeClass = this.property.isForRent ? 'alquiler' : 'venta';
        document.getElementById('property-price-main').innerHTML = `
            <span class="price-badge ${badgeClass}">${badgeType}</span>
            ${this.property.price}
        `;

        // Summary
        document.getElementById('property-code').textContent = this.property.code || this.property.id;
        document.getElementById('property-type').textContent = this.getPropertyTypeLabel(this.property.type);
        document.getElementById('property-rooms').textContent = this.property.rooms || 'N/A';
        document.getElementById('property-parking').textContent = this.property.parking || 'N/A';
        document.getElementById('property-area').textContent = this.property.area ? `${this.property.area} m²` : 'N/A';
        document.getElementById('property-bathrooms').textContent = this.property.bathrooms || 'N/A';

        // Description
        document.getElementById('property-description-text').textContent = 
            this.property.description || 'Sin descripción disponible.';

        // Features
        const featuresGrid = document.getElementById('features-grid');
        if (this.property.features && Array.isArray(this.property.features)) {
            featuresGrid.innerHTML = this.property.features.map(feature => `
                <div class="feature-item-detail">
                    <i class="fas fa-check"></i>
                    <span>${feature}</span>
                </div>
            `).join('');
        } else {
            featuresGrid.innerHTML = `
                <div class="empty-features">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay características especificadas para esta propiedad.</p>
                </div>
            `;
        }

        // Agent info
        document.getElementById('agent-name').textContent = this.agent.name;
        document.getElementById('agent-phone').textContent = this.agent.phone;
        document.getElementById('agent-email').textContent = this.agent.email;

        // Render gallery
        this.renderGallery();

        // Add favorite button to gallery
        this.addFavoriteButton();
    }

    getPropertyTypeLabel(type) {
        const labels = {
            'casa': 'Casa',
            'apartamento': 'Apartamento',
            'villa': 'Villa',
            'penthouse': 'Penthouse',
            'terreno': 'Terreno',
            'local': 'Local Comercial',
            'finca': 'Finca'
        };
        return labels[type] || type;
    }

    renderGallery() {
        const mainImage = document.getElementById('main-property-image');
        const galleryThumbs = document.getElementById('gallery-thumbs');

        if (this.images.length > 0) {
            mainImage.src = this.images[0];
            mainImage.alt = this.property.title;

            galleryThumbs.innerHTML = this.images.map((img, index) => `
                <img src="${img}" 
                     alt="Imagen ${index + 1} - ${this.property.title}" 
                     class="gallery-thumb ${index === 0 ? 'active' : ''}"
                     data-index="${index}"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'">
            `).join('');
        }
    }

    addFavoriteButton() {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn-detail';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.title = 'Agregar a favoritos';
        
        const isFavorite = this.checkIfFavorite();
        if (isFavorite) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.classList.add('active');
        }
        
        favoriteBtn.addEventListener('click', () => this.toggleFavorite(favoriteBtn));
        
        const mainImageContainer = document.querySelector('.main-image-container');
        mainImageContainer.appendChild(favoriteBtn);
    }

    checkIfFavorite() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(fav => fav.id === this.property.id);
    }

    toggleFavorite(button) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const propertyIndex = favorites.findIndex(fav => fav.id === this.property.id);

        if (propertyIndex === -1) {
            // Add to favorites
            favorites.push(this.property);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.classList.add('active');
            this.showNotification('Propiedad agregada a favoritos', 'success');
        } else {
            // Remove from favorites
            favorites.splice(propertyIndex, 1);
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.classList.remove('active');
            this.showNotification('Propiedad eliminada de favoritos', 'info');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    setupEventListeners() {
        // Gallery navigation
        document.querySelector('.gallery-nav.prev').addEventListener('click', () => this.changeImage(-1));
        document.querySelector('.gallery-nav.next').addEventListener('click', () => this.changeImage(1));

        // Thumbnail clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-thumb')) {
                const index = parseInt(e.target.dataset.index);
                this.changeImageTo(index);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.changeImage(-1);
            if (e.key === 'ArrowRight') this.changeImage(1);
        });

        // Share buttons
        this.setupShareButtons();
    }

    changeImage(direction) {
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length;
        this.updateMainImage();
    }

    changeImageTo(index) {
        this.currentImageIndex = index;
        this.updateMainImage();
    }

    updateMainImage() {
        const mainImage = document.getElementById('main-property-image');
        const thumbs = document.querySelectorAll('.gallery-thumb');

        mainImage.src = this.images[this.currentImageIndex];
        mainImage.alt = `Imagen ${this.currentImageIndex + 1} - ${this.property.title}`;

        // Add fade animation
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 10);

        // Update active thumb
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === this.currentImageIndex);
        });
    }

    setupContactButtons() {
        // WhatsApp button
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const whatsappMessage = encodeURIComponent(
            `Hola, estoy interesado en la propiedad:\n` +
            `📌 ${this.property.title}\n` +
            `💰 ${this.property.price}\n` +
            `📍 ${this.property.location}\n` +
            `🔑 Código: ${this.property.code || this.property.id}\n\n` +
            `Me gustaría recibir más información sobre esta propiedad.`
        );
        whatsappBtn.href = `https://wa.me/${this.agent.phone}?text=${whatsappMessage}`;

        // Call button
        const callBtn = document.getElementById('call-btn');
        callBtn.href = `tel:${this.agent.phone}`;
    }

    setupShareButtons() {
        // Create share container
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-container';
        shareContainer.innerHTML = `
            <button class="share-btn" title="Compartir en Facebook">
                <i class="fab fa-facebook"></i>
            </button>
            <button class="share-btn" title="Compartir en WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </button>
            <button class="share-btn" title="Copiar enlace">
                <i class="fas fa-link"></i>
            </button>
        `;

        const propertyHeader = document.querySelector('.property-header-tucasa');
        propertyHeader.appendChild(shareContainer);

        // Share functionality
        const currentUrl = window.location.href;
        const title = encodeURIComponent(this.property.title);
        
        // Facebook
        shareContainer.querySelectorAll('.share-btn')[0].addEventListener('click', () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        });

        // WhatsApp
        shareContainer.querySelectorAll('.share-btn')[1].addEventListener('click', () => {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Mira esta propiedad: ${this.property.title} - ${currentUrl}`)}`;
            window.open(whatsappUrl, '_blank');
        });

        // Copy link
        shareContainer.querySelectorAll('.share-btn')[2].addEventListener('click', () => {
            navigator.clipboard.writeText(currentUrl).then(() => {
                this.showNotification('Enlace copiado al portapapeles', 'success');
            });
        });
    }

    setupInterestForm() {
        const form = document.getElementById('interest-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitInterestForm(form);
        });
    }

    async submitInterestForm(form) {
        const formData = new FormData(form);
        const data = {
            property_id: this.property.id,
            property_title: this.property.title,
            property_price: this.property.price,
            property_location: this.property.location,
            property_url: window.location.href,
            name: formData.get('nombre') || form.querySelector('input[type="text"]').value,
            email: formData.get('email') || form.querySelector('input[type="email"]').value,
            phone: formData.get('telefono') || form.querySelector('input[type="tel"]').value,
            message: formData.get('mensaje') || form.querySelector('textarea').value,
            date: new Date().toLocaleString('es-DO')
        };

        const submitBtn = form.querySelector('.btn-submit-interest');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Send to EmailJS
            if (typeof emailjs !== 'undefined') {
                await emailjs.send("service_f8crp6f", "template_zvwaapq", {
                    to_email: this.agent.email,
                    from_name: data.name,
                    from_email: data.email,
                    phone: data.phone,
                    message: `Consulta sobre propiedad: ${this.property.title}\n\n${data.message || 'Sin mensaje adicional'}\n\nPropiedad: ${this.property.title}\nPrecio: ${this.property.price}\nUbicación: ${this.property.location}\nURL: ${data.property_url}`,
                    property_title: this.property.title,
                    property_code: this.property.code || this.property.id,
                    property_price: this.property.price,
                    property_url: data.property_url
                });
            }

            this.showNotification('¡Consulta enviada correctamente! Un agente te contactará pronto.', 'success');
            form.reset();

        } catch (error) {
            console.error('Error sending form:', error);
            this.showNotification('Hubo un error al enviar la consulta. Por favor, intenta de nuevo.', 'error');
            
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    updatePageTitle() {
        if (this.property) {
            document.title = `${this.property.title} - ${this.property.price} | TU Casa RD`;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.property-notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `property-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }

    showError(message) {
        const content = document.querySelector('.property-detail-content');
        if (content) {
            content.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Error al cargar la propiedad</h2>
                    <p>${message}</p>
                    <a href="propiedades.html" class="btn-primary-tucasa">
                        <i class="fas fa-arrow-left"></i> Volver a Propiedades
                    </a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.propertyDetailManager = new PropertyDetailManager();
});

// Global function for gallery navigation (for onclick attributes)
window.changeImage = function(direction) {
    if (window.propertyDetailManager) {
        window.propertyDetailManager.changeImage(direction);
    }
};