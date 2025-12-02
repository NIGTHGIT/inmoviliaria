const localStorage = require('../utils/localStorage');

function defaultAmenities() {
    return {
        piscina: false,
        gimnasio: false,
        seguridad: false,
        areas_verdes: false,
        parqueo: false,
        parque_infantil: false,
        rooftop_bar: false,
        concierge: false,
        frente_mar: false
    };
}

function deriveAmenitiesFromFeatures(features) {
    const a = defaultAmenities();
    const list = Array.isArray(features) ? features : [];
    const texts = list.map(f => {
        if (typeof f === 'string') return f.toLowerCase();
        return `${(f.titulo || '').toLowerCase()} ${(f.descripcion || '').toLowerCase()}`.trim();
    });
    const has = (kw) => texts.some(t => t.includes(kw));
    if (has('piscina')) a.piscina = true;
    if (has('gimnasio')) a.gimnasio = true;
    if (has('seguridad')) a.seguridad = true;
    if (has('verde') || has('parque')) a.areas_verdes = true;
    if (has('parqueo') || has('estacionamiento')) a.parqueo = true;
    if (has('infantil')) a.parque_infantil = true;
    if (has('roof') || has('rooftop')) a.rooftop_bar = true;
    if (has('concierge') || has('conserje')) a.concierge = true;
    if (has('frente al mar') || has('mar') || has('playa') || has('oceáno') || has('océano')) a.frente_mar = true;
    return a;
}

function initializeProyectos() {
    let proyectos = localStorage.getItem('proyectos');
    if (!proyectos) {
        const now = new Date().toISOString();
        proyectos = [
            {
                id: 1,
                titulo: 'Residencial Vista Sol Etapa III',
                ubicacion: 'La Barranquita, Santiago',
                estadoProyecto: 'en desarrollo',
                badge: 'PROYECTO EN DESARROLLO',
                precioDesde: 125000,
                precioHasta: 199500,
                descripcion: 'Moderno y lujoso proyecto de apartamentos ubicado en una de las zonas de mayor crecimiento de Santiago. Contamos con amenities completos que incluyen piscina, gimnasio, áreas verdes y seguridad 24/7. Diseños modernos y eficientes pensados para tu comodidad.',
                imagenPrincipal: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1000',
                imagenes: [
                    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1000',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000'
                ],
                features: [
                    { icon: 'fas fa-swimming-pool', titulo: 'Piscina y Área Social', descripcion: 'Amplias áreas comunes para disfrutar' },
                    { icon: 'fas fa-dumbbell', titulo: 'Gimnasio Equipado', descripcion: 'Equipo de última generación' },
                    { icon: 'fas fa-shield-alt', titulo: 'Seguridad 24/7', descripcion: 'Sistema de vigilancia completo' },
                    { icon: 'fas fa-tree', titulo: 'Áreas Verdes', descripcion: 'Espacios naturales integrados' }
                ],
                amenities: { piscina: true, gimnasio: true, seguridad: true, areas_verdes: true },
                fechaCreacion: now
            },
            {
                id: 2,
                titulo: 'Torre Caribe Residence',
                ubicacion: 'Punta Cana, La Altagracia',
                estadoProyecto: 'preventa',
                badge: 'PROYECTO PREVENTA',
                precioDesde: 180000,
                precioHasta: 350000,
                descripcion: 'Exclusivo proyecto frente al mar en la zona más privilegiada de Punta Cana. Apartamentos con vistas panorámicas al Caribe, acabados de lujo y amenities de categoría internacional. Oportunidad única de inversión en el paraíso.',
                imagenPrincipal: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000',
                imagenes: [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000',
                    'https://images.unsplash.com/photo-1598928506311-8f0c4b92fbc7?w=1000'
                ],
                features: [
                    { icon: 'fas fa-umbrella-beach', titulo: 'Frente al Mar', descripcion: 'Vistas directas al Caribe' },
                    { icon: 'fas fa-infinity', titulo: 'Piscina Infinity', descripcion: 'Diseño único con vista al mar' },
                    { icon: 'fas fa-concierge-bell', titulo: 'Servicio Concierge', descripcion: 'Atención personalizada 24/7' },
                    { icon: 'fas fa-wine-glass-alt', titulo: 'Roof Top Bar', descripcion: 'Bar exclusivo con vistas 360°' }
                ],
                amenities: { frente_mar: true, piscina: true, concierge: true, rooftop_bar: true },
                fechaCreacion: now
            }
        ];
        localStorage.setItem('proyectos', proyectos);
    }
    return proyectos;
}

