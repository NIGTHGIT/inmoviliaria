// Main Application JavaScript - TU Casa RD
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // THEME MANAGEMENT
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('theme-dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    
    // Toggle theme
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
    
    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const hamburger = document.querySelector('.hamburger-tucasa');
    const navMenu = document.querySelector('.nav-menu-tucasa');
    
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && 
            !e.target.closest('.nav-menu-tucasa') && 
            !e.target.closest('.hamburger-tucasa')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-menu-tucasa a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    let lastScroll = 0;
    const header = document.querySelector('.header-tucasa');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header?.classList.remove('nav-hidden', 'scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll down
            header?.classList.add('nav-hidden');
        } else {
            // Scroll up
            header?.classList.remove('nav-hidden');
        }
        
        if (currentScroll > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // HERO SEARCH FUNCTIONALITY (ON SAME PAGE)
    // ============================================
    initHeroSearch();
    
    // ============================================
    // PROPERTY GRID FOR INDEX PAGE
    // ============================================
    if (document.querySelector('.properties-grid-modern-tucasa') && !document.getElementById('properties-grid')) {
        // Initialize with all properties first
        window.allProperties = [];
        initPropertyGrid();
    }
    
    // ============================================
    // FEATURED CAROUSEL
    // ============================================
    if (document.querySelector('.carousel-track-tucasa')) {
        initFeaturedCarousel();
    }
    
    // ============================================
    // CONTACT FORM
    // ============================================
    if (document.getElementById('contactFormIndex')) {
        initContactForm();
    }
    
    // ============================================
    // FAVORITES FUNCTIONALITY
    // ============================================
    initFavorites();
    
    // ============================================
    // LOAD MORE BUTTON
    // ============================================
    initLoadMore();
    
    // ============================================
    // INITIALIZE WHATSAPP BUTTON
    // ============================================
    initWhatsAppButton();
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    initSmoothScroll();
});

// ============================================
// HERO SEARCH FUNCTIONALITY (FILTER ON SAME PAGE)
// ============================================

function initHeroSearch() {
    const searchForm = document.querySelector('.search-form-tucasa');
    const searchBtn = document.querySelector('.search-btn-tucasa');
    const typeTabs = document.querySelectorAll('.type-tab');
    
    if (!searchForm) return;
    
    let searchType = 'compra'; // Default
    
    // Handle tabs
    typeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            typeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            searchType = tab.dataset.type;
            updateSearchButtonText();
            
            // Apply filters immediately when tab changes
            applyHeroFilters();
        });
    });
    
    // Update button text
    function updateSearchButtonText() {
        if (searchBtn) {
            searchBtn.innerHTML = `<i class="fas fa-search"></i> BUSCAR PROPIEDADES PARA ${searchType.toUpperCase()}`;
        }
    }
    
    updateSearchButtonText();
    
    // Handle form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyHeroFilters();
    });
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyHeroFilters();
        });
    }
    
    // Add autocomplete
    initLocationAutocomplete();
    
    // Apply filters when any select changes
    searchForm.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            applyHeroFilters();
        });
        
        // Enter key support
        select.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyHeroFilters();
            }
        });
    });
}

function applyHeroFilters() {
    const searchForm = document.querySelector('.search-form-tucasa');
    const activeTab = document.querySelector('.type-tab.active');
    
    // Get search values
    const selects = searchForm.querySelectorAll('select');
    const searchData = {
        type: activeTab?.dataset.type || 'compra',
        location: selects[0]?.value || '',
        propertyType: selects[1]?.value || '',
        rooms: selects[2]?.value || '',
        parking: selects[3]?.value || '',
        maxPrice: selects[4]?.value || ''
    };

    // Save search history
    saveSearchHistory(searchData);
    
    // Show feedback
    showSearchFeedback(searchData);
    
    // Filter properties on the same page
    filterPropertiesOnPage(searchData);
}

