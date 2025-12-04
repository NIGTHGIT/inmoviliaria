// API Configuration and Utility Functions
class API {
    constructor() {
        this.baseURL = 'https://api.tucasard.com';
        this.endpoints = {
            properties: '/properties',
            projects: '/projects',
            contact: '/contact',
            favorites: '/favorites'
        };
    }

    async fetchProperties(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${this.baseURL}${this.endpoints.properties}?${queryString}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching properties:', error);
            // Return sample data if API fails
            return this.getSampleProperties();
        }
    }

    async fetchProjects() {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.projects}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

    async submitContact(formData) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.contact}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error submitting contact:', error);
            throw error;
        }
    }

    getSampleProperties() {
        return [
            {
                id: '1',
                title: 'Hermosa Casa en Piantini',
                price: 'US$ 450,000',
                location: 'Piantini, Santo Domingo',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                type: 'casa',
                rooms: 4,
                bathrooms: 3,
                area: '350',
                parking: 2,
                description: 'Hermosa casa familiar en una de las mejores zonas de Santo Domingo. Amplios espacios, diseño moderno y todas las comodidades.',
                features: ['Piscina', 'Jardín', 'Cocina equipada', 'Área de lavado', 'Estacionamiento techado']
            },
            // Agregar más propiedades de ejemplo...
        ];
    }

    // Cache management
    cacheData(key, data, ttl = 3600000) { // 1 hour default
        const cacheItem = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };
        localStorage.setItem(key, JSON.stringify(cacheItem));
    }

    getCachedData(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const cacheItem = JSON.parse(cached);
        const now = Date.now();

        if (now - cacheItem.timestamp > cacheItem.ttl) {
            localStorage.removeItem(key);
            return null;
        }

        return cacheItem.data;
    }
}

// Initialize API instance
window.API = new API();