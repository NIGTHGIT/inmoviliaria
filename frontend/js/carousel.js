class CarouselManagerTucasa {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.allProperties = [];
        this.featuredSlides = [];
        this.autoPlayInterval = null;
        // Inicio: grid con paginación simple
        this.gridVisible = 9;
        this.gridPageSize = 9;
        this.init();
    }

    async init() {
        await this.loadSlides();
        this.renderCarousel();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    async loadSlides() {
        try {
            const res = await window.api.get('/propiedades');
            const list = Array.isArray(res?.data) ? res.data : [];
            this.allProperties = list.map(p => ({
                id: p.id,
                titulo: p.titulo,
                precio: p.precio,
                ubicacion: p.ubicacion,
                imagenes: Array.isArray(p.imagenes) && p.imagenes.length ? p.imagenes : ['https://via.placeholder.com/600x400?text=Propiedad'],
                tipo: p.tipo,
                estado: p.estado,
                habitaciones: p.habitaciones || 0,
                banos: p.banos || 0,
                metrosCuadrados: p.metrosCuadrados || 0,
                caracteristicas: p.caracteristicas || []
            }));

            // Seleccionar 10 más caras para destacadas
            this.featuredSlides = [...this.allProperties]
                .sort((a, b) => (b.precio || 0) - (a.precio || 0))
                .slice(0, 10);
        } catch (e) {
            console.error('Error cargando propiedades del API:', e);
            this.allProperties = [];
            this.featuredSlides = [];
        }
    }

    renderCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.getElementById('carousel-dots');

        if (!track || !dots) return;

        // Render slides (destacadas: 10 más caras)
        track.innerHTML = this.featuredSlides.map((slide, index) => `
            <div class="carousel-slide-tucasa" data-index="${index}">
                <div class="property-card-tucasa">
                    <div class="property-image-tucasa">
                        <img src="${slide.imagenes[0] || 'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 400\"><rect width=\"600\" height=\"400\" fill=\"%23dbeafe\"/><text x=\"300\" y=\"200\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"%231e3a8a\" font-size=\"24\">Imagen no disponible</text></svg>'}" alt="${slide.titulo}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 400\"><rect width=\"600\" height=\"400\" fill=\"%23dbeafe\"/><text x=\"300\" y=\"200\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"%231e3a8a\" font-size=\"24\">Imagen no disponible</text></svg>';">
                        <div class="property-badge-tucasa">${this.getStatusText(slide.estado)}</div>
                        <div class="property-price-tucasa">${this.formatPrice(slide.precio)}</div>
                    </div>
                    <div class="property-info-tucasa">
                        <h3 class="property-title-tucasa">${slide.titulo}</h3>
                        <p class="property-location-tucasa">
                            <i class="fas fa-map-marker-alt"></i> ${slide.ubicacion}
                        </p>
                        <div class="property-features-tucasa">
                            <span><i class="fas fa-bed"></i> ${slide.habitaciones} hab.</span>
                            <span><i class="fas fa-bath"></i> ${slide.banos} baños</span>
                            <span><i class="fas fa-ruler-combined"></i> ${slide.metrosCuadrados} m²</span>
                        </div>
                        <div class="property-actions-tucasa">
                        <a href="propiedad-detalle.html?id=${slide.id}" class="btn-primary-tucasa">Ver Detalles</a>
                        <button class="btn-outline-tucasa" data-property-id="${slide.id}" onclick="window.favoritesManager?.toggleFavorite('${slide.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Render dots
        dots.innerHTML = this.featuredSlides.map((_, index) => `
            <button class="carousel-dot-tucasa ${index === 0 ? 'active' : ''}" 
                    data-index="${index}"></button>
        `).join('');

        this.updateCarousel();
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    updateCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.querySelectorAll('.carousel-dot-tucasa');
        
        if (!track) return;

        const slide = document.querySelector('.carousel-slide-tucasa');
        const slideWidth = slide?.offsetWidth || 0;
        const gap = 32; // 2rem en CSS
        const container = document.querySelector('.carousel-container-tucasa');
        const containerWidth = container?.offsetWidth || 0;
        const visibleCount = Math.max(1, Math.floor((containerWidth + gap) / (slideWidth + gap)));
        const maxIndex = Math.max(0, (this.featuredSlides.length - visibleCount));
        const translateIndex = Math.min(this.currentSlide, maxIndex);
        const translateX = -translateIndex * (slideWidth + gap);
        
        track.style.transform = `translateX(${translateX}px)`;

        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        const slide = document.querySelector('.carousel-slide-tucasa');
        const gap = 32;
        const container = document.querySelector('.carousel-container-tucasa');
        const slideWidth = slide?.offsetWidth || 0;
        const containerWidth = container?.offsetWidth || 0;
        const visibleCount = Math.max(1, Math.floor((containerWidth + gap) / (slideWidth + gap)));
        const maxIndex = Math.max(0, (this.featuredSlides.length - visibleCount));

        if (this.currentSlide >= maxIndex) {
            this.currentSlide = 0;
        } else {
            this.currentSlide += 1;
        }
        this.updateCarousel();
    }

    prevSlide() {
        const slide = document.querySelector('.carousel-slide-tucasa');
        const gap = 32;
        const container = document.querySelector('.carousel-container-tucasa');
        const slideWidth = slide?.offsetWidth || 0;
        const containerWidth = container?.offsetWidth || 0;
        const visibleCount = Math.max(1, Math.floor((containerWidth + gap) / (slideWidth + gap)));
        const maxIndex = Math.max(0, (this.featuredSlides.length - visibleCount));

        if (this.currentSlide === 0) {
            this.currentSlide = maxIndex;
        } else {
            this.currentSlide -= 1;
        }
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    setupEventListeners() {
        // Botones de navegación
        document.querySelector('.carousel-prev-tucasa')?.addEventListener('click', () => {
            this.stopAutoPlay();
            this.prevSlide();
            this.startAutoPlay();
        });

        document.querySelector('.carousel-next-tucasa')?.addEventListener('click', () => {
            this.stopAutoPlay();
            this.nextSlide();
            this.startAutoPlay();
        });

        // Dots
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-dot-tucasa')) {
                this.stopAutoPlay();
                this.goToSlide(parseInt(e.target.dataset.index));
                this.startAutoPlay();
            }
        });

        // Pausar autoplay al hover
        const carousel = document.querySelector('.carousel-container-tucasa');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Tabs de Compra/Alquiler
        document.querySelectorAll('.type-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.handleTypeTab(type);
                
                // Update active state
                document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    handleTypeTab(type) {
        // Aquí puedes filtrar las propiedades por tipo (compra/alquiler)
        console.log(`Filtrando por: ${type}`);
        // Implementar lógica de filtrado según sea necesario
    }

    getStatusText(estado) {
        const norm = (estado || '').toLowerCase().replace(/\s+/g, '_');
        const statusMap = {
            'en_venta': 'VENTA',
            'en_alquiler': 'ALQUILER', 
            'vendido': 'VENDIDO',
            'reservado': 'RESERVADO'
        };
        return statusMap[norm] || estado || '';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.carouselManager = new CarouselManagerTucasa();
    
    // También renderizar propiedades en el grid
    setTimeout(() => {
        if (window.carouselManager) {
            window.carouselManager.renderPropertiesGrid();
        }
    }, 100);
});

// Extender el carousel manager para el grid de propiedades (inicio)
    CarouselManagerTucasa.prototype.renderPropertiesGrid = function() {
        const grid = document.getElementById('properties-grid');
        if (!grid) return;

    // Mostrar solo las primeras N propiedades
    const list = this.allProperties.slice(0, this.gridVisible);
    grid.innerHTML = list.map(property => `
        <div class="property-card-tucasa">
            <div class="property-image-tucasa">
                <img src="${property.imagenes[0] || 'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 400\"><rect width=\"600\" height=\"400\" fill=\"%23dbeafe\"/><text x=\"300\" y=\"200\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"%231e3a8a\" font-size=\"24\">Imagen no disponible</text></svg>'}" alt="${property.titulo}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 400\"><rect width=\"600\" height=\"400\" fill=\"%23dbeafe\"/><text x=\"300\" y=\"200\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"%231e3a8a\" font-size=\"24\">Imagen no disponible</text></svg>';">
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
                    <span><i class="fas fa-bath"></i> ${property.banos} baños</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.metrosCuadrados} m²</span>
                </div>
                <div class="property-actions-tucasa">
                    <a href="propiedad-detalle.html?id=${property.id}" class="btn-primary-tucasa">Ver Detalles</a>
                    <button class="btn-outline-tucasa" data-property-id="${property.id}" onclick="window.favoritesManager?.toggleFavorite('${property.id}')">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Mostrar/Ocultar botón "Ver Más Propiedades" del inicio
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = this.gridVisible < this.allProperties.length ? 'inline-flex' : 'none';
        if (!loadMoreBtn.__bound) {
            loadMoreBtn.addEventListener('click', () => {
                this.gridVisible = Math.min(this.allProperties.length, this.gridVisible + this.gridPageSize);
                this.renderPropertiesGrid();
            });
            loadMoreBtn.__bound = true;
        }
    }
};