function filterPropertiesOnPage(searchData) {
    if (!window.allProperties || window.allProperties.length === 0) {
        console.warn('No hay propiedades cargadas para filtrar');
        return;
    }
    
    // Filter properties based on search criteria
    const filteredProperties = window.allProperties.filter(property => {
        // Filter by type (compra/alquiler)
        if (searchData.type === 'alquiler' && !property.isForRent) {
            return false;
        }
        if (searchData.type === 'compra' && property.isForRent) {
            return false;
        }
        
        // Filter by location
        if (searchData.location && searchData.location !== 'Todas las ubicaciones') {
            if (!property.location.toLowerCase().includes(searchData.location.toLowerCase())) {
                return false;
            }
        }
        
        // Filter by property type
        if (searchData.propertyType && searchData.propertyType !== 'Todos los tipos') {
            if (property.type !== searchData.propertyType) {
                return false;
            }
        }
        
        // Filter by rooms
        if (searchData.rooms && searchData.rooms !== 'Cualquier cantidad') {
            const minRooms = parseInt(searchData.rooms);
            if (!property.rooms || property.rooms < minRooms) {
                return false;
            }
        }
        
        // Filter by parking
        if (searchData.parking && searchData.parking !== 'Cualquier cantidad') {
            const minParking = parseInt(searchData.parking);
            if (!property.parking || property.parking < minParking) {
                return false;
            }
        }
        
        // Filter by price
        if (searchData.maxPrice && searchData.maxPrice !== 'Cualquier precio') {
            const maxPriceValue = parseInt(searchData.maxPrice);
            const propertyPrice = extractPriceNumber(property.price);
            
            if (propertyPrice > maxPriceValue) {
                return false;
            }
        }
        
        return true;
    });
    
    // Update the property grid with filtered results
    updatePropertyGrid(filteredProperties);
    
    // Show results count
    updateResultsCount(filteredProperties.length);
}

