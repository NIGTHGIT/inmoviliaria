<?php $page = 'nosotros'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acerca de Nosotros - Inmobiliaria</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <?php include 'components/header.php'; ?>

    <main>
        <section class="page-header">
            <div class="container">
                <h1>Acerca de Nosotros</h1>
                <p>Conoce nuestra historia y equipo</p>
            </div>
        </section>

        <section class="nosotros-intro">
            <div class="container">
                <div class="nosotros-content">
                    <div class="nosotros-texto">
                        <h2>Nuestra Historia</h2>
                        <p>Desde 2015, hemos sido líderes en el mercado inmobiliario, ayudando a miles de familias a encontrar su hogar ideal. Nuestra pasión por las propiedades y el compromiso con la excelencia nos han convertido en la opción preferida de nuestros clientes.</p>
                        <p>Comenzamos como una pequeña agencia familiar y hemos crecido hasta convertirnos en una de las inmobiliarias más reconocidas de la región, siempre manteniendo nuestros valores de honestidad, transparencia y profesionalismo.</p>
                    </div>
                    <div class="nosotros-imagen">
                        <div class="stats-box">
                            <div class="stat">
                                <h3>10+</h3>
                                <p>Años de experiencia</p>
                            </div>
                            <div class="stat">
                                <h3>5000+</h3>
                                <p>Clientes satisfechos</p>
                            </div>
                            <div class="stat">
                                <h3>800+</h3>
                                <p>Propiedades vendidas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="valores">
            <div class="container">
                <h2>Nuestros Valores</h2>
                <div class="valores-grid">
                    <div class="valor-card">
                        <span class="icon">🎯</span>
                        <h3>Compromiso</h3>
                        <p>Nos comprometemos a brindar el mejor servicio y resultados a nuestros clientes</p>
                    </div>
                    <div class="valor-card">
                        <span class="icon">✨</span>
                        <h3>Transparencia</h3>
                        <p>Actuamos con honestidad y claridad en todas nuestras operaciones</p>
                    </div>
                    <div class="valor-card">
                        <span class="icon">🚀</span>
                        <h3>Innovación</h3>
                        <p>Utilizamos las últimas tecnologías para mejorar la experiencia del cliente</p>
                    </div>
                    <div class="valor-card">
                        <span class="icon">❤️</span>
                        <h3>Pasión</h3>
                        <p>Amamos lo que hacemos y se refleja en cada proyecto</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="equipo">
            <div class="container">
                <h2>Nuestro Equipo</h2>
                <p class="equipo-intro">Profesionales dedicados a ayudarte a encontrar tu propiedad ideal</p>
                <div class="equipo-grid">
                    <div class="equipo-card">
                        <div class="equipo-foto">👨‍💼</div>
                        <h3>Juan Pérez</h3>
                        <p class="cargo">Director General</p>
                        <p>Más de 15 años de experiencia en el sector inmobiliario</p>
                    </div>
                    <div class="equipo-card">
                        <div class="equipo-foto">👩‍💼</div>
                        <h3>María González</h3>
                        <p class="cargo">Gerente de Ventas</p>
                        <p>Especialista en propiedades residenciales de lujo</p>
                    </div>
                    <div class="equipo-card">
                        <div class="equipo-foto">👨‍💼</div>
                        <h3>Carlos Rodríguez</h3>
                        <p class="cargo">Asesor Comercial</p>
                        <p>Experto en inversiones inmobiliarias</p>
                    </div>
                    <div class="equipo-card">
                        <div class="equipo-foto">👩‍💼</div>
                        <h3>Ana Martínez</h3>
                        <p class="cargo">Gerente de Operaciones</p>
                        <p>Coordinación y gestión de procesos</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="container">
                <h2>¿Quieres trabajar con nosotros?</h2>
                <p>Estamos aquí para ayudarte en tu próximo proyecto inmobiliario</p>
                <a href="/contacto" class="btn-primary">Contáctanos</a>
            </div>
        </section>
    </main>

    <?php include 'components/footer.php'; ?>

    <script src="js/app.js"></script>
</body>
</html>
