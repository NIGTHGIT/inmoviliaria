class PropertiesPageManager {
    constructor() {
        this.all = [];
        this.view = 'grid';
        this.pageSize = 12;
        this.visible = 12;
        this.bindUI();
        this.load();
    }

    bindUI() {
        document.querySelectorAll('.view-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.view = btn.dataset.view;
                document.querySelectorAll('.view-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.render();
            });
        });

        const apply = () => this.applyFilters();
        document.getElementById('filter-location')?.addEventListener('change', apply);
        document.getElementById('filter-type')?.addEventListener('change', apply);
        document.getElementById('filter-rooms')?.addEventListener('change', apply);
        document.getElementById('filter-price')?.addEventListener('change', apply);

        document.getElementById('load-more-properties')?.addEventListener('click', () => {
            this.visible += this.pageSize;
            this.render();
        });
    }

    async load() {
        try {
            const res = await window.api.get('/propiedades');
            this.all = Array.isArray(res?.data) ? res.data : [];
            this.applyFilters();
        } catch (e) {
            console.error('Error obteniendo propiedades:', e);
            this.all = [];
            this.applyFilters();
        }
    }

    applyFilters() {
        const loc = document.getElementById('filter-location')?.value.trim().toLowerCase() || '';
        const tipo = document.getElementById('filter-type')?.value || '';
        const rooms = parseInt(document.getElementById('filter-rooms')?.value || '') || 0;
        const max = parseInt(document.getElementById('filter-price')?.value || '') || 0;

        this.filtered = this.all.filter(p => {
            const byLoc = loc ? (p.ubicacion || '').toLowerCase().includes(loc) : true;
            const byTipo = tipo ? p.tipo === tipo : true;
            const byRooms = rooms ? (p.habitaciones || 0) >= rooms : true;
            const byPrice = max ? (p.precio || 0) <= max : true;
            return byLoc && byTipo && byRooms && byPrice;
        });

        this.visible = Math.min(this.pageSize, this.filtered.length);
        this.render();
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);
    }

    getStatusText(estado) {
        const norm = (estado || '').toLowerCase().replace(/\s+/g, '_');
        const map = { en_venta: 'VENTA', en_alquiler: 'ALQUILER', vendido: 'VENDIDO', reservado: 'RESERVADO' };
        return map[norm] || estado || '';
    }

    render() {
        const countEl = document.getElementById('properties-count');
        const gridEl = document.getElementById('properties-grid');
        if (!countEl || !gridEl) return;

        countEl.textContent = `${this.filtered.length} propiedades encontradas`;
        const items = this.filtered.slice(0, this.visible);

        gridEl.classList.toggle('list-view', this.view === 'list');
        gridEl.innerHTML = items.map(p => `
            <div class="property-card-tucasa">
                <div class="property-image-tucasa">
                    <img src="${(Array.isArray(p.imagenes) && p.imagenes[0]) || 'https://via.placeholder.com/600x400?text=Propiedad'}" alt="${p.titulo}">
                    <div class="property-badge-tucasa">${this.getStatusText(p.estado)}</div>
                    <div class="property-price-tucasa">${this.formatPrice(p.precio)}</div>
                </div>
                <div class="property-info-tucasa">
                    <h3 class="property-title-tucasa">${p.titulo}</h3>
                    <p class="property-location-tucasa"><i class="fas fa-map-marker-alt"></i> ${p.ubicacion || ''}</p>
                    <div class="property-features-tucasa">
                        <span><i class="fas fa-bed"></i> ${(p.habitaciones || 0)} hab.</span>
                        <span><i class="fas fa-bath"></i> ${(p.banos || 0)} baños</span>
                        <span><i class="fas fa-ruler-combined"></i> ${(p.metrosCuadrados || 0)} m²</span>
                    </div>
                    <div class="property-actions-tucasa">
                        <a href="propiedad-detalle.html?id=${p.id}" class="btn-primary-tucasa">Ver Detalles</a>
                        <button class="btn-outline-tucasa" onclick="window.favoritesManager?.toggleFavorite('${p.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const loadMoreBtn = document.getElementById('load-more-properties');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = this.visible < this.filtered.length ? 'inline-flex' : 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.propertiesManager = new PropertiesPageManager();
});

