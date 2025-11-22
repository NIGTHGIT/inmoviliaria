// Script para la página de propiedades
document.addEventListener('DOMContentLoaded', () => {
    cargarTodasLasPropiedades();
});

async function cargarTodasLasPropiedades() {
    try {
        const response = await fetch('/api/propiedades');
        const data = await response.json();
        
        const propiedades = data.propiedades.length > 0 ? data.propiedades : obtenerPropiedadesEjemplo();
        
        mostrarPropiedades(propiedades);
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
        mostrarPropiedades(obtenerPropiedadesEjemplo());
    }
}

function mostrarPropiedades(propiedades) {
    const container = document.getElementById('propiedades-list');
    container.innerHTML = '';
    
    propiedades.forEach(propiedad => {
        const card = crearTarjetaPropiedad(propiedad);
        container.appendChild(card);
    });
}

function aplicarFiltros() {
    const tipo = document.getElementById('tipo-propiedad').value;
    const operacion = document.getElementById('operacion').value;
    const precioMin = document.getElementById('precio-min').value;
    const precioMax = document.getElementById('precio-max').value;
    
    console.log('Filtros aplicados:', { tipo, operacion, precioMin, precioMax });
    
    // Aquí puedes implementar la lógica de filtrado
    alert('Filtros aplicados. Esta funcionalidad se conectará con el backend.');
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
        },
        {
            id: 4,
            titulo: 'Penthouse Exclusivo',
            descripcion: '4 habitaciones, 3 baños, terraza',
            precio: 650000,
            imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            titulo: 'Casa Familiar',
            descripcion: '4 habitaciones, 2 baños, garaje',
            precio: 320000,
            imagen: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            titulo: 'Estudio Moderno',
            descripcion: '1 habitación, 1 baño, amueblado',
            precio: 120000,
            imagen: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
        }
    ];
}
