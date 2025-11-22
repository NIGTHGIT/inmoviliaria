// Funciones comunes para todas las páginas
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecutar funciones si los elementos existen en la página
    configurarSmoothScroll();
});

// Función para crear una tarjeta de propiedad
function crearTarjetaPropiedad(propiedad) {
    const card = document.createElement('div');
    card.className = 'propiedad-card';
    
    card.innerHTML = `
        <img src="${propiedad.imagen}" alt="${propiedad.titulo}">
        <div class="propiedad-info">
            <h3>${propiedad.titulo}</h3>
            <p>${propiedad.descripcion}</p>
            <p class="precio">$${propiedad.precio.toLocaleString()}</p>
            <button class="btn-primary" onclick="verDetalle(${propiedad.id})">Ver Detalles</button>
        </div>
    `;
    
    return card;
}

// Propiedades de ejemplo
function obtenerPropiedadesEjemplo() {
    return [
        {
            id: 1,
            titulo: 'Casa Moderna',
            descripcion: '3 habitaciones, 2 baños, jardín',
            precio: 250000,
            imagen: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            titulo: 'Apartamento Céntrico',
            descripcion: '2 habitaciones, 1 baño, balcón',
            precio: 180000,
            imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            titulo: 'Villa de Lujo',
            descripcion: '5 habitaciones, 4 baños, piscina',
            precio: 850000,
            imagen: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
        }
    ];
}

// Función para ver detalle de una propiedad
function verDetalle(id) {
    alert(`Ver detalle de propiedad ID: ${id}`);
    // Aquí puedes implementar la navegación a una página de detalle
}

// Smooth scroll para los enlaces de navegación
function configurarSmoothScroll() {
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