function extractPriceNumber(priceString) {
    if (!priceString) return 0;
    const match = priceString.match(/[\d,]+/);
    if (match) {
        return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
}

function updatePropertyGrid(filteredProperties) {
    const gridContainer = document.querySelector('.properties-grid-modern-tucasa');
    if (!gridContainer) return;
    
    if (filteredProperties.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-state-tucasa" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search"></i>
                <h3>No se encontraron propiedades</h3>
                <p>No hay propiedades que coincidan con tu búsqueda. Intenta con otros filtros.</p>
                <button class="btn-primary-tucasa" onclick="clearHeroFilters()">
                    <i class="fas fa-times"></i> Limpiar Filtros
                </button>
            </div>
        `;
        return;
    }
    
    // Show only first 6 properties on index (or all if less than 6)
    const propertiesToShow = filteredProperties.slice(0, 6);
    gridContainer.innerHTML = propertiesToShow.map(property => createPropertyCard(property)).join('');
    
    // Update "Ver Todas las Propiedades" button
    updateViewAllButton(filteredProperties.length);
    
    // Re-initialize favorite buttons and detail buttons
    initFavoriteButtons();
    initDetailButtons();
}

function updateResultsCount(count) {
    const sectionHeader = document.querySelector('.section-header-tucasa');
    if (!sectionHeader) return;
    
    let resultsCountElement = sectionHeader.querySelector('.results-count');
    if (!resultsCountElement) {
        resultsCountElement = document.createElement('span');
        resultsCountElement.className = 'results-count';
        resultsCountElement.style.cssText = `
            display: inline-block;
            background: var(--accent-orange);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-left: 1rem;
            vertical-align: middle;
        `;
        sectionHeader.querySelector('h2').appendChild(resultsCountElement);
    }
    
    resultsCountElement.textContent = `${count} resultados`;
}

function updateViewAllButton(totalProperties) {
    const viewAllButton = document.querySelector('.btn-primary-tucasa[href="propiedades.html"]');
    if (!viewAllButton) return;
    
    if (totalProperties > 6) {
        viewAllButton.innerHTML = `<i class="fas fa-list"></i> Ver Todas las ${totalProperties} Propiedades`;
    } else {
        viewAllButton.innerHTML = `<i class="fas fa-list"></i> Ver Todas las Propiedades`;
    }
    
    // Update href with current filters
    const searchForm = document.querySelector('.search-form-tucasa');
    const activeTab = document.querySelector('.type-tab.active');
    const selects = searchForm.querySelectorAll('select');
    
    const params = new URLSearchParams();
    if (activeTab?.dataset.type) params.append('tipo', activeTab.dataset.type);
    if (selects[0]?.value && selects[0].value !== 'Todas las ubicaciones') params.append('ubicacion', selects[0].value);
    if (selects[1]?.value && selects[1].value !== 'Todos los tipos') params.append('propiedad', selects[1].value);
    if (selects[2]?.value && selects[2].value !== 'Cualquier cantidad') params.append('habitaciones', selects[2].value);
    if (selects[3]?.value && selects[3].value !== 'Cualquier cantidad') params.append('parqueos', selects[3].value);
    if (selects[4]?.value && selects[4].value !== 'Cualquier precio') params.append('precio', selects[4].value);
    
    viewAllButton.href = `propiedades.html?${params.toString()}`;
}

function clearHeroFilters() {
    const searchForm = document.querySelector('.search-form-tucasa');
    if (!searchForm) return;
    
    // Reset all selects to default values
    searchForm.querySelectorAll('select').forEach(select => {
        select.value = '';
        
        // Set first option as selected
        if (select.options.length > 0) {
            select.selectedIndex = 0;
        }
    });
    
    // Set compra tab as active
    const compraTab = document.querySelector('.type-tab[data-type="compra"]');
    const alquilerTab = document.querySelector('.type-tab[data-type="alquiler"]');
    if (compraTab && alquilerTab) {
        compraTab.classList.add('active');
        alquilerTab.classList.remove('active');
    }
    
    // Update button text
    const searchBtn = document.querySelector('.search-btn-tucasa');
    if (searchBtn) {
        searchBtn.innerHTML = '<i class="fas fa-search"></i> BUSCAR PROPIEDADES PARA COMPRA';
    }
    
    // Show all properties
    if (window.allProperties && window.allProperties.length > 0) {
        updatePropertyGrid(window.allProperties.slice(0, 6));
        updateResultsCount(window.allProperties.length);
        updateViewAllButton(window.allProperties.length);
        
        // Remove results count if showing all
        const resultsCountElement = document.querySelector('.results-count');
        if (resultsCountElement) {
            resultsCountElement.remove();
        }
    }
    
    showNotification('Filtros limpiados. Mostrando todas las propiedades.', 'info');
}

// Make clearHeroFilters available globally
window.clearHeroFilters = clearHeroFilters;

function saveSearchHistory(searchData) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    searchHistory.unshift(searchData);
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function showSearchFeedback(searchData) {
    const feedbackMessage = createSearchFeedbackMessage(searchData);
    showNotification(feedbackMessage, 'info');
    
    const searchBtn = document.querySelector('.search-btn-tucasa');
    if (searchBtn) {
        const originalHtml = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> FILTRANDO...';
        searchBtn.disabled = true;
        
        setTimeout(() => {
            searchBtn.innerHTML = originalHtml;
            searchBtn.disabled = false;
        }, 500);
    }
}

function createSearchFeedbackMessage(searchData) {
    const messages = [];
    
    if (searchData.location && searchData.location !== 'Todas las ubicaciones') {
        messages.push(`Ubicación: ${searchData.location}`);
    }
    
    if (searchData.propertyType && searchData.propertyType !== 'Todos los tipos') {
        messages.push(`Tipo: ${searchData.propertyType}`);
    }
    
    if (searchData.rooms && searchData.rooms !== 'Cualquier cantidad') {
        messages.push(`Habitaciones: ${searchData.rooms}+`);
    }
    
    if (searchData.maxPrice && searchData.maxPrice !== 'Cualquier precio') {
        const price = parseInt(searchData.maxPrice);
        messages.push(`Precio máximo: US$ ${price.toLocaleString()}`);
    }
    
    const typeText = searchData.type === 'compra' ? 'compra' : 'alquiler';
    
    if (messages.length > 0) {
        return `Filtrando propiedades para ${typeText} - ${messages.join(', ')}`;
    } else {
        return `Mostrando todas las propiedades para ${typeText}`;
    }
}

function initLocationAutocomplete() {
    const locationSelect = document.querySelector('.search-form-tucasa select:first-of-type');
    if (!locationSelect) return;
    
    // Add dynamic loading
    locationSelect.addEventListener('focus', () => {
        loadLocationSuggestions(locationSelect);
    });
    
    // Add "Other location" option
    const otherOption = document.createElement('option');
    otherOption.value = 'otro';
    otherOption.textContent = 'Otra ubicación...';
    locationSelect.appendChild(otherOption);
    
    locationSelect.addEventListener('change', (e) => {
        if (e.target.value === 'otro') {
            showCustomLocationInput(locationSelect);
        }
    });
}

function loadLocationSuggestions(selectElement) {
    const locations = [
        { value: 'Santo Domingo', text: 'Santo Domingo' },
        { value: 'Distrito Nacional', text: 'Distrito Nacional' },
        { value: 'Punta Cana', text: 'Punta Cana' },
        { value: 'Bávaro', text: 'Bávaro' },
        { value: 'Santiago', text: 'Santiago' },
        { value: 'Puerto Plata', text: 'Puerto Plata' },
        { value: 'La Romana', text: 'La Romana' },
        { value: 'San Pedro de Macorís', text: 'San Pedro de Macorís' },
        { value: 'Samaná', text: 'Samaná' },
        { value: 'Las Terrenas', text: 'Las Terrenas' },
        { value: 'Juan Dolio', text: 'Juan Dolio' },
        { value: 'Boca Chica', text: 'Boca Chica' },
        { value: 'Jarabacoa', text: 'Jarabacoa' },
        { value: 'Constanza', text: 'Constanza' },
        { value: 'Higüey', text: 'Higüey' }
    ];
    
    // Add options if they don't exist
    if (selectElement.children.length <= 2) {
        locations.forEach(location => {
            if (!Array.from(selectElement.options).some(opt => opt.value === location.value)) {
                const option = document.createElement('option');
                option.value = location.value;
                option.textContent = location.text;
                selectElement.appendChild(option);
            }
        });
    }
}

function showCustomLocationInput(selectElement) {
    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.className = 'custom-location-input';
    customInput.placeholder = 'Escribe tu ubicación específica...';
    customInput.style.cssText = `
        width: 100%;
        padding: 0.8rem;
        margin-top: 0.5rem;
        border: 2px solid var(--accent-orange);
        border-radius: var(--radius);
        font-size: 1rem;
        animation: slideDown 0.3s ease;
    `;
    
    selectElement.parentNode.insertBefore(customInput, selectElement.nextSibling);
    customInput.focus();
    
    customInput.addEventListener('blur', () => {
        if (customInput.value.trim()) {
            const newOption = document.createElement('option');
            newOption.value = customInput.value.trim();
            newOption.textContent = customInput.value.trim();
            selectElement.insertBefore(newOption, selectElement.lastChild);
            selectElement.value = newOption.value;
            
            // Apply filters immediately after adding new location
            setTimeout(() => applyHeroFilters(), 100);
        }
        customInput.remove();
    });
    
    customInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            customInput.blur();
        }
    });
}

// ============================================
// PROPERTY GRID FOR INDEX PAGE
// ============================================

async function initPropertyGrid() {
    const gridContainer = document.querySelector('.properties-grid-modern-tucasa');
    if (!gridContainer) return;
    
    try {
        gridContainer.innerHTML = '<p class="loading">Cargando propiedades...</p>';
        
        let properties = await loadProperties();
        
        // Store all properties globally for filtering
        window.allProperties = properties;
        
        if (properties.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state-tucasa" style="grid-column: 1/-1;">
                    <i class="fas fa-home"></i>
                    <h3>No hay propiedades disponibles</h3>
                    <p>Pronto tendremos nuevas propiedades</p>
                </div>
            `;
            return;
        }
        
        // Show only first 6 properties on index
        const propertiesToShow = properties.slice(0, 6);
        gridContainer.innerHTML = propertiesToShow.map(property => createPropertyCard(property)).join('');
        
        // Update view all button
        updateViewAllButton(properties.length);
        
        initFavoriteButtons();
        initDetailButtons();
        
    } catch (error) {
        console.error('Error loading properties:', error);
        gridContainer.innerHTML = `
            <div class="empty-state-tucasa" style="grid-column: 1/-1;">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error al cargar propiedades</h3>
                <p>Por favor, intenta de nuevo más tarde</p>
            </div>
        `;
    }
}

