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
        // Datos de ejemplo para República Dominicana
        this.slides = [
            {
                id: 'prop_rd_1',
                titulo: 'Villa de Lujo en Punta Cana',
                precio: 450000,
                ubicacion: 'Punta Cana, La Altagracia',
                imagenes: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600'],
                tipo: 'villa',
                estado: 'en_venta',
                habitaciones: 5,
                banios: 4,
                metrosCuadrados: 320,
                caracteristicas: ['Pileta', 'Playa Privada', 'Vista al Mar']
            },
            {
                id: 'prop_rd_2',
                titulo: 'Apartamento en Santo Domingo Este',
                precio: 185000,
                ubicacion: 'Santo Domingo Este',
                imagenes: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'],
                tipo: 'apartamento',
                estado: 'en_venta',
                habitaciones: 3,
                banios: 2,
                metrosCuadrados: 110,
                caracteristicas: ['Amenities', 'Seguridad 24/7', 'Parqueo']
            },
            {
                id: 'prop_rd_3',
                titulo: 'Casa Familiar en Santiago',
                precio: 220000,
                ubicacion: 'Santiago de los Caballeros',
                imagenes: ['https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600'],
                tipo: 'casa',
                estado: 'en_venta',
                habitaciones: 4,
                banios: 3,
                metrosCuadrados: 180,
                caracteristicas: ['Jardín', 'Cochera', 'Terraza']
            },
            {
                id: 'prop_rd_4',
                titulo: 'Local Comercial en Boca Chica',
                precio: 150000,
                ubicacion: 'Boca Chica, Santo Domingo',
                imagenes: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600'],
                tipo: 'local',
                estado: 'en_venta',
                habitaciones: 1,
                banios: 1,
                metrosCuadrados: 85,
                caracteristicas: ['Alta Circulación', 'Vidriera', 'A/C']
            }
        ];
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
                            <span><i class="fas fa-bath"></i> ${slide.banios} baños</span>
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
        const statusMap = {
            'en_venta': 'VENTA',
            'en_alquiler': 'ALQUILER', 
            'vendido': 'VENDIDO',
            'reservado': 'RESERVADO'
        };
        return statusMap[estado] || estado;
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
                    <span><i class="fas fa-bath"></i> ${property.banios} baños</span>
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