// Script para la página de contacto
document.addEventListener('DOMContentLoaded', () => {
    configurarFormularioContacto();
});

function configurarFormularioContacto() {
    const form = document.getElementById('contacto-form');
    const mensaje = document.getElementById('form-mensaje');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            asunto: document.getElementById('asunto').value,
            mensaje: document.getElementById('mensaje').value
        };
        
        console.log('Formulario enviado:', formData);
        
        // Simular envío exitoso
        mensaje.className = 'form-mensaje exito';
        mensaje.textContent = '¡Gracias por contactarnos! Te responderemos pronto.';
        
        // Limpiar formulario
        form.reset();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensaje.className = 'form-mensaje';
            mensaje.textContent = '';
        }, 5000);
        
        // Aquí puedes agregar la lógica para enviar al backend
        /*
        try {
            const response = await fetch('/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                mensaje.className = 'form-mensaje exito';
                mensaje.textContent = '¡Gracias por contactarnos! Te responderemos pronto.';
                form.reset();
            } else {
                mensaje.className = 'form-mensaje error';
                mensaje.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.';
            }
        } catch (error) {
            console.error('Error:', error);
            mensaje.className = 'form-mensaje error';
            mensaje.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.';
        }
        */
    });
}
