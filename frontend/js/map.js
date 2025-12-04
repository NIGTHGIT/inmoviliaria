class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.init();
    }

    init() {
        // Cargar Google Maps API dinámicamente
        this.loadGoogleMaps();
    }

    loadGoogleMaps() {
        // En un proyecto real, usarías tu API key de Google Maps
        // Por ahora usaremos un placeholder
        console.log('Google Maps cargado (simulación)');
    }

    showPropertyOnMap(property) {
        const mapContainer = document.getElementById('property-map');
        if (!mapContainer) return;

        // Simulación de mapa - en un proyecto real integrarías Google Maps
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: var(--bg-light);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-light);
                border-radius: 10px;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Mapa de Ubicación</h3>
                    <p>${property.ubicacion}</p>
                    <p><small>Integración con Google Maps</small></p>
                    <button onclick="openGoogleMaps(${property.lat}, ${property.lng})" 
                            class="btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-external-link-alt"></i> Abrir en Google Maps
                    </button>
                </div>
            </div>
        `;
    }

    showPropertiesOnMap(properties) {
        const mapContainer = document.getElementById('properties-map');
        if (!mapContainer) return;

        // Simulación de mapa con múltiples propiedades
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 400px;
                background: var(--bg-light);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-light);
                border-radius: 10px;
                position: relative;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Mapa Interactivo</h3>
                    <p>${properties.length} propiedades encontradas</p>
                    <p><small>Integración con Google Maps API</small></p>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                        ${properties.map(prop => `
                            <div style="
                                background: var(--bg-white);
                                padding: 0.5rem 1rem;
                                border-radius: 20px;
                                border: 2px solid var(--accent-color);
                                cursor: pointer;
                                transition: var(--transition);
                            " onclick="viewPropertyOnMap('${prop.id}')">
                                <strong>${Utils.formatPrice(prop.precio)}</strong>
                                <br>
                                <small>${prop.titulo}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Funciones globales para mapas
function openGoogleMaps(lat, lng) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
}

function viewPropertyOnMap(propertyId) {
    // Navegar a la página de detalles de la propiedad
    window.location.href = `propiedad-detalle.html?id=${propertyId}`;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new MapManager();
});