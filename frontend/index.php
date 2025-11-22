<?php $page = 'inicio'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio - Inmobiliaria</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <?php include 'components/header.php'; ?>

    <main>
        <section class="hero">
            <div class="container">
                <h2>Encuentra tu hogar ideal</h2>
                <p>Las mejores propiedades al mejor precio</p>
                <a href="/propiedades" class="btn-primary">Ver Propiedades</a>
            </div>
        </section>

        <section class="destacados">
            <div class="container">
                <h2>Propiedades Destacadas</h2>
                <div id="propiedades-destacadas" class="propiedades-grid">
                    <!-- Las propiedades se cargarán dinámicamente -->
                </div>
                <div class="text-center">
                    <a href="/propiedades" class="btn-secondary">Ver Todas las Propiedades</a>
                </div>
            </div>
        </section>

        <section class="caracteristicas">
            <div class="container">
                <h2>¿Por qué elegirnos?</h2>
                <div class="caracteristicas-grid">
                    <div class="caracteristica-card">
                        <span class="icon">🏆</span>
                        <h3>Experiencia</h3>
                        <p>Más de 10 años en el mercado inmobiliario</p>
                    </div>
                    <div class="caracteristica-card">
                        <span class="icon">💼</span>
                        <h3>Profesionalismo</h3>
                        <p>Equipo altamente capacitado</p>
                    </div>
                    <div class="caracteristica-card">
                        <span class="icon">🤝</span>
                        <h3>Confianza</h3>
                        <p>Miles de clientes satisfechos</p>
                    </div>
                    <div class="caracteristica-card">
                        <span class="icon">📍</span>
                        <h3>Ubicaciones Premium</h3>
                        <p>Las mejores zonas de la ciudad</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="container">
                <h2>¿Listo para encontrar tu propiedad ideal?</h2>
                <p>Contáctanos y te ayudaremos en todo el proceso</p>
                <a href="/contacto" class="btn-primary">Contactar Ahora</a>
            </div>
        </section>
    </main>

    <?php include 'components/footer.php'; ?>

    <script src="js/app.js"></script>
    <script src="js/inicio.js"></script>
</body>
</html>
