// Favorites Page Manager
class FavoritesPageManager {
    constructor() {
        this.favorites = [];
        this.comparingProperties = new Set(); // Set para propiedades en comparación
        this.init();
    }

    init() {
        this.loadFavorites();
        this.setupEventListeners();
        this.renderFavorites();
        this.setupCompareModal();
    }

    loadFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.updateFavoritesCounter();
    }

    setupEventListeners() {
        // Clear all favorites button
        document.getElementById('clear-all-favorites')?.addEventListener('click', () => {
            this.clearAllFavorites();
        });

        // Share favorites button
        document.getElementById('share-favorites')?.addEventListener('click', () => {
            this.shareFavorites();
        });

        // Export favorites button
        document.getElementById('export-favorites')?.addEventListener('click', () => {
            this.exportFavorites();
        });

        // Compare favorites button
        document.getElementById('compare-favorites')?.addEventListener('click', () => {
            this.openCompareModal();
        });

        // Close compare modal
        document.getElementById('close-compare')?.addEventListener('click', () => {
            this.closeCompareModal();
        });

        // Clear comparison button
        document.getElementById('clear-comparison')?.addEventListener('click', () => {
            this.clearComparison();
        });

        // Download comparison button
        document.getElementById('download-comparison')?.addEventListener('click', () => {
            this.downloadComparison();
        });

        // Close modal when clicking outside
        document.getElementById('compare-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'compare-modal') {
                this.closeCompareModal();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('compare-modal').style.display === 'flex') {
                this.closeCompareModal();
            }
        });
    }

    renderFavorites() {
        const grid = document.getElementById('favorites-grid');
        const emptyState = document.getElementById('favorites-empty');
        const actions = document.getElementById('favorites-actions');
        const summary = document.getElementById('favorites-summary');

        if (this.favorites.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            actions.style.display = 'none';
            summary.style.display = 'none';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        actions.style.display = 'flex';
        summary.style.display = 'block';

        grid.innerHTML = this.favorites.map(favorite => this.createFavoriteCard(favorite)).join('');

        // Update summary
        this.updateFavoritesSummary();

        // Add event listeners to the new buttons
        this.setupFavoriteCardListeners();
    }

   createFavoriteCard(property) {
    const isComparing = this.comparingProperties.has(property.id);
    const badgeText = property.isForRent ? 'Alquiler' : 'Venta';
    const badgeColor = property.isForRent ? 'alquiler' : 'venta';

    return `
        <div class="favorite-card-tucasa" data-id="${property.id}">
            <!-- Header con botones de eliminar y comparar -->
            <div class="favorite-card-header">
                <div class="favorite-card-actions">
                    <button class="favorite-compare-toggle ${isComparing ? 'comparing' : ''}" 
                            data-id="${property.id}"
                            title="${isComparing ? 'Quitar de comparación' : 'Agregar a comparación'}">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                    <button class="favorite-remove" data-id="${property.id}" title="Eliminar de favoritos">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Imagen de la propiedad -->
            <div class="property-image-tucasa">
                <img src="${property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                     alt="${property.title}"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}">
                <div class="property-badge-tucasa ${badgeColor}">${badgeText}</div>
                <div class="property-price-tucasa">${property.price || 'Consultar'}</div>
            </div>
            
            <!-- Información de la propiedad -->
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
                
                <!-- Acciones principales (Ver y WhatsApp) -->
                <div class="favorite-actions-bottom">
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
        </div>
    `;
}

    setupFavoriteCardListeners() {
        // Remove buttons
        document.querySelectorAll('.favorite-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = btn.dataset.id;
                this.removeFavorite(propertyId);
            });
        });

        // Compare toggle buttons
        document.querySelectorAll('.favorite-compare-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = btn.dataset.id;
                this.toggleComparison(propertyId, btn);
            });
        });

        // Update compare button text
        this.updateCompareButtonText();
    }

    removeFavorite(propertyId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta propiedad de tus favoritos?')) {
            const index = this.favorites.findIndex(fav => fav.id === propertyId);
            if (index !== -1) {
                this.favorites.splice(index, 1);
                localStorage.setItem('favorites', JSON.stringify(this.favorites));
                
                // Also remove from comparison if it was selected
                this.comparingProperties.delete(propertyId);
                
                this.showNotification('Propiedad eliminada de favoritos', 'success');
                this.renderFavorites();
                this.updateFavoritesCounter();
                this.updateCompareButtonText();
            }
        }
    }

    clearAllFavorites() {
        if (this.favorites.length === 0) {
            this.showNotification('No hay favoritos para eliminar', 'info');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar TODOS tus favoritos?')) {
            this.favorites = [];
            this.comparingProperties.clear();
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            
            this.showNotification('Todos los favoritos han sido eliminados', 'success');
            this.renderFavorites();
            this.updateFavoritesCounter();
            this.updateCompareButtonText();
        }
    }

    toggleComparison(propertyId, button) {
        if (this.comparingProperties.has(propertyId)) {
            this.comparingProperties.delete(propertyId);
            button.classList.remove('comparing');
            button.title = 'Agregar a comparación';
            this.showNotification('Propiedad eliminada de la comparación', 'info');
        } else {
            if (this.comparingProperties.size >= 4) {
                this.showNotification('Solo puedes comparar hasta 4 propiedades a la vez', 'error');
                return;
            }
            this.comparingProperties.add(propertyId);
            button.classList.add('comparing');
            button.title = 'Quitar de comparación';
            this.showNotification('Propiedad agregada a la comparación', 'success');
        }
        
        this.updateCompareButtonText();
    }

    updateCompareButtonText() {
        const compareBtn = document.getElementById('compare-favorites');
        const compareCount = this.comparingProperties.size;
        
        if (compareBtn) {
            if (compareCount > 0) {
                compareBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Comparar (${compareCount})`;
                compareBtn.disabled = false;
            } else {
                compareBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Comparar Propiedades`;
                compareBtn.disabled = true;
            }
        }
    }

    openCompareModal() {
        const compareCount = this.comparingProperties.size;
        if (compareCount === 0) {
            this.showNotification('Selecciona al menos una propiedad para comparar', 'error');
            return;
        }

        if (compareCount === 1) {
            this.showNotification('Selecciona al menos 2 propiedades para comparar', 'error');
            return;
        }

        const modal = document.getElementById('compare-modal');
        const grid = document.getElementById('compare-grid');

        // Get properties that are being compared
        const comparingProperties = this.favorites.filter(fav => 
            this.comparingProperties.has(fav.id)
        );

        // Create comparison table
        grid.innerHTML = this.createComparisonTable(comparingProperties);

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    createComparisonTable(properties) {
        if (properties.length === 0) return '';

        // Get all unique features from all properties
        const allFeatures = new Set();
        properties.forEach(prop => {
            if (prop.features && Array.isArray(prop.features)) {
                prop.features.forEach(feature => allFeatures.add(feature));
            }
        });

        const featuresArray = Array.from(allFeatures);

        return `
            <div class="compare-table">
                <div class="compare-header">
                    <div class="compare-cell compare-label"></div>
                    ${properties.map(prop => `
                        <div class="compare-cell compare-property">
                            <div class="compare-property-image">
                                <img src="${prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}" 
                                     alt="${prop.title}">
                                <button class="remove-from-compare" data-id="${prop.id}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <h4>${prop.title}</h4>
                            <p class="compare-price">${prop.price || 'Consultar'}</p>
                            <p class="compare-location">
                                <i class="fas fa-map-marker-alt"></i> ${prop.location}
                            </p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="compare-row">
                    <div class="compare-cell compare-label">Tipo</div>
                    ${properties.map(prop => `
                        <div class="compare-cell">${prop.type || 'N/A'}</div>
                    `).join('')}
                </div>
                
                <div class="compare-row">
                    <div class="compare-cell compare-label">Habitaciones</div>
                    ${properties.map(prop => `
                        <div class="compare-cell">${prop.rooms || 'N/A'}</div>
                    `).join('')}
                </div>
                
                <div class="compare-row">
                    <div class="compare-cell compare-label">Baños</div>
                    ${properties.map(prop => `
                        <div class="compare-cell">${prop.bathrooms || 'N/A'}</div>
                    `).join('')}
                </div>
                
                <div class="compare-row">
                    <div class="compare-cell compare-label">Parqueos</div>
                    ${properties.map(prop => `
                        <div class="compare-cell">${prop.parking || 'N/A'}</div>
                    `).join('')}
                </div>
                
                <div class="compare-row">
                    <div class="compare-cell compare-label">Área (m²)</div>
                    ${properties.map(prop => `
                        <div class="compare-cell">${prop.area || 'N/A'}</div>
                    `).join('')}
                </div>
                
                ${featuresArray.length > 0 ? `
                    <div class="compare-row">
                        <div class="compare-cell compare-label">Características</div>
                        ${properties.map(prop => `
                            <div class="compare-cell">
                                <ul class="compare-features">
                                    ${featuresArray.map(feature => `
                                        <li class="${prop.features && prop.features.includes(feature) ? 'has-feature' : 'no-feature'}">
                                            <i class="fas fa-${prop.features && prop.features.includes(feature) ? 'check' : 'times'}"></i>
                                            ${feature}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="compare-row compare-actions-row">
                    <div class="compare-cell compare-label">Acciones</div>
                    ${properties.map(prop => `
                        <div class="compare-cell">
                            <div class="compare-property-actions">
                                <a href="detalle-propiedad.html?id=${prop.id}" class="btn-primary-tucasa btn-sm">
                                    <i class="fas fa-eye"></i> Ver
                                </a>
                                <a href="https://wa.me/18497077848?text=Hola%2C%20estoy%20interesado%20en%20la%20propiedad%20${encodeURIComponent(prop.title)}" 
                                   class="btn-outline-tucasa btn-sm" target="_blank">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    closeCompareModal() {
        const modal = document.getElementById('compare-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    clearComparison() {
        this.comparingProperties.clear();
        this.updateCompareButtonText();
        this.closeCompareModal();
        this.renderFavorites(); // Update the cards to remove comparing state
        this.showNotification('Comparación limpiada', 'success');
    }

    setupCompareModal() {
        // Add event listener for remove from compare buttons in the modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-from-compare')) {
                const propertyId = e.target.closest('.remove-from-compare').dataset.id;
                this.comparingProperties.delete(propertyId);
                this.updateCompareButtonText();
                
                // If less than 2 properties, close modal
                if (this.comparingProperties.size < 2) {
                    this.closeCompareModal();
                    this.showNotification('Necesitas al menos 2 propiedades para comparar', 'info');
                } else {
                    // Refresh the comparison table
                    this.openCompareModal();
                }
                
                // Update the favorite cards
                this.renderFavorites();
            }
        });
    }

    downloadComparison() {
        this.showNotification('Funcionalidad de descarga próximamente disponible', 'info');
        // TODO: Implement PDF/Excel export
    }

    shareFavorites() {
        if (this.favorites.length === 0) {
            this.showNotification('No hay favoritos para compartir', 'info');
            return;
        }

        const shareText = `🌟 Mis propiedades favoritas en TU Casa RD 🌟\n\n` +
                         this.favorites.map((fav, index) => 
                             `${index + 1}. ${fav.title} - ${fav.price}\n📍 ${fav.location}`
                         ).join('\n\n') +
                         `\n\n🏠 Más propiedades en: ${window.location.origin}`;

        if (navigator.share) {
            navigator.share({
                title: 'Mis propiedades favoritas - TU Casa RD',
                text: shareText,
                url: window.location.href
            }).catch(() => {
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Lista de favoritos copiada al portapapeles', 'success');
        }).catch(() => {
            this.showNotification('Error al copiar al portapapeles', 'error');
        });
    }

    exportFavorites() {
        if (this.favorites.length === 0) {
            this.showNotification('No hay favoritos para exportar', 'info');
            return;
        }

        const exportData = {
            timestamp: new Date().toISOString(),
            total: this.favorites.length,
            properties: this.favorites
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `favoritos-tucasard-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Favoritos exportados exitosamente', 'success');
    }

    updateFavoritesCounter() {
        const counter = document.getElementById('favorites-counter');
        if (counter) {
            counter.textContent = this.favorites.length;
        }
    }

    updateFavoritesSummary() {
        if (this.favorites.length === 0) return;

        // Price range
        const prices = this.favorites.map(fav => {
            const priceStr = fav.price || '0';
            const match = priceStr.match(/[\d,]+/);
            return match ? parseInt(match[0].replace(/,/g, '')) : 0;
        }).filter(price => price > 0);

        let priceRangeText = 'Variado';
        if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            priceRangeText = `US$ ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
        }

        document.getElementById('price-range').textContent = priceRangeText;

        // Property types
        const types = {};
        this.favorites.forEach(fav => {
            types[fav.type] = (types[fav.type] || 0) + 1;
        });
        const typeText = Object.entries(types)
            .map(([type, count]) => `${type} (${count})`)
            .join(', ');
        document.getElementById('property-types').textContent = typeText || 'Variado';

        // Locations count
        const uniqueLocations = new Set(this.favorites.map(fav => fav.location));
        document.getElementById('locations-count').textContent = `${uniqueLocations.size} ubicaciones diferentes`;
    }

    showNotification(message, type = 'info') {
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
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesPageManager = new FavoritesPageManager();
});