<?php $page = 'servicios'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Servicios - Inmobiliaria</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <?php include 'components/header.php'; ?>

    <main>
        <section class="page-header">
            <div class="container">
                <h1>Nuestros Servicios</h1>
                <p>Soluciones integrales para todas tus necesidades inmobiliarias</p>
            </div>
        </section>
        <section class="servicios-detalle">
            <div class="container">
                <div class="servicio-detalle-card">
                    <div class="servicio-imagen">
                        <span class="icon-large">🏡</span>
                    </div>
                    <div class="servicio-contenido">
                        <h2>Compra de Propiedades</h2>
                        <p>Te ayudamos a encontrar la propiedad perfecta que se ajuste a tus necesidades y presupuesto. Nuestro equipo de expertos te guiará en cada paso del proceso de compra.</p>
                        <ul>
                            <li>Asesoramiento personalizado</li>
                            <li>Búsqueda de propiedades según tus criterios</li>
                            <li>Gestión de documentación</li>
                            <li>Negociación de precios</li>
                            <li>Acompañamiento legal</li>
                        </ul>
                    </div>
                </div>

                <div class="servicio-detalle-card reverse">
                    <div class="servicio-imagen">
                        <span class="icon-large">💰</span>
                    </div>
                    <div class="servicio-contenido">
                        <h2>Venta de Propiedades</h2>
                        <p>Vendemos tu propiedad al mejor precio y en el menor tiempo posible. Utilizamos estrategias de marketing avanzadas para maximizar la exposición de tu inmueble.</p>
                        <ul>
                            <li>Valoración profesional gratuita</li>
                            <li>Fotografía profesional</li>
                            <li>Marketing digital y tradicional</li>
                            <li>Organización de visitas</li>
                            <li>Gestión de ofertas y cierre de ventas</li>
                        </ul>
                    </div>
                </div>

                <div class="servicio-detalle-card">
                    <div class="servicio-imagen">
                        <span class="icon-large">🔑</span>
                    </div>
                    <div class="servicio-contenido">
                        <h2>Alquiler y Arrendamiento</h2>
                        <p>Servicios completos de alquiler tanto para propietarios como para inquilinos. Gestionamos todo el proceso para que sea simple y seguro.</p>
                        <ul>
                            <li>Búsqueda de inquilinos confiables</li>
                            <li>Elaboración de contratos</li>
                            <li>Gestión de cobros</li>
                            <li>Mantenimiento y reparaciones</li>
                            <li>Resolución de conflictos</li>
                        </ul>
                    </div>
                </div>

                <div class="servicio-detalle-card reverse">
                    <div class="servicio-imagen">
                        <span class="icon-large">📊</span>
                    </div>
                    <div class="servicio-contenido">
                        <h2>Asesoría en Inversiones</h2>
                        <p>Te ayudamos a tomar las mejores decisiones de inversión inmobiliaria con análisis de mercado y proyecciones de rentabilidad.</p>
                        <ul>
                            <li>Análisis de mercado</li>
                            <li>Estudios de rentabilidad</li>
                            <li>Identificación de oportunidades</li>
                            <li>Estrategias de inversión</li>
                            <li>Gestión de portafolios inmobiliarios</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="container">
                <h2>¿Interesado en nuestros servicios?</h2>
                <p>Contáctanos para más información</p>
                <a href="/contacto" class="btn-primary">Contactar Ahora</a>
            </div>
        </section>
    </main>

    <?php include 'components/footer.php'; ?>

    <script src="js/app.js"></script>
</body>
</html>
