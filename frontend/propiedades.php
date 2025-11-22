<?php $page = 'propiedades'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propiedades - Inmobiliaria</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <?php include 'components/header.php'; ?>

    <main>
        <section class="page-header">
            <div class="container">
                <h1>Nuestras Propiedades</h1>
                <p>Encuentra la propiedad perfecta para ti</p>
            </div>
        </section>

        <section class="propiedades-section">
            <div class="container">
                <div class="filtros">
                    <h3>Filtrar por:</h3>
                    <div class="filtros-grid">
                        <select id="tipo-propiedad">
                            <option value="">Tipo de Propiedad</option>
                            <option value="casa">Casa</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="villa">Villa</option>
                            <option value="local">Local Comercial</option>
                        </select>
                        <select id="operacion">
                            <option value="">Operación</option>
                            <option value="venta">Venta</option>
                            <option value="alquiler">Alquiler</option>
                        </select>
                        <input type="number" id="precio-min" placeholder="Precio Mínimo">
                        <input type="number" id="precio-max" placeholder="Precio Máximo">
                        <button class="btn-primary" onclick="aplicarFiltros()">Buscar</button>
                    </div>
                </div>

                <div id="propiedades-list" class="propiedades-grid">
                    <!-- Las propiedades se cargarán dinámicamente -->
                </div>
            </div>
        </section>
    </main>

    <?php include 'components/footer.php'; ?>

    <script src="js/app.js"></script>
    <script src="js/propiedades.js"></script>
</body>
</html>
