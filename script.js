// ==========================================================
// SCRIPT.JS - FORMULARIO PÚBLICO (CONECTADO A LA BD DEL LODGE)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    // 🔴 ESTA ES LA NUEVA URL REAL DE LA CUENTA DEL CLIENTE
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHiMKRmedyeaNDs6JEHotpe2Q00Svw_HZg6tHNQwROHz5rz5zCTspoBwoP6A4TFnuk/exec';

    const nombresInput = document.getElementById('nombres');
    const cedulaInput = document.getElementById('cedula');
    const celularInput = document.getElementById('celular');

    // ==========================================
    // CONTROL ESTRICTO DE CAMPOS (RESTRICCIONES)
    // ==========================================
    nombresInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });

    cedulaInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    celularInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    // ==========================================
    // LÓGICA DE ENVÍO DIRECTO A GOOGLE SHEETS
    // ==========================================
    document.getElementById('reservaForm').addEventListener('submit', async function(e) {
        e.preventDefault(); 

        // Validar manualmente longitud antes de enviar
        if (cedulaInput.value.length < 10) {
            alert("La cédula debe tener exactamente 10 números.");
            return;
        }
        if (celularInput.value.length < 10) {
            alert("El celular debe tener exactamente 10 números.");
            return;
        }

        const form = e.target;
        const btnSubmit = document.getElementById('submitBtn');
        const statusMessage = document.getElementById('statusMessage');
        
        const btnText = btnSubmit.querySelector('span');
        const btnIcon = btnSubmit.querySelector('i');
        const originalText = btnText.textContent;

        // Estado de carga visual
        btnText.textContent = 'Procesando...';
        btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.8';
        btnSubmit.style.cursor = 'not-allowed';
        
        statusMessage.textContent = ''; 

        // TRUCO DEL CERO: Agregamos la comilla simple al inicio del celular
        const celularFormateado = "'" + celularInput.value;

        // Recolectar datos ordenados para tu backend estructurado
        const formData = {
            action: "create", 
            nombres: nombresInput.value,
            cedula: cedulaInput.value,
            correo: document.getElementById('correo').value,
            celular: celularFormateado,
            cabana: document.getElementById('cabana').value,
            ingreso: document.getElementById('ingreso').value,
            salida: document.getElementById('salida').value
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            statusMessage.textContent = '¡Reserva enviada exitosamente!';
            statusMessage.style.color = 'green';
            form.reset(); 

        } catch (error) {
            console.error('Error de conexión:', error);
            statusMessage.textContent = 'Hubo un problema. Intenta de nuevo.';
            statusMessage.style.color = 'red';
        } finally {
            btnText.textContent = originalText;
            btnIcon.className = 'fa-solid fa-arrow-right';
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
        }
    });
});