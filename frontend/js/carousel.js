class CarouselManagerTucasa {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoPlayInterval = null;
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
            this.slides = list.map(p => ({
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
        } catch (e) {
            console.error('Error cargando propiedades del API:', e);
            this.slides = [];
        }
    }

    renderCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.getElementById('carousel-dots');

        if (!track || !dots) return;

        // Render slides
        track.innerHTML = this.slides.map((slide, index) => `
            <div class="carousel-slide-tucasa" data-index="${index}">
                <div class="property-card-tucasa">
                    <div class="property-image-tucasa">
                        <img src="${slide.imagenes[0]}" alt="${slide.titulo}">
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
                            <button class="btn-outline-tucasa" onclick="window.favoritesManager?.toggleFavorite('${slide.id}')">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Render dots
        dots.innerHTML = this.slides.map((_, index) => `
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

        const slideWidth = document.querySelector('.carousel-slide-tucasa')?.offsetWidth || 0;
        const gap = 32;
        const translateX = -this.currentSlide * (slideWidth + gap);
        
        track.style.transform = `translateX(${translateX}px)`;

        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
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

// Extender el carousel manager para el grid de propiedades
CarouselManagerTucasa.prototype.renderPropertiesGrid = function() {
    const grid = document.getElementById('properties-grid');
    if (!grid) return;

    grid.innerHTML = this.slides.map(property => `
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
                    <span><i class="fas fa-bath"></i> ${property.banos} baños</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.metrosCuadrados} m²</span>
                </div>
                <div class="property-actions-tucasa">
                    <a href="propiedad-detalle.html?id=${property.id}" class="btn-primary-tucasa">Ver Detalles</a>
                    <button class="btn-outline-tucasa" onclick="window.favoritesManager?.toggleFavorite('${property.id}')">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};
