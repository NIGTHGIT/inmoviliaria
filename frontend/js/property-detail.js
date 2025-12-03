// Property Detail Page Functionality
class PropertyDetail {
    constructor() {
        this.property = null;
        this.currentImageIndex = 0;
        this.images = [];
        
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
        this.setupWhatsAppButton();
        this.setupCallButton();
        this.setupInterestForm();
    }

    getPropertyId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || urlParams.get('property');
    }

    async loadProperty(id) {
        try {
            // Simular carga de datos - en producción esto vendría de una API
            const properties = JSON.parse(localStorage.getItem('properties')) || [];
            this.property = properties.find(p => p.id === id || p.property_id === id);
            
            if (!this.property) {
                // Si no se encuentra en localStorage, intentar cargar de la API
                const response = await fetch(`https://api.tucasard.com/properties/${id}`);
                if (response.ok) {
                    this.property = await response.json();
                } else {
                    throw new Error('Propiedad no encontrada');
                }
            }

            // Preparar imágenes
            this.images = this.property.images || [this.property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'];
            
        } catch (error) {
            console.error('Error loading property:', error);
            this.showError('No se pudo cargar la información de la propiedad');
        }
    }

    renderPropertyDetails() {
        if (!this.property) return;

        // Actualizar breadcrumb
        document.getElementById('breadcrumb-title').textContent = this.property.title || 'Detalles';

        // Título y ubicación
        document.getElementById('property-detail-title').textContent = this.property.title;
        document.getElementById('property-location-detail').innerHTML = `
            <i class="fas fa-map-marker-alt"></i> ${this.property.location || 'Ubicación no especificada'}
        `;

        // Precio
        document.getElementById('property-price-main').textContent = this.property.price || 'Consultar';

        // Resumen
        document.getElementById('property-code').textContent = this.property.code || this.property.id || '-';
        document.getElementById('property-type').textContent = this.property.type || 'Propiedad';
        document.getElementById('property-rooms').textContent = this.property.rooms || 'N/A';
        document.getElementById('property-parking').textContent = this.property.parking || 'N/A';
        document.getElementById('property-area').textContent = this.property.area ? `${this.property.area} m²` : 'N/A';
        document.getElementById('property-bathrooms').textContent = this.property.bathrooms || 'N/A';

        // Descripción
        document.getElementById('property-description-text').textContent = 
            this.property.description || 'Sin descripción disponible.';

        // Características
        const featuresGrid = document.getElementById('features-grid');
        if (this.property.features && Array.isArray(this.property.features)) {
            featuresGrid.innerHTML = this.property.features.map(feature => `
                <div class="feature-item-detail">
                    <i class="fas fa-check"></i>
                    <span>${feature}</span>
                </div>
            `).join('');
        } else {
            featuresGrid.innerHTML = '<p>No hay características especificadas.</p>';
        }

        // Agente
        document.getElementById('agent-name').textContent = this.property.agent_name || 'Laura García Valdez';
        document.getElementById('agent-phone').textContent = this.property.agent_phone || '+1 (829) 552-1083';
        document.getElementById('agent-email').textContent = this.property.agent_email || 'laura@tucasard.com';

        // Galería
        this.renderGallery();

        // Actualizar título de la página
        document.title = `${this.property.title} - TU Casa RD`;
    }

    renderGallery() {
        const mainImage = document.getElementById('main-property-image');
        const galleryThumbs = document.getElementById('gallery-thumbs');

        if (this.images.length > 0) {
            mainImage.src = this.images[0];
            mainImage.alt = this.property.title;

            galleryThumbs.innerHTML = this.images.map((img, index) => `
                <img src="${img}" 
                     alt="Imagen ${index + 1}" 
                     class="gallery-thumb ${index === 0 ? 'active' : ''}"
                     onclick="propertyDetail.changeImage(${index})"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
            `).join('');
        }
    }

    changeImage(index) {
        if (typeof index === 'number') {
            this.currentImageIndex = index;
        } else {
            this.currentImageIndex = (this.currentImageIndex + index + this.images.length) % this.images.length;
        }

        const mainImage = document.getElementById('main-property-image');
        const thumbs = document.querySelectorAll('.gallery-thumb');

        mainImage.src = this.images[this.currentImageIndex];
        mainImage.alt = `Imagen ${this.currentImageIndex + 1} - ${this.property.title}`;

        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === this.currentImageIndex);
        });
    }

    setupWhatsAppButton() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const message = encodeURIComponent(
            `Hola, estoy interesado en la propiedad:\n` +
            `${this.property.title}\n` +
            `Código: ${this.property.code || this.property.id}\n` +
            `Precio: ${this.property.price || 'Consultar'}\n` +
            `Ubicación: ${this.property.location || 'No especificada'}`
        );
        
        const phone = this.property.agent_phone || '18497077848';
        whatsappBtn.href = `https://wa.me/${phone}?text=${message}`;
    }

    setupCallButton() {
        const callBtn = document.getElementById('call-btn');
        const phone = this.property.agent_phone || '+18295521083';
        callBtn.href = `tel:${phone}`;
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
            name: formData.get('nombre'),
            email: formData.get('email'),
            phone: formData.get('telefono'),
            message: formData.get('mensaje'),
            date: new Date().toISOString()
        };

        try {
            // Simular envío a API
            const response = await fetch('https://api.tucasard.com/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showSuccess('¡Consulta enviada correctamente! Un agente te contactará pronto.');
                form.reset();
                
                // También enviar a EmailJS
                this.sendEmailJS(data);
            } else {
                throw new Error('Error al enviar la consulta');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Hubo un error al enviar la consulta. Por favor, intenta de nuevo.');
        }
    }

    sendEmailJS(data) {
        if (typeof emailjs === 'undefined') return;

        emailjs.send("service_f8crp6f", "template_zvwaapq", {
            to_email: this.property.agent_email || 'info@tucasard.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            message: `Consulta sobre propiedad: ${this.property.title}\n\n${data.message || 'Sin mensaje adicional'}`,
            property_title: this.property.title,
            property_code: this.property.code || this.property.id,
            property_price: this.property.price,
            property_url: window.location.href
        }).then(
            () => console.log('Email enviado correctamente'),
            (error) => console.error('Error enviando email:', error)
        );
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-tucasa ${type}`;
        messageDiv.textContent = message;
        
        const form = document.getElementById('interest-form');
        form.insertBefore(messageDiv, form.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    setupEventListeners() {
        // Navegación de imágenes
        document.querySelector('.gallery-nav.prev').addEventListener('click', () => this.changeImage(-1));
        document.querySelector('.gallery-nav.next').addEventListener('click', () => this.changeImage(1));

        // Botón de favoritos
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn-tucasa';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        
        const imageContainer = document.querySelector('.main-image-container');
        imageContainer.appendChild(favoriteBtn);

        // Verificar si ya está en favoritos
        this.checkFavoriteStatus();
    }

    toggleFavorite() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const propertyIndex = favorites.findIndex(fav => fav.id === this.property.id);
        const favoriteBtn = document.querySelector('.main-image-container .favorite-btn-tucasa');

        if (propertyIndex === -1) {
            // Agregar a favoritos
            favorites.push(this.property);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.classList.add('active');
            this.showSuccess('Propiedad agregada a favoritos');
        } else {
            // Quitar de favoritos
            favorites.splice(propertyIndex, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.classList.remove('active');
            this.showSuccess('Propiedad eliminada de favoritos');
        }
    }

    checkFavoriteStatus() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some(fav => fav.id === this.property.id);
        const favoriteBtn = document.querySelector('.main-image-container .favorite-btn-tucasa');
        
        if (isFavorite) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.classList.add('active');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.propertyDetail = new PropertyDetail();
});