async function loadProperties() {
    // Try cache first
    const cached = localStorage.getItem('properties_cache');
    if (cached) {
        const cacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp < 3600000) {
            return cacheData.data;
        }
    }
    
    try {
        // Try API
        const response = await fetch('https://api.tucasard.com/properties');
        if (response.ok) {
            const properties = await response.json();
            localStorage.setItem('properties_cache', JSON.stringify({
                data: properties,
                timestamp: Date.now()
            }));
            return properties;
        }
    } catch (error) {
        console.warn('API no disponible, usando datos de ejemplo');
    }
    
    // Use sample data with both compra and alquiler properties
    return getSampleProperties();
}

function getSampleProperties() {
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
            isForRent: false,
            description: 'Hermosa casa familiar en una de las mejores zonas de Santo Domingo.',
            features: ['Piscina', 'Jardín', 'Cocina equipada']
        },
        {
            id: '2',
            title: 'Apartamento Moderno en Naco',
            price: 'US$ 285,000',
            location: 'Naco, Santo Domingo',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
            type: 'apartamento',
            rooms: 3,
            bathrooms: 2,
            area: '180',
            parking: 1,
            isForRent: false,
            description: 'Apartamento moderno con vista panorámica.',
            features: ['Terraza', 'Gimnasio', 'Piscina']
        },
        {
            id: '3',
            title: 'Villa de Lujo en Punta Cana',
            price: 'US$ 1,200,000',
            location: 'Punta Cana',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
            type: 'villa',
            rooms: 5,
            bathrooms: 4,
            area: '650',
            parking: 3,
            isForRent: false,
            description: 'Villa de lujo frente al mar con acceso privado a playa.',
            features: ['Playa privada', 'Piscina infinita', 'Jardín tropical']
        },
        {
            id: '4',
            title: 'Penthouse en Bella Vista',
            price: 'US$ 2,500/mes',
            location: 'Bella Vista, Santo Domingo',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
            type: 'penthouse',
            rooms: 4,
            bathrooms: 3,
            area: '320',
            parking: 2,
            isForRent: true,
            description: 'Penthouse exclusivo con terraza y vista 360°.',
            features: ['Terraza 360°', 'Jacuzzi', 'Vista panorámica']
        },
        {
            id: '5',
            title: 'Casa en Condominio Cerrado',
            price: 'US$ 1,800/mes',
            location: 'Los Cacicazgos, Santo Domingo',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
            type: 'casa',
            rooms: 3,
            bathrooms: 2.5,
            area: '280',
            parking: 2,
            isForRent: true,
            description: 'Casa en condominio con seguridad 24/7 y áreas comunes.',
            features: ['Seguridad 24/7', 'Áreas verdes', 'Salón social']
        },
        {
            id: '6',
            title: 'Terreno Residencial en Santiago',
            price: 'US$ 150,000',
            location: 'Santiago de los Caballeros',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
            type: 'terreno',
            area: '1200',
            isForRent: false,
            description: 'Terreno plano ideal para construcción residencial.',
            features: ['Ubicación estratégica', 'Servicios básicos', 'Acceso pavimentado']
        },
        {
            id: '7',
            title: 'Apartamento Amueblado en Zona Colonial',
            price: 'US$ 1,200/mes',
            location: 'Zona Colonial, Santo Domingo',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
            type: 'apartamento',
            rooms: 2,
            bathrooms: 1,
            area: '85',
            parking: 0,
            isForRent: true,
            description: 'Apartamento completamente amueblado en el corazón de la Zona Colonial.',
            features: ['Completamente amueblado', 'Aire acondicionado', 'Wi-Fi incluido']
        },
        {
            id: '8',
            title: 'Casa Familiar en Gazcue',
            price: 'US$ 380,000',
            location: 'Gazcue, Santo Domingo',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
            type: 'casa',
            rooms: 3,
            bathrooms: 2,
            area: '220',
            parking: 1,
            isForRent: false,
            description: 'Casa familiar en zona residencial tranquila cerca del Malecón.',
            features: ['Patio trasero', 'Cocina remodelada', 'Seguridad']
        }
    ];
}

