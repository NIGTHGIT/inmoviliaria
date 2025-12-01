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
}

// Inicialización de la aplicación
class App {
    constructor() {
        this.init();
    }

    init() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        
        console.log('🚀 TU Casa RD - Aplicación inicializada');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

 <script type="text/javascript">
        emailjs.init('qHyX0bsqfanDPm8vy')
    </script>


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
        });



        function initMap() {
            // Coordenadas de la oficina (puedes cambiarlas si quieres tu dirección exacta)
            const oficina = { lat: 18.473211, lng: -69.939879 }; // Ejemplo: Av Abraham Lincoln, Santo Domingo

            // Crear mapa
            const map = new google.maps.Map(document.getElementById("googleMap"), {
                zoom: 16,
                center: oficina,
                mapTypeControl: false,
                streetViewControl: false,
            });

            // Colocar marcador
            const marker = new google.maps.Marker({
                position: oficina,
                map: map,
                title: "TU Casa RD - Oficina Principal",
            });
        }
