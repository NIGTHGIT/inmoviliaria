function formatUSD(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

// Amenidades predefinidas con íconos para render público
const AMENITY_LABELS = {
  piscina: { label: 'Piscina', icon: 'fas fa-swimming-pool' },
  gimnasio: { label: 'Gimnasio', icon: 'fas fa-dumbbell' },
  seguridad: { label: 'Seguridad', icon: 'fas fa-shield-alt' },
  areas_verdes: { label: 'Áreas verdes', icon: 'fas fa-tree' },
  parqueo: { label: 'Parqueo', icon: 'fas fa-parking' },
  parque_infantil: { label: 'Parque infantil', icon: 'fas fa-child' },
  rooftop_bar: { label: 'Rooftop bar', icon: 'fas fa-wine-glass-alt' },
  concierge: { label: 'Concierge', icon: 'fas fa-concierge-bell' },
  frente_mar: { label: 'Frente al mar', icon: 'fas fa-umbrella-beach' },
};

function renderProjectCard(p) {
  const imgs = p.imagenes && p.imagenes.length ? p.imagenes : (p.imagenPrincipal ? [p.imagenPrincipal] : []);
  const img = imgs[0] || '';
  const labels = AMENITY_LABELS;
  const a = p.amenities || {};
  const amenList = Object.keys(labels).filter(k => !!a[k]).slice(0, 4);
  const featuresHtml = (amenList.length ? amenList.map(k => `
    <div class="project-feature-item">
      <i class="${labels[k].icon}"></i>
      <div class="project-feature-info"><h4>${labels[k].label}</h4></div>
    </div>
  `) : (p.features || []).slice(0,4).map(f => {
    const text = typeof f === 'string' ? f : [f.titulo, f.descripcion].filter(Boolean).join(' - ');
    return `
      <div class="project-feature-item">
        <i class="fas fa-check-circle"></i>
        <div class="project-feature-info"><h4>${text}</h4></div>
      </div>
    `;
  })).join('');

  return `
  <div class="project-card-large" data-id="${p.id}">
    <div class="project-header-large">
      <img src="${img}" alt="${p.titulo}">
      <div class="project-badge-large">${p.badge || ''}</div>
    </div>
    <div class="project-content-large">
      <h2>${p.titulo}</h2>
      <p class="project-location-large">
        <i class="fas fa-map-marker-alt"></i> ${p.ubicacion}
      </p>
      <div class="project-prices-large">
        <div class="price-range-large">
          <span>DESDE</span>
          <strong>${formatUSD(p.precioDesde)}</strong>
        </div>
        <div class="price-range-large">
          <span>HASTA</span>
          <strong>${formatUSD(p.precioHasta)}</strong>
        </div>
      </div>
      <p class="project-description-large">${p.descripcion}</p>
      <div class="project-features-large">${featuresHtml}</div>
      <div class="project-actions">
        <button class="btn-primary-tucasa project-action" type="button" data-action="info" data-project-id="${p.id}" data-project="${p.titulo}" onclick="openProjectInfo(this)">
          <i class="fas fa-info-circle"></i> Más Información
        </button>
        <button class="btn-primary-tucasa project-action" data-action="cita" data-project="${p.titulo}">
          <i class="fas fa-calendar-check"></i> Agendar Visita
        </button>
      </div>
    </div>
  </div>
  `;
}

function renderProjectsList(list) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;
  if (!list || !list.length) {
    container.innerHTML = '<p class="no-data">No hay proyectos disponibles actualmente.</p>';
    return;
  }
  window.projectsById = {};
  window.projectsList = Array.isArray(list) ? list.slice() : [];
  list.forEach(p => { if (p && (p.id !== undefined && p.id !== null)) window.projectsById[String(p.id)] = p; });
  container.innerHTML = list.map(renderProjectCard).join('');

  if (!container._delegated) {
    container.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('.project-action');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const projectId = btn.getAttribute('data-project-id');
      const projectName = btn.getAttribute('data-project');
      if (action === 'info' && projectId) {
        try {
          const idNum = Number(projectId);
          const data = await api.get(`/proyectos/${idNum}`);
          if (data && data.success) {
            openProjectDetailModal(data.data);
          } else {
            const fallback = window.projectsById && window.projectsById[String(projectId)];
            if (fallback) openProjectDetailModal(fallback); else alert('No se pudo cargar la información del proyecto');
          }
        } catch (e) {
          console.error('Error cargando proyecto:', e);
          const fallback = window.projectsById && window.projectsById[String(projectId)];
          if (fallback) openProjectDetailModal(fallback); else alert('No se pudo cargar la información del proyecto');
        }
      } else if (action === 'cita') {
        const params = new URLSearchParams({ from: 'proyectos', type: 'cita', project: projectName || '' });
        window.location.href = `contacto.html?${params.toString()}`;
      }
    });
    container._delegated = true;
  }
}

