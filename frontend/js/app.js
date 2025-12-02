// Configuración global
const CONFIG = {
    THEME_KEY: 'tucasa_theme',
    FAVORITES_KEY: 'tucasa_favorites'
};

// Gestor de Tema (solo para contenido)
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
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem(CONFIG.THEME_KEY, this.theme);
    }

    applyTheme() {
        // Aplicar tema solo al contenido principal, no al header ni footer
        const mainContent = document.querySelector('main');
        const sections = document.querySelectorAll('section');
        const propertyCards = document.querySelectorAll('.property-card-tucasa');

        // Remover tema anterior
        document.body.classList.remove('theme-light', 'theme-dark');
        if (mainContent) mainContent.classList.remove('theme-light', 'theme-dark');
        sections.forEach(section => section.classList.remove('theme-light', 'theme-dark'));
        propertyCards.forEach(card => card.classList.remove('theme-light', 'theme-dark'));

        // Aplicar nuevo tema solo al contenido
        document.body.classList.add(`theme-${this.theme}`);
        if (mainContent) mainContent.classList.add(`theme-${this.theme}`);
        sections.forEach(section => section.classList.add(`theme-${this.theme}`));
        propertyCards.forEach(card => card.classList.add(`theme-${this.theme}`));

        // Actualizar icono
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Gestor de Navegación Móvil
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupHideOnScroll();
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger-tucasa');
        const navMenu = document.querySelector('.nav-menu-tucasa');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Cerrar menú al hacer clic en un enlace
            document.querySelectorAll('.nav-menu-tucasa a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
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

    setupHideOnScroll() {
        const header = document.querySelector('.header-tucasa');
        if (!header) return;

        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            const scrollingDown = y > lastY;

            if (y > 100 && scrollingDown) {
                header.classList.add('nav-hidden');
            } else {
                header.classList.remove('nav-hidden');
            }

            lastY = y;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }
}

// Inicialización de la aplicación
class App {
    constructor() {
        this.init();
    }

    init() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.setupHomeSearch();
        this.setupAutocomplete('home-search-location');
        this.setupAutocomplete('filter-location');
        this.setupProjectCTA();
        this.setupContactPrefill();

        console.log('🚀 TU Casa RD - Aplicación inicializada');
    }

    setupHomeSearch() {
        const btn = document.getElementById('home-search-button');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const loc = document.getElementById('home-search-location')?.value || '';
            const tipo = document.getElementById('home-search-type')?.value || '';
            const rooms = document.getElementById('home-search-rooms')?.value || '';
            const parq = document.getElementById('home-search-parking')?.value || '';
            const max = document.getElementById('home-search-price')?.value || '';

            const params = new URLSearchParams();
            if (loc) params.set('loc', loc);
            if (tipo) params.set('tipo', tipo);
            if (rooms) params.set('rooms', rooms);
            if (parq) params.set('parq', parq);
            if (max) params.set('max', max);
            params.set('from', 'home');

            window.location.href = `propiedades.html?${params.toString()}`;
        });
    }

    setupAutocomplete(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const cities = [
            'Santo Domingo', 'Santiago', 'Punta Cana', 'La Romana', 'Puerto Plata',
            'San Cristóbal', 'San Francisco de Macorís', 'Higüey', 'Bávaro', 'Baní',
            'Bonao', 'Moca', 'Nagua', 'Samaná', 'Jarabacoa', 'Constanza', 'Barahona',
            'Azua', 'La Vega', 'San Pedro de Macorís', 'Hato Mayor', 'Monte Plata',
            'Mao', 'Monte Cristi', 'Dajabón', 'Pedernales', 'Neyba', 'Jimaní',
            'Salcedo', 'Villa Altagracia', 'Bayaguana', 'Cabrera', 'Sosúa', 'Cabarete'
        ];

        const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        const list = document.createElement('div');
        list.className = 'autocomplete-list';
        input.parentElement.appendChild(list);

        const render = (matches) => {
            if (!matches.length) {
                list.innerHTML = '';
                list.style.display = 'none';
                return;
            }
            list.innerHTML = matches.map(c => `<div class="autocomplete-item">${c}</div>`).join('');
            list.style.display = 'block';
            list.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    input.value = item.textContent;
                    list.style.display = 'none';
                });
            });
        };

        input.addEventListener('input', () => {
            const q = input.value.trim();
            if (q.length < 2) { list.style.display = 'none'; return; }
            const nq = norm(q);
            const matches = cities.filter(c => norm(c).includes(nq)).slice(0, 8);
            render(matches);
        });

        input.addEventListener('blur', () => {
            setTimeout(() => { list.style.display = 'none'; }, 150);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) {
                const nq = norm(input.value.trim());
                const matches = cities.filter(c => norm(c).includes(nq)).slice(0, 8);
                render(matches);
            }
        });
    }

    setupProjectCTA() {
        const buttons = document.querySelectorAll('.project-action');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                if (action === 'info') return;
                const project = btn.getAttribute('data-project') || '';
                const params = new URLSearchParams({ from: 'proyectos', type: action || 'cita', project });
                window.location.href = `contacto.html?${params.toString()}`;
            });
        });
    }

    setupContactPrefill() {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'contacto.html') return;

        const q = new URLSearchParams(window.location.search);
        const type = q.get('type');
        const project = q.get('project');

        const mensajeTab = document.getElementById('tab-mensaje');
        const citaTab = document.getElementById('tab-cita');
        if (!mensajeTab || !citaTab) return;

        // Reset active
        mensajeTab.classList.remove('active');
        citaTab.classList.remove('active');

        if (type === 'cita') {
            citaTab.classList.add('active');
            // Prefill mensaje adicional
            const citaMsg = document.querySelector('#contact-form-cita textarea[name="mensaje"]');
            if (citaMsg && project) {
                citaMsg.value = `Me interesa agendar una visita al proyecto: ${project}`;
            }
            // Prefill agente select hint optional (no change)
            const container = document.querySelector('.contact-page-content');
            if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            mensajeTab.classList.add('active');
            // Prefill motivo y mensaje
            const motivo = document.querySelector('#contact-form-general select[name="motivo"]');
            if (motivo) motivo.value = 'proyecto';
            const msg = document.querySelector('#contact-form-general textarea[name="mensaje"]');
            if (msg && project) {
                msg.value = `Quiero más información sobre el proyecto: ${project}`;
            }
            const container = document.querySelector('.contact-page-content');
            if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});


