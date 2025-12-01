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
        try {
            const res = await window.api.get(`/propiedades/${propertyId}`);
            const p = res?.data;
            if (!p) {
                this.showError('Propiedad no encontrada');
                return;
            }
            this.currentProperty = p;
            this.renderProperty();
        } catch (e) {
            this.showError('Error al cargar la propiedad');
        }
    }

    renderProperty() {
        if (!this.currentProperty) return;

        const bc = document.getElementById('breadcrumb-title');
        if (bc) bc.textContent = this.currentProperty.titulo;

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

        const imgs = Array.isArray(this.currentProperty.imagenes) ? this.currentProperty.imagenes : [];
        const toUrl = (u) => {
            if (!u) return '';
            return u.startsWith('/uploads') ? `${window.location.origin}${u}` : u;
        };
        const fallbackSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420"><rect width="800" height="420" fill="%23dbeafe"/><text x="400" y="210" text-anchor="middle" dominant-baseline="middle" fill="%231e3a8a" font-size="28">Imagen no disponible</text></svg>';
        mainImage.src = toUrl(imgs[this.currentImageIndex] || imgs[0] || fallbackSVG);
        mainImage.onerror = () => {
            mainImage.onerror = null;
            mainImage.src = fallbackSVG;
        };

        thumbsContainer.innerHTML = imgs.map((img, index) => `
            <div class="gallery-thumb ${index === this.currentImageIndex ? 'active' : ''}" 
                 onclick="propertyDetailManager.changeImage(${index})">
                <img src="${toUrl(img)}" alt="Imagen ${index + 1}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 200\"><rect width=\"300\" height=\"200\" fill=\"%23dbeafe\"/><text x=\"150\" y=\"100\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"%231e3a8a\" font-size=\"16\">Sin imagen</text></svg>';">
            </div>
        `).join('');
    }

    renderMainInfo() {
        const t = this.currentProperty;
        document.getElementById('property-detail-title').textContent = t.titulo || '';
        document.getElementById('property-location-detail').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${t.ubicacion || ''}`;
        document.getElementById('property-price-main').textContent = this.formatPrice(t.precio || 0);
        document.getElementById('property-code').textContent = `#${t.id}`;
        document.getElementById('property-type').textContent = t.tipo || '';
        const cityEl = document.getElementById('property-city');
        if (cityEl) cityEl.textContent = '-';
        const sectorEl = document.getElementById('property-sector');
        if (sectorEl) sectorEl.textContent = '-';
        document.getElementById('property-rooms').textContent = t.habitaciones || 0;
        document.getElementById('property-parking').textContent = t.parqueos || 0;
        document.getElementById('property-area').textContent = `${t.metrosCuadrados || 0} m²`;
        document.getElementById('property-bathrooms').textContent = t.banos || 0;
        document.getElementById('property-description-text').textContent = t.descripcion || '';
    }

    renderFeatures() {
        const featuresGrid = document.getElementById('features-grid');
        if (!featuresGrid) return;
        const list = Array.isArray(this.currentProperty.caracteristicas) ? this.currentProperty.caracteristicas : [];
        featuresGrid.innerHTML = list.map(feature => `
            <div class="feature-item-detail">
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    renderAgent() {
        const name = 'Equipo TU Casa RD';
        const phone = '+18091234567';
        const email = 'info@tucasard.com';
        document.getElementById('agent-name').textContent = name;
        document.getElementById('agent-phone').textContent = phone;
        document.getElementById('agent-email').textContent = email;
        const callBtn = document.querySelector('.btn-call-tucasa');
        const whatsappBtn = document.querySelector('.btn-whatsapp-tucasa');
        if (callBtn) callBtn.href = `tel:${phone}`;
        if (whatsappBtn) {
            const message = `Hola, estoy interesado en la propiedad: ${this.currentProperty.titulo}`;
            whatsappBtn.href = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
        }
    }

    renderSimilarProperties() {
        const similarContainer = document.getElementById('similar-properties');
        if (!similarContainer) return;
        (async () => {
            try {
                const res = await window.api.get('/propiedades');
                const all = Array.isArray(res?.data) ? res.data : [];
                const sameType = all.filter(p => p.tipo === this.currentProperty.tipo && p.id !== this.currentProperty.id).slice(0, 2);
                similarContainer.innerHTML = sameType.map(p => `
                    <a href="propiedad-detalle.html?id=${p.id}" class="similar-property">
                        <img src="${(Array.isArray(p.imagenes) && p.imagenes[0] ? (p.imagenes[0].startsWith('/uploads') ? `${window.location.origin}${p.imagenes[0]}` : p.imagenes[0]) : 'https://via.placeholder.com/300x200?text=Propiedad')}" alt="${p.titulo}">
                        <div class="similar-property-info">
                            <h4>${p.titulo}</h4>
                            <div class="similar-property-price">${this.formatPrice(p.precio)}</div>
                            <small>${p.tipo}</small>
                        </div>
                    </a>
                `).join('');
            } catch {}
        })();
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
            const fallbackSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420"><rect width="800" height="420" fill="%23dbeafe"/><text x="400" y="210" text-anchor="middle" dominant-baseline="middle" fill="%231e3a8a" font-size="28">Imagen no disponible</text></svg>';
            const u = this.currentProperty.imagenes[this.currentImageIndex];
            mainImage.src = u ? (u.startsWith('/uploads') ? `${window.location.origin}${u}` : u) : fallbackSVG;
            mainImage.onerror = () => {
                mainImage.onerror = null;
                mainImage.src = fallbackSVG;
            };
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
