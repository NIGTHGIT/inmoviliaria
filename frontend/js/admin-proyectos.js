function getAuthHeaders() {
  const sessionId = localStorage.getItem('sessionId');
  return { 'Content-Type': 'application/json', 'x-session-id': sessionId };
}

function formatUSD(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

async function loadProyectos() {
  const body = document.getElementById('proyectosTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="7" class="loading">Cargando proyectos...</td></tr>';
  try {
    const estado = document.getElementById('filterEstadoProyecto')?.value || '';
    const ubicacion = document.getElementById('filterUbicacionProyecto')?.value || '';
    const q = document.getElementById('filterQueryProyecto')?.value || '';
    const data = await api.get('/proyectos', { params: { estado, ubicacion, q } });
    if (data.success) {
      if (!data.data.length) {
        body.innerHTML = '<tr><td colspan="7" class="no-data">Sin proyectos</td></tr>';
        return;
      }
      body.innerHTML = data.data.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.titulo}</td>
          <td>${p.ubicacion}</td>
          <td><span class="badge">${p.estadoProyecto}</span></td>
          <td>${formatUSD(p.precioDesde)}</td>
          <td>${formatUSD(p.precioHasta)}</td>
          <td class="actions">
            <button class="btn-icon" onclick="viewProyecto(${p.id})" title="Ver">👁️</button>
            <button class="btn-icon" onclick="editProyecto(${p.id})" title="Editar">✏️</button>
            <button class="btn-icon" onclick="deleteProyecto(${p.id})" title="Eliminar">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error('Error cargando proyectos', e);
    body.innerHTML = '<tr><td colspan="7" class="error">Error al cargar</td></tr>';
  }
}

function clearProyectoFilters() {
  const e = document.getElementById('filterEstadoProyecto'); if (e) e.value = '';
  const u = document.getElementById('filterUbicacionProyecto'); if (u) u.value = '';
  const q = document.getElementById('filterQueryProyecto'); if (q) q.value = '';
  loadProyectos();
}

function showProyectoCreateModal() {
  document.getElementById('proyectoModalTitle').textContent = 'Nuevo Proyecto';
  document.getElementById('proyectoForm').reset();
  document.getElementById('proyectoId').value = '';
  document.getElementById('p_imagePreview').innerHTML = '';
  ['a_piscina','a_gimnasio','a_seguridad','a_areas_verdes','a_parqueo','a_parque_infantil','a_rooftop_bar','a_concierge','a_frente_mar']
    .forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
  document.getElementById('proyectoModal').style.display = 'flex';
}

function closeProyectoModal() { document.getElementById('proyectoModal').style.display = 'none'; }
function closeProyectoViewModal() { document.getElementById('proyectoViewModal').style.display = 'none'; }

async function viewProyecto(id) {
  try {
    const data = await api.get(`/proyectos/${id}`);
    if (data.success) {
      const p = data.data;
      document.getElementById('pv_titulo').textContent = p.titulo;
      const imgs = (p.imagenes && p.imagenes.length) ? p.imagenes : (p.imagenPrincipal ? [p.imagenPrincipal] : []);
      const gallery = imgs.map(src => `<img src="${src}" alt="${p.titulo}" onerror="this.style.display='none'">`).join('');
      const labels = {
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
      const a = p.amenities || {};
      const amenityChips = Object.keys(labels)
        .filter(k => !!a[k])
        .map(k => `<div class="pv-feature"><i class="${labels[k].icon}"></i><div><strong>${labels[k].label}</strong></div></div>`)
        .join('');
      const features = amenityChips || (p.features || []).map(f => {
        const text = typeof f === 'string' ? f : [f.titulo, f.descripcion].filter(Boolean).join(' - ');
        return `<div class="pv-feature"><i class="fas fa-check-circle"></i><div><strong>${text}</strong></div></div>`;
      }).join('');
      const content = `
        <div class="pv-header">
          <span class="pv-badge">${p.badge || p.estadoProyecto || ''}</span>
          <div class="pv-meta">
            <div class="pv-location"><i class="fas fa-map-marker-alt"></i> ${p.ubicacion || ''}</div>
          </div>
        </div>
        <div class="pv-prices">
          <div class="pv-price-card"><span>Desde</span><div><strong>${formatUSD(p.precioDesde)}</strong></div></div>
          <div class="pv-price-card"><span>Hasta</span><div><strong>${formatUSD(p.precioHasta)}</strong></div></div>
        </div>
        <div class="pv-gallery">${gallery}</div>
        <div class="pv-description">${p.descripcion || ''}</div>
        <div class="pv-features">${features}</div>
      `;
      const pv = document.getElementById('pv_content');
      if (pv) pv.innerHTML = content;
      document.getElementById('proyectoViewModal').style.display = 'flex';
    }
  } catch (e) {
    console.error('Error viendo proyecto', e);
    alert('No se pudo cargar el proyecto');
  }
}

async function editProyecto(id) {
  try {
    const data = await api.get(`/proyectos/${id}`);
    if (data.success) {
      const p = data.data;
      document.getElementById('proyectoModalTitle').textContent = 'Editar Proyecto';
      document.getElementById('proyectoId').value = p.id;
      document.getElementById('p_titulo').value = p.titulo || '';
      document.getElementById('p_ubicacion').value = p.ubicacion || '';
      document.getElementById('p_estadoProyecto').value = p.estadoProyecto || 'preventa';
      document.getElementById('p_precioDesde').value = p.precioDesde || 0;
      document.getElementById('p_precioHasta').value = p.precioHasta || 0;
      document.getElementById('p_descripcion').value = p.descripcion || '';
      document.getElementById('p_imagenPrincipal').value = p.imagenPrincipal || '';
      document.getElementById('p_imagenes').value = (p.imagenes || []).join('\n');
      document.getElementById('p_features').value = (p.features || []).map(f => {
        if (typeof f === 'string') return f;
        const text = [f.titulo, f.descripcion].filter(Boolean).join(' - ');
        return text || '';
      }).filter(Boolean).join('\n');
      const a = p.amenities || {};
      ['piscina','gimnasio','seguridad','areas_verdes','parqueo','parque_infantil','rooftop_bar','concierge','frente_mar']
        .forEach(key => { const el = document.getElementById('a_'+key); if (el) el.checked = !!a[key]; });
      document.getElementById('p_imagePreview').innerHTML = (p.imagenes || []).map((src, i) => `<div class="preview-item"><img src="${src}" alt="img${i}"><small>Actual</small></div>`).join('');
      document.getElementById('proyectoModal').style.display = 'flex';
    }
  } catch (e) {
    console.error('Error editando proyecto', e);
    alert('No se pudo cargar el proyecto');
  }
}

async function deleteProyecto(id) {
  if (!confirm('¿Eliminar este proyecto?')) return;
  try {
    const resp = await api.delete(`/proyectos/${id}`, { headers: getAuthHeaders() });
    if (resp.success) {
      alert('Proyecto eliminado');
      loadProyectos();
    }
  } catch (e) {
    console.error('Error eliminando proyecto', e);
    alert('No se pudo eliminar');
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImages(files) {
  if (!files || !files.length) return [];
  const base64s = await Promise.all(Array.from(files).map(fileToBase64));
  const resp = await api.post('/upload/multiple', { images: base64s }, { headers: { 'x-session-id': localStorage.getItem('sessionId') } });
  if (resp && resp.success) return resp.urls || [];
  throw new Error(resp.message || 'Error de subida');
}

document.addEventListener('DOMContentLoaded', () => {
  const debounce = (fn, ms=300) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
  const estadoSel = document.getElementById('filterEstadoProyecto');
  const ubicInput = document.getElementById('filterUbicacionProyecto');
  const queryInput = document.getElementById('filterQueryProyecto');
  if (estadoSel) estadoSel.addEventListener('change', () => loadProyectos());
  if (ubicInput) ubicInput.addEventListener('input', debounce(() => loadProyectos(), 350));
  if (queryInput) queryInput.addEventListener('input', debounce(() => loadProyectos(), 350));
  const fileInput = document.getElementById('p_imageFiles');
  if (fileInput) fileInput.addEventListener('change', (e) => {
    const preview = document.getElementById('p_imagePreview');
    preview.innerHTML = '';
    const files = Array.from(e.target.files);
    files.forEach((f, idx) => {
      const r = new FileReader();
      r.onload = (ev) => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = `<img src="${ev.target.result}"><small>${f.name}</small>`;
        preview.appendChild(div);
      };
      r.readAsDataURL(f);
    });
  });

  const form = document.getElementById('proyectoForm');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('p_submitBtn');
    btn.disabled = true; btn.textContent = 'Guardando...';
    try {
      const id = document.getElementById('proyectoId').value;
      let uploaded = [];
      const fi = document.getElementById('p_imageFiles');
      if (fi && fi.files.length) uploaded = await uploadImages(fi.files);
      const manual = (document.getElementById('p_imagenes').value || '').split('\n').map(s => s.trim()).filter(Boolean);
      const features = (document.getElementById('p_features').value || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const amenities = {
        piscina: !!document.getElementById('a_piscina')?.checked,
        gimnasio: !!document.getElementById('a_gimnasio')?.checked,
        seguridad: !!document.getElementById('a_seguridad')?.checked,
        areas_verdes: !!document.getElementById('a_areas_verdes')?.checked,
        parqueo: !!document.getElementById('a_parqueo')?.checked,
        parque_infantil: !!document.getElementById('a_parque_infantil')?.checked,
        rooftop_bar: !!document.getElementById('a_rooftop_bar')?.checked,
        concierge: !!document.getElementById('a_concierge')?.checked,
        frente_mar: !!document.getElementById('a_frente_mar')?.checked,
      };
      const payload = {
        titulo: document.getElementById('p_titulo').value,
        ubicacion: document.getElementById('p_ubicacion').value,
        estadoProyecto: document.getElementById('p_estadoProyecto').value,
        precioDesde: parseFloat(document.getElementById('p_precioDesde').value),
        precioHasta: parseFloat(document.getElementById('p_precioHasta').value),
        descripcion: document.getElementById('p_descripcion').value,
        imagenPrincipal: document.getElementById('p_imagenPrincipal').value,
        imagenes: [...uploaded, ...manual],
        features,
        amenities
      };
      const url = id ? `/proyectos/${id}` : '/proyectos';
      const method = id ? api.put : api.post;
      const resp = await method(url, payload, { headers: getAuthHeaders() });
      if (resp.success) {
        alert(id ? 'Proyecto actualizado' : 'Proyecto creado');
        document.getElementById('proyectoModal').style.display = 'none';
        loadProyectos();
      } else {
        alert(resp.message || 'Error');
      }
    } catch (e) {
      console.error('Error guardando proyecto', e);
      alert('No se pudo guardar');
    } finally {
      btn.disabled = false; btn.textContent = 'Guardar';
    }
  });
});