// API de EMAIL

emailjs.init("qHyX0bsqfanDPm8vy"); // Public Key
document.getElementById('contact-form-cita').addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm("service_f8crp6f", "template_zvwaapq", this)
        .then(() => {
            alert('¡Tu mensaje fue enviado correctamente! Te contactaremos pronto.');
            this.reset();
        })
        .catch((err) => {
            console.error(err);
            alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
        });
});

document.getElementById('contact-form-general').addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm("service_f8crp6f", "template_ar49unm", this)
        .then(() => {
            alert('¡Tu mensaje fue enviado correctamente! Te contactaremos pronto.');
            this.reset();
        })
        .catch((err) => {
            console.error(err);
            alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
        });
    })

    document.getElementById('contact-form-tucasa').addEventListener('submit', function (e) {
        e.preventDefault();

        emailjs.sendForm("service_f8crp6f", "template_ar49unm", this)
            .then(() => {
                alert('¡Tu mensaje fue enviado correctamente! Te contactaremos pronto.');
                this.reset();
            })
            .catch((err) => {
                console.error(err);
                alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
            });
    });



    // Bloquear fechas anteriores a hoy
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("date-input").setAttribute("min", hoy);

    // Limitar la hora permitida (9:00 AM – 4:00 PM)
    const timeInput = document.getElementById("time-input");

    timeInput.addEventListener("change", () => {
        let time = timeInput.value;
        if (time < "09:00") timeInput.value = "09:00";
        if (time > "16:00") timeInput.value = "16:00";
    })