function createPropertyCard(property) {
    // Determine badge color based on type
    const badgeColor = property.isForRent ? 'alquiler' : 'venta';
    const badgeText = property.isForRent ? 'Alquiler' : 'Venta';
    
    return `
        <div class="property-card-tucasa" data-id="${property.id}" data-type="${property.type}" data-operation="${badgeColor}">
            <div class="property-image-tucasa">
                <img src="${property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                     alt="${property.title}"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
                <div class="property-badge-tucasa ${badgeColor}">${badgeText}</div>
                <button class="favorite-btn-tucasa" data-id="${property.id}">
                    <i class="far fa-heart"></i>
                </button>
                <div class="property-price-tucasa">${property.price || 'Consultar'}</div>
            </div>
            <div class="property-info-tucasa">
                <h3 class="property-title-tucasa">${property.title}</h3>
                <p class="property-location-tucasa">
                    <i class="fas fa-map-marker-alt"></i> ${property.location || 'Ubicación no especificada'}
                </p>
                <div class="property-features-tucasa">
                    ${property.rooms ? `<span><i class="fas fa-bed"></i> ${property.rooms} hab</span>` : ''}
                    ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} baños</span>` : ''}
                    ${property.parking ? `<span><i class="fas fa-car"></i> ${property.parking} parq</span>` : ''}
                    ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area} m²</span>` : ''}
                </div>
                <div class="property-actions-tucasa">
                    <a href="detalle-propiedad.html?id=${property.id}" class="btn-primary-tucasa">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </a>
                    <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20la%20propiedad%20${encodeURIComponent(property.title)}" 
                       class="btn-outline-tucasa" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// AGREGAR ESTOS ESTILOS A TU CSS
// ============================================

// Agrega estos estilos al final de tu styles.css
const heroFilterStyles = `
/* Estilos para el filtro en el index */
.property-badge-tucasa.alquiler {
    background: var(--secondary-blue) !important;
}