exports.getProyectos = (req, res) => {
    try {
        let proyectos = initializeProyectos();
        const { estado, ubicacion, q } = req.query;
        if (estado) {
            const norm = (estado || '').toLowerCase();
            proyectos = proyectos.filter(p => (p.estadoProyecto || '').toLowerCase() === norm);
        }
        if (ubicacion) {
            const uq = (ubicacion || '').toLowerCase();
            proyectos = proyectos.filter(p => (p.ubicacion || '').toLowerCase().includes(uq));
        }
        if (q) {
            const nq = (q || '').toLowerCase();
            proyectos = proyectos.filter(p =>
                (p.titulo || '').toLowerCase().includes(nq) ||
                (p.descripcion || '').toLowerCase().includes(nq) ||
                (p.ubicacion || '').toLowerCase().includes(nq)
            );
        }
        res.json({ success: true, data: proyectos, total: proyectos.length });
    } catch (error) {
        console.error('Error obteniendo proyectos:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

exports.getProyectoById = (req, res) => {
    try {
        const { id } = req.params;
        const proyectos = initializeProyectos();
        const proyecto = proyectos.find(p => p.id === parseInt(id));
        if (!proyecto) {
            return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }
        res.json({ success: true, data: proyecto });
    } catch (error) {
        console.error('Error obteniendo proyecto:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

exports.createProyecto = (req, res) => {
    try {
        const proyectos = initializeProyectos();
        const newId = proyectos.length ? Math.max(...proyectos.map(p => p.id)) + 1 : 1;
        const nuevo = {
            id: newId,
            titulo: req.body.titulo,
            ubicacion: req.body.ubicacion,
            estadoProyecto: req.body.estadoProyecto || 'preventa',
            badge: req.body.badge || (req.body.estadoProyecto === 'en desarrollo' ? 'PROYECTO EN DESARROLLO' : 'PROYECTO PREVENTA'),
            precioDesde: parseFloat(req.body.precioDesde) || 0,
            precioHasta: parseFloat(req.body.precioHasta) || 0,
            descripcion: req.body.descripcion || '',
            imagenPrincipal: req.body.imagenPrincipal || '',
            imagenes: req.body.imagenes || [],
            features: req.body.features || [],
            amenities: req.body.amenities || deriveAmenitiesFromFeatures(req.body.features || []),
            fechaCreacion: new Date().toISOString()
        };
        proyectos.push(nuevo);
        localStorage.setItem('proyectos', proyectos);
        res.status(201).json({ success: true, message: 'Proyecto creado exitosamente', data: nuevo });
    } catch (error) {
        console.error('Error creando proyecto:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

exports.updateProyecto = (req, res) => {
    try {
        const { id } = req.params;
        let proyectos = initializeProyectos();
        const index = proyectos.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }
        const prev = proyectos[index];
        const nextAmenities = req.body.amenities ? { ...defaultAmenities(), ...req.body.amenities } : (prev.amenities || deriveAmenitiesFromFeatures(prev.features || []));
        const actualizado = {
            ...prev,
            ...req.body,
            amenities: nextAmenities,
            id: parseInt(id),
            fechaActualizacion: new Date().toISOString()
        };
        proyectos[index] = actualizado;
        localStorage.setItem('proyectos', proyectos);
        res.json({ success: true, message: 'Proyecto actualizado exitosamente', data: actualizado });
    } catch (error) {
        console.error('Error actualizando proyecto:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

exports.deleteProyecto = (req, res) => {
    try {
        const { id } = req.params;
        let proyectos = initializeProyectos();
        const index = proyectos.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }
        proyectos.splice(index, 1);
        localStorage.setItem('proyectos', proyectos);
        res.json({ success: true, message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando proyecto:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