function openProjectDetailModal(p) {
  const modal = document.getElementById('projectDetailModal');
  const content = document.getElementById('projectDetailContent');
  if (!modal || !content) return;

  const imgs = p.imagenes && p.imagenes.length ? p.imagenes : (p.imagenPrincipal ? [p.imagenPrincipal] : []);
  const gallery = imgs.map((src, i) => `<img src="${src}" alt="${p.titulo} ${i+1}" class="detail-image" onerror="this.style.display='none'">`).join('');
  const a2 = p.amenities || {};
  const amenKeys = Object.keys(AMENITY_LABELS).filter(k => !!a2[k]);
  const features = (amenKeys.length ? amenKeys.map(k => `
    <div class="detail-feature-item">
      <i class="${AMENITY_LABELS[k].icon}"></i>
      <span>${AMENITY_LABELS[k].label}</span>
    </div>
  `) : (p.features || []).map(f => {
    const text = typeof f === 'string' ? f : [f.titulo, f.descripcion].filter(Boolean).join(' - ');
    return `
      <div class="detail-feature-item">
        <i class="fas fa-check-circle"></i>
        <span>${text}</span>
      </div>
    `;
  })).join('');

  content.innerHTML = `
    <div class="detail-header">
      <h2>${p.titulo}</h2>
      <span class="detail-badge">${p.badge || ''}</span>
    </div>
    <p class="detail-location"><i class="fas fa-map-marker-alt"></i> ${p.ubicacion}</p>
    <div class="detail-info">
      <div class="detail-info-item"><span>Estado</span><strong>${p.badge || p.estadoProyecto || ''}</strong></div>
      <div class="detail-info-item"><span>Precio Desde</span><strong>${formatUSD(p.precioDesde)}</strong></div>
      <div class="detail-info-item"><span>Precio Hasta</span><strong>${formatUSD(p.precioHasta)}</strong></div>
    </div>
    <div class="detail-gallery">${gallery}</div>
    <p class="detail-description">${p.descripcion}</p>
    <div class="detail-features-list">${features}</div>
    <div class="detail-actions">
      <a class="btn-primary-tucasa" href="contacto.html?${new URLSearchParams({ from: 'proyectos', type: 'cita', project: p.titulo }).toString()}"><i class="fas fa-calendar-check"></i> Agendar Visita</a>
      <a class="btn-secondary-tucasa whatsapp-btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/18497077848?text=${encodeURIComponent('Hola, me interesa el proyecto ' + p.titulo)}"><i class="fab fa-whatsapp"></i> WhatsApp</a>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeProjectDetailModal() {
  const modal = document.getElementById('projectDetailModal');
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  const closeBtn = document.getElementById('projectDetailClose');
  if (closeBtn) closeBtn.addEventListener('click', closeProjectDetailModal);
  const modal = document.getElementById('projectDetailModal');
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectDetailModal(); });
  }

  if (!window._projectsInfoBound) {
    document.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('.project-action');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const projectId = btn.getAttribute('data-project-id');
      const projectName = btn.getAttribute('data-project');
      if (action === 'info' && projectId) {
        const idKey = String(projectId).trim();
        const local = (window.projectsById && window.projectsById[idKey])
          || (Array.isArray(window.projectsList) ? window.projectsList.find(p => String(p.id) === idKey) : null)
          || collectDomProject(btn);
        if (local) openProjectDetailModal(local);
        const idNum = parseInt(idKey, 10);
        if (!isNaN(idNum)) {
          api.get(`/proyectos/${idNum}`).then(data => {
            if (data && data.success) openProjectDetailModal(data.data);
          }).catch(e => { /* silencioso */ });
        }
      } else if (action === 'cita') {
        const params = new URLSearchParams({ from: 'proyectos', type: 'cita', project: projectName || '' });
        window.location.href = `contacto.html?${params.toString()}`;
      }
    }, { passive: true });
    window._projectsInfoBound = true;
  }

  try {
    const resp = await api.get('/proyectos');
    if (resp && resp.success) renderProjectsList(resp.data);
    else {
      const container = document.getElementById('projectsContainer');
      if (container) container.innerHTML = '<p class="no-data">No hay proyectos disponibles actualmente.</p>';
    }
  } catch (e) {
    console.error('Error cargando proyectos:', e);
    const container = document.getElementById('projectsContainer');
    if (container) container.innerHTML = '<p class="error">No se pudieron cargar los proyectos. Intenta nuevamente.</p>';
  }
});
async function openProjectInfo(el) {
  if (!el) return;
  const projectId = el.getAttribute('data-project-id');
  const projectName = el.getAttribute('data-project');
  if (!projectId) return;
  try {
    const modal = document.getElementById('projectDetailModal');
    const content = document.getElementById('projectDetailContent');
    if (modal) modal.style.display = 'flex';
    const idKey = String(projectId).trim();
    const local = (window.projectsById && window.projectsById[idKey])
      || (Array.isArray(window.projectsList) ? window.projectsList.find(p => String(p.id) === idKey) : null)
      || collectDomProject(el);
    if (local) {
      openProjectDetailModal(local);
    } else if (content) {
      content.innerHTML = '<p class="loading">Cargando información...</p>';
    }
    const idNum = parseInt(String(projectId).trim(), 10);
    if (isNaN(idNum)) {
      const fb = window.projectsById && window.projectsById[String(projectId).trim()];
      if (fb) { openProjectDetailModal(fb); return; }
    }
    let completed = !!local;
    const safetyTimer = setTimeout(() => {
      if (completed) return;
      const fallback = (window.projectsById && window.projectsById[idKey])
        || (Array.isArray(window.projectsList) ? window.projectsList.find(p => String(p.id) === idKey) : null)
        || collectDomProject(el);
      if (fallback) {
        completed = true;
        openProjectDetailModal(fallback);
      } else if (content) {
        content.innerHTML = '<p class="error">No se pudo cargar la información del proyecto.</p>';
      }
    }, 1000);
    const data = await api.get(`/proyectos/${idNum}`);
    if (data && data.success) {
      completed = true;
      clearTimeout(safetyTimer);
      openProjectDetailModal(data.data);
    } else {
      const fallback = window.projectsById && window.projectsById[String(projectId)];
      completed = true;
      clearTimeout(safetyTimer);
      if (fallback) openProjectDetailModal(fallback); else alert('No se pudo cargar la información del proyecto');
    }
  } catch (e) {
    console.error('Error cargando proyecto:', e);
    const fallback = window.projectsById && window.projectsById[String(projectId)];
    if (fallback) openProjectDetailModal(fallback); else {
      if (content) content.innerHTML = '<p class="error">No se pudo cargar la información del proyecto.</p>';
      alert('No se pudo cargar la información del proyecto');
    }
  }
}
function collectDomProject(el){
  try {
    const card = el.closest('.project-card-large');
    if (!card) return null;
    const idAttr = card.getAttribute('data-id');
    const id = idAttr ? parseInt(idAttr, 10) : undefined;
    const titulo = card.querySelector('.project-content-large h2')?.textContent?.trim() || '';
    const ubicacion = card.querySelector('.project-location-large')?.textContent?.replace(/^[^A-Za-zÁÉÍÓÚÑáéíóúñ]+/, '').trim() || '';
    const precioDesdeText = card.querySelectorAll('.price-range-large strong')[0]?.textContent || '';
    const precioHastaText = card.querySelectorAll('.price-range-large strong')[1]?.textContent || '';
    const n = (s)=> parseInt(String(s).replace(/[^0-9]/g,''),10) || 0;
    const precioDesde = n(precioDesdeText);
    const precioHasta = n(precioHastaText);
    const descripcion = card.querySelector('.project-description-large')?.textContent?.trim() || '';
    const img = card.querySelector('.project-header-large img')?.getAttribute('src') || '';
    const imagenes = img ? [img] : [];
    return { id, titulo, ubicacion, precioDesde, precioHasta, descripcion, imagenPrincipal: img, imagenes, badge: card.querySelector('.project-badge-large')?.textContent || '' };
  } catch(e){
    return null;
  }
}