.property-badge-tucasa.venta {
    background: var(--accent-orange) !important;
}

.results-count {
    animation: fadeIn 0.3s ease;
}

.search-form-tucasa .search-group select {
    transition: all 0.3s ease;
}

.search-form-tucasa .search-group select:focus {
    border-color: var(--accent-orange);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    transform: translateY(-2px);
}

.clear-filters-btn {
    margin-top: 1rem;
    width: 100%;
    background: var(--bg-light) !important;
    color: var(--text-dark) !important;
    border: 2px solid var(--border-color) !important;
}

.clear-filters-btn:hover {
    background: var(--border-color) !important;
    border-color: var(--text-light) !important;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Estilos para el estado de carga */
.search-btn-tucasa.loading {
    position: relative;
    overflow: hidden;
}

.search-btn-tucasa.loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: loadingShimmer 1.5s infinite;
}

@keyframes loadingShimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

/* Responsive para el filtro */
@media (max-width: 768px) {
    .search-form-tucasa {
        padding: 1rem !important;
    }
    
    .search-row {
        grid-template-columns: 1fr !important;
        gap: 0.8rem !important;
    }
    
    .search-group label {
        font-size: 0.85rem !important;
    }
    
    .search-group select {
        font-size: 0.9rem !important;
        padding: 0.7rem !important;
    }
    
    .results-count {
        display: block !important;
        margin: 0.5rem 0 0 0 !important;
        width: fit-content;
    }
}
`;

// Inject styles into the document
function injectHeroFilterStyles() {
    if (!document.querySelector('#hero-filter-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'hero-filter-styles';
        styleEl.textContent = heroFilterStyles;
        document.head.appendChild(styleEl);
    }
}

// Call this function in your DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    injectHeroFilterStyles();
});


function initFavoriteButtons() {
    const favoriteBtns = document.querySelectorAll('.favorite-btn-tucasa');
    favoriteBtns.forEach(btn => {
        const propertyId = btn.dataset.id;
        const isFavorite = checkIfFavorite(propertyId);
        
        if (isFavorite) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(propertyId, btn);
        });
    });
}

function checkIfFavorite(propertyId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === propertyId);
}

function toggleFavorite(propertyId, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const property = getPropertyById(propertyId);
    
    if (!property) return;
    
    const existingIndex = favorites.findIndex(fav => fav.id === propertyId);
    
    if (existingIndex === -1) {
        favorites.push(property);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.classList.add('active');
        showNotification('Propiedad agregada a favoritos', 'success');
    } else {
        favorites.splice(existingIndex, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.classList.remove('active');
        showNotification('Propiedad eliminada de favoritos', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function getPropertyById(propertyId) {
    const propertyCard = document.querySelector(`.property-card-tucasa[data-id="${propertyId}"]`);
    if (propertyCard) {
        return {
            id: propertyId,
            title: propertyCard.querySelector('.property-title-tucasa')?.textContent || '',
            price: propertyCard.querySelector('.property-price-tucasa')?.textContent || '',
            location: propertyCard.querySelector('.property-location-tucasa')?.textContent?.replace('📍', '').trim() || '',
            image: propertyCard.querySelector('img')?.src || '',
            type: propertyCard.querySelector('.property-badge-tucasa')?.textContent || ''
        };
    }
    
    const cached = localStorage.getItem('properties_cache');
    if (cached) {
        const cacheData = JSON.parse(cached);
        return cacheData.data.find(p => p.id === propertyId);
    }
    
    return null;
}

function initDetailButtons() {
    const detailBtns = document.querySelectorAll('.btn-primary-tucasa[href*="detalle-propiedad.html"]');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = new URL(btn.href);
            window.location.href = url.toString();
        });
    });
}

// ============================================
// FAVORITES FUNCTIONALITY
// ============================================

function initFavorites() {
    // Initialize favorite buttons on page
    document.querySelectorAll('.favorite-btn-tucasa').forEach(btn => {
        if (!btn.dataset.listener) {
            btn.dataset.listener = 'true';
            btn.addEventListener('click', handleFavoriteClick);
        }
    });
}

function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget;
    const propertyId = button.dataset.id;
    const property = getPropertyById(propertyId);
    
    if (!property) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingIndex = favorites.findIndex(fav => fav.id === propertyId);
    
    if (existingIndex === -1) {
        favorites.push(property);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.classList.add('active');
        showNotification('Propiedad agregada a favoritos', 'success');
    } else {
        favorites.splice(existingIndex, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.classList.remove('active');
        showNotification('Propiedad eliminada de favoritos', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ============================================
// FEATURED CAROUSEL
// ============================================

function initFeaturedCarousel() {
    const carouselTrack = document.querySelector('.carousel-track-tucasa');
    const slides = document.querySelectorAll('.carousel-slide-tucasa');
    const dots = document.querySelectorAll('.carousel-dot-tucasa');
    const prevBtn = document.querySelector('.carousel-prev-tucasa');
    const nextBtn = document.querySelector('.carousel-next-tucasa');
    
    if (!carouselTrack || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    function updateCarousel() {
        const slideWidth = slides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentIndex * (slideWidth + 40)}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    // Event listeners
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
    
    // Update on resize
    window.addEventListener('resize', updateCarousel);
    
    // Initial update
    updateCarousel();
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
    const contactForm = document.getElementById('contactFormIndex');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit-tucasa');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            if (!isValidEmail(data.email)) {
                throw new Error('Por favor ingresa un email válido');
            }
            
            // Send to EmailJS
            if (typeof emailjs !== 'undefined') {
                await emailjs.send("service_f8crp6f", "template_ar49unm", {
                    from_name: data.name,
                    from_email: data.email,
                    phone: data.phone,
                    message: data.message,
                    property: data.property || 'General',
                    date: new Date().toLocaleString()
                });
            }
            
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending contact form:', error);
            showNotification('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
            
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// LOAD MORE BUTTON
// ============================================

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', async () => {
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        loadMoreBtn.disabled = true;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Funcionalidad de cargar más propiedades activada', 'info');
        } catch (error) {
            showNotification('Error al cargar más propiedades', 'error');
        } finally {
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Cargar Más Propiedades';
            loadMoreBtn.disabled = false;
        }
    });
}

// ============================================
// WHATSAPP BUTTON
// ============================================

function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-floating');
    if (!whatsappBtn) return;
    
    // Add click animation
    whatsappBtn.addEventListener('click', () => {
        whatsappBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            whatsappBtn.style.transform = '';
        }, 200);
    });
    
    // Show/hide based on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            whatsappBtn.style.opacity = '0.7';
            whatsappBtn.style.transform = 'scale(0.9)';
        } else {
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.transform = '';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Add styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes searchProgress {
                from { width: 0%; }
                to { width: 100%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-remove
    const autoRemove = setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// ============================================
// WINDOW LOAD EVENT
// ============================================

window.addEventListener('load', () => {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Check for search parameters
    checkForSearchParameters();
});

function checkForSearchParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString() && window.location.pathname.includes('propiedades.html')) {
        // The properties page will handle this
        return;
    }
    
    // Check for previous search on index page
    const lastSearch = sessionStorage.getItem('lastSearch');
    if (lastSearch && document.querySelector('.search-form-tucasa')) {
        const searchData = JSON.parse(lastSearch);
        updateSearchFormWithPreviousSearch(searchData);
    }
}

function updateSearchFormWithPreviousSearch(searchData) {
    const form = document.querySelector('.search-form-tucasa');
    if (!form) return;
    
    // Update tabs
    if (searchData.type) {
        const tab = document.querySelector(`.type-tab[data-type="${searchData.type}"]`);
        if (tab) {
            document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        }
    }
    
    // Update selects
    const selects = form.querySelectorAll('select');
    if (searchData.location && selects[0]) selects[0].value = searchData.location;
    if (searchData.propertyType && selects[1]) selects[1].value = searchData.propertyType;
    if (searchData.rooms && selects[2]) selects[2].value = searchData.rooms;
    if (searchData.parking && selects[3]) selects[3].value = searchData.parking;
    if (searchData.maxPrice && selects[4]) selects[4].value = searchData.maxPrice;
}

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

// Make functions available globally
window.showNotification = showNotification;
window.initHeroSearch = initHeroSearch;
window.initPropertyGrid = initPropertyGrid;