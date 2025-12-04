// Script para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarPropiedadesDestacadas();
});

// Cargar solo 3 propiedades destacadas para la página de inicio
async function cargarPropiedadesDestacadas() {
    try {
        const response = await fetch('/api/propiedades');
        const data = await response.json();
        
        // Si no hay propiedades, mostrar algunas de ejemplo
        const todasPropiedades = data.propiedades.length > 0 ? data.propiedades : obtenerPropiedadesEjemplo();
        
        // Mostrar solo las primeras 3
        const propiedadesDestacadas = todasPropiedades.slice(0, 3);
        
        mostrarPropiedadesDestacadas(propiedadesDestacadas);
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
        mostrarPropiedadesDestacadas(obtenerPropiedadesEjemplo().slice(0, 3));
    }
}

function mostrarPropiedadesDestacadas(propiedades) {
    const container = document.getElementById('propiedades-destacadas');
    container.innerHTML = '';
    
    propiedades.forEach(propiedad => {
        const card = crearTarjetaPropiedad(propiedad);
        container.appendChild(card);
    });
}

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
