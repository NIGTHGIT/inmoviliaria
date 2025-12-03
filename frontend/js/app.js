// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    THEME_KEY: 'tucasa_theme',
    FAVORITES_KEY: 'tucasa_favorites',
    ITEMS_PER_PAGE: 6,
    CAROUSEL_INTERVAL: 5000
};

// ============================================
// GESTOR DE TEMA
// ============================================
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem(CONFIG.THEME_KEY, this.theme);
        
        // Animación suave
        document.body.style.transition = 'none';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 50);
    }

    applyTheme() {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${this.theme}`);

        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            document.getElementById('theme-toggle').setAttribute(
                'title',
                this.theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'
            );
        }
    }
}

// ============================================
// GESTOR DE NAVEGACIÓN
// ============================================
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupScrollEffects();
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger-tucasa');
        const navMenu = document.querySelector('.nav-menu-tucasa');
        const body = document.body;

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isActive = hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevenir scroll cuando el menú está abierto
                if (isActive) {
                    body.style.overflow = 'hidden';
                } else {
                    body.style.overflow = '';
                }
            });

            // Cerrar menú al hacer clic en un enlace
            document.querySelectorAll('.nav-menu-tucasa a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    if (navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        body.style.overflow = '';
                    }
                }
            });
        }
    }

    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu-tucasa a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupScrollEffects() {
        const header = document.querySelector('.header-tucasa');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            // Añadir clase 'scrolled' cuando hay scroll
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Ocultar/mostrar header basado en dirección de scroll
            if (scrollY > 150) {
                if (scrollY > lastScrollY) {
                    header.classList.add('nav-hidden');
                } else {
                    header.classList.remove('nav-hidden');
                }
            } else {
                header.classList.remove('nav-hidden');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }
}

// ============================================
// GESTOR DE BÚSQUEDA CON TABS
// ============================================
class SearchManager {
    constructor() {
        this.propertyType = 'compra'; // Por defecto
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupSearchButton();
        this.setupAutocomplete();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.type-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remover active de todos los tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Añadir active al tab clickeado
                tab.classList.add('active');
                
                // Actualizar tipo de propiedad
                this.propertyType = tab.getAttribute('data-type');
                
                // Animación
                tab.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    tab.style.transform = '';
                }, 200);
            });
        });
    }

    setupSearchButton() {
        const searchBtn = document.querySelector('.search-btn-tucasa');
        if (!searchBtn) return;

        searchBtn.addEventListener('click', () => {
            const location = document.querySelector('.search-form-tucasa select:nth-of-type(1)')?.value || '';
            const type = document.querySelector('.search-form-tucasa select:nth-of-type(2)')?.value || '';
            const rooms = document.querySelector('.search-form-tucasa select:nth-of-type(3)')?.value || '';
            const parking = document.querySelector('.search-form-tucasa select:nth-of-type(4)')?.value || '';
            const price = document.querySelector('.search-form-tucasa select:nth-of-type(5)')?.value || '';

            const params = new URLSearchParams();
            params.set('transaction', this.propertyType);
            if (location) params.set('location', location);
            if (type) params.set('type', type);
            if (rooms) params.set('rooms', rooms);
            if (parking) params.set('parking', parking);
            if (price) params.set('maxPrice', price);

            // Animación de carga
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> BUSCANDO...';
            searchBtn.disabled = true;

            setTimeout(() => {
                window.location.href = `propiedades.html?${params.toString()}`;
            }, 500);
        });
    }

    setupAutocomplete() {
        const locationInput = document.querySelector('.search-form-tucasa select:nth-of-type(1)');
        if (!locationInput) return;

        const cities = [
            'Santo Domingo', 'Santiago', 'Punta Cana', 'La Romana', 'Puerto Plata',
            'San Cristóbal', 'San Francisco de Macorís', 'Higüey', 'Bávaro', 'Baní',
            'Bonao', 'Moca', 'Nagua', 'Samaná', 'Jarabacoa', 'Constanza', 'Barahona',
            'Azua', 'La Vega', 'San Pedro de Macorís'
        ];

        // Este código se puede expandir con un input de texto y lista de sugerencias
        // Por ahora el HTML ya tiene un select con opciones
    }
}

// ============================================
// GESTOR DE CARRUSEL MEJORADO
// ============================================
class CarouselManager {
    constructor() {
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.track = document.querySelector('.carousel-track-tucasa');
        this.slides = document.querySelectorAll('.carousel-slide-tucasa');
        this.prevBtn = document.querySelector('.carousel-prev-tucasa');
        this.nextBtn = document.querySelector('.carousel-next-tucasa');
        this.dotsContainer = document.getElementById('carousel-dots');

        if (!this.track || this.slides.length === 0) return;

        this.createDots();
        this.setupEventListeners();
        this.startAutoplay();
        this.updateCarousel();
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot-tucasa');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pausar autoplay al hacer hover
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());

        // Touch events para móviles
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                this.nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                this.previousSlide();
            }
        }, { passive: true });
    }

    goToSlide(index) {
        if (this.isTransitioning) return;

        this.currentSlide = index;
        this.updateCarousel();
        this.resetAutoplay();
    }

    nextSlide() {
        if (this.isTransitioning) return;

        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
        this.resetAutoplay();
    }

    previousSlide() {
        if (this.isTransitioning) return;

        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
        this.resetAutoplay();
    }

    updateCarousel() {
        this.isTransitioning = true;

        // Calcular desplazamiento
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 40; // 2.5rem = 40px
        const offset = -(this.currentSlide * (slideWidth + gap));

        this.track.style.transform = `translateX(${offset}px)`;

        // Actualizar dots
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot-tucasa');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, CONFIG.CAROUSEL_INTERVAL);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// ============================================
// GESTOR DE FAVORITOS
// ============================================
class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateFavoriteButtons();
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem(CONFIG.FAVORITES_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error al cargar favoritos:', e);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem(CONFIG.FAVORITES_KEY, JSON.stringify(this.favorites));
        } catch (e) {
            console.error('Error al guardar favoritos:', e);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn-tucasa')) {
                const btn = e.target.closest('.favorite-btn-tucasa');
                const propertyId = btn.dataset.propertyId;
                
                if (propertyId) {
                    this.toggleFavorite(propertyId);
                    btn.classList.toggle('active');
                    
                    // Animación
                    btn.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        btn.style.transform = '';
                    }, 300);
                }
            }
        });
    }

    toggleFavorite(propertyId) {
        const index = this.favorites.indexOf(propertyId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Eliminado de favoritos', 'info');
        } else {
            this.favorites.push(propertyId);
            this.showNotification('Añadido a favoritos', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoriteBadge();
    }

    isFavorite(propertyId) {
        return this.favorites.includes(propertyId);
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn-tucasa').forEach(btn => {
            const propertyId = btn.dataset.propertyId;
            if (propertyId && this.isFavorite(propertyId)) {
                btn.classList.add('active');
            }
        });
    }

    updateFavoriteBadge() {
        const badge = document.querySelector('.favorites-badge');
        if (badge) {
            badge.textContent = this.favorites.length;
            badge.style.display = this.favorites.length > 0 ? 'inline-flex' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ============================================
// GESTOR DE FORMULARIOS
// ============================================
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEmailJS();
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    setupEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("qHyX0bsqfanDPm8vy");
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email no válido';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Teléfono no válido';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        } else {
            field.classList.remove('error');
            this.removeFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        let errorDiv = field.parentElement.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 0.3rem;';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    removeFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupFormSubmission() {
        // Formulario de contacto general
        const contactForm = document.getElementById('contact-form-tucasa');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm, 'service_f8crp6f', 'template_ar49unm');
            });
        }

        // Formulario de cita
        const citaForm = document.getElementById('contact-form-cita');
        if (citaForm) {
            citaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(citaForm, 'service_f8crp6f', 'template_zvwaapq');
            });
        }
    }

    async handleFormSubmit(form, serviceId, templateId) {
        // Validar todos los campos
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Por favor, completa todos los campos correctamente', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            if (typeof emailjs !== 'undefined') {
                await emailjs.sendForm(serviceId, templateId, form);
                this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                form.reset();
            } else {
                throw new Error('EmailJS no está cargado');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Hubo un error al enviar el mensaje. Intenta nuevamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// ============================================
// ANIMACIONES DE SCROLL
// ============================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.property-card-tucasa, .section-header-tucasa');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// ============================================
// APLICACIÓN PRINCIPAL
// ============================================
class App {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar gestores
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.searchManager = new SearchManager();
        this.carouselManager = new CarouselManager();
        this.favoritesManager = new FavoritesManager();
        this.formManager = new FormManager();
        this.scrollAnimations = new ScrollAnimations();

        // Smooth scroll para enlaces internos
        this.setupSmoothScroll();

        // Log de inicialización
        console.log('🚀 Tropical Living RD - Aplicación inicializada con éxito');
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Añadir estilos para animaciones
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Prevenir FOUC (Flash of Unstyled Content)
window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';
});

// Funcionalidad de favoritos global
function setupGlobalFavorites() {
    // Verificar estado de favoritos en cada propiedad
    document.querySelectorAll('.property-card-tucasa').forEach(card => {
        const favoriteBtn = card.querySelector('.favorite-btn-tucasa');
        if (favoriteBtn) {
            const propertyId = card.dataset.propertyId || favoriteBtn.dataset.propertyId;
            if (propertyId) {
                // Verificar si ya está en favoritos
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                const isFavorite = favorites.some(fav => fav.id === propertyId);
                
                if (isFavorite) {
                    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    favoriteBtn.classList.add('active');
                } else {
                    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
                    favoriteBtn.classList.remove('active');
                }
                
                // Agregar evento click
                favoriteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const propertyData = {
                        id: propertyId,
                        title: card.querySelector('.property-title-tucasa')?.textContent || 'Propiedad',
                        price: card.querySelector('.property-price-tucasa')?.textContent || 'Consultar',
                        location: card.querySelector('.property-location-tucasa')?.textContent || 'Ubicación no especificada',
                        image: card.querySelector('img')?.src || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
                        type: card.querySelector('.property-badge-tucasa')?.textContent || 'propiedad',
                        rooms: card.querySelector('[data-rooms]')?.dataset.rooms || 'N/A',
                        bathrooms: card.querySelector('[data-bathrooms]')?.dataset.bathrooms || 'N/A',
                        parking: card.querySelector('[data-parking]')?.dataset.parking || 'N/A'
                    };
                    
                    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    const existingIndex = favorites.findIndex(fav => fav.id === propertyId);
                    
                    if (existingIndex !== -1) {
                        // Quitar de favoritos
                        favorites.splice(existingIndex, 1);
                        this.innerHTML = '<i class="far fa-heart"></i>';
                        this.classList.remove('active');
                        showNotification('Propiedad eliminada de favoritos', 'success');
                    } else {
                        // Agregar a favoritos
                        favorites.push({
                            ...propertyData,
                            addedDate: new Date().toISOString()
                        });
                        this.innerHTML = '<i class="fas fa-heart"></i>';
                        this.classList.add('active');
                        showNotification('Propiedad agregada a favoritos', 'success');
                    }
                    
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    
                    // Disparar evento para actualizar otras pestañas
                    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
                        detail: { favorites: favorites }
                    }));
                });
            }
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `favorite-toast ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        background: var(--bg-white);
        box-shadow: var(--shadow-xl);
        border-left: 4px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : 'var(--accent-orange)'};
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" 
               style="color: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : 'var(--accent-orange)'}; font-size: 1.2rem;"></i>
            <div>
                <strong style="color: var(--primary-blue); display: block; margin-bottom: 0.2rem;">${type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</strong>
                <span style="color: var(--text-light);">${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: var(--text-light); cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupGlobalFavorites();
    
    // Escuchar eventos de actualización de favoritos
    window.addEventListener('favoritesUpdated', (e) => {
        // Actualizar botones de favoritos en la página
        setupGlobalFavorites();
    });
});