<!-- Header Component -->
<header>
    <nav class="navbar">
        <div class="container">
            <h1 class="logo">🏠 Inmobiliaria</h1>
            <ul class="nav-links">
                <li><a href="/" class="<?php echo ($page == 'inicio') ? 'active' : ''; ?>">Inicio</a></li>
                <li><a href="/propiedades" class="<?php echo ($page == 'propiedades') ? 'active' : ''; ?>">Propiedades</a></li>
                <li><a href="/servicios" class="<?php echo ($page == 'servicios') ? 'active' : ''; ?>">Servicios</a></li>
                <li><a href="/nosotros" class="<?php echo ($page == 'nosotros') ? 'active' : ''; ?>">Nosotros</a></li>
                <li><a href="/contacto" class="<?php echo ($page == 'contacto') ? 'active' : ''; ?>">Contacto</a></li>
            </ul>
        </div>
    </nav>
</header>
