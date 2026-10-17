// ==========================================================
// SCRIPT.JS - FORMULARIO PÚBLICO (REGISTRO Y RESERVAS)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4pFHwCfKEhodnpHwDAe8ZiPjp6fTMKnD_0WWdV7aXKL7p8Zw_ruuxYP_0l_7HGEMsLw/exec';

    const nombresInput = document.getElementById('nombres');
    const celularInput = document.getElementById('celular');
    const btnAddAdulto = document.getElementById('btnAddAdulto');
    const btnAddMenor = document.getElementById('btnAddMenor');
    const contenedorAdultos = document.getElementById('contenedorAdultos');
    const contenedorMenores = document.getElementById('contenedorMenores');

    // Restricciones de entrada básicas
    nombresInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });

    celularInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    // ======================================================
    // DINÁMICA: ADULTOS ADICIONALES
    // ======================================================
    btnAddAdulto.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'dynamic-item adulto-item';
        div.innerHTML = `
            <button type="button" class="btn-remove-item" title="Eliminar">&times;</button>
            <div class="form-row">
                <div class="input-group">
                    <label>Nombre completo</label>
                    <div class="input-wrapper">
                        <input type="text" class="adulto-nombre" placeholder="Nombre y Apellido" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Tipo de Documento</label>
                    <div class="input-wrapper select-wrapper">
                        <select class="adulto-tipo">
                            <option value="Ecuatoriano (Cédula)">Ecuatoriano (Cédula)</option>
                            <option value="Extranjero (Pasaporte)">Extranjero (Pasaporte)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row" style="margin-top: 8px;">
                <div class="input-group full-width">
                    <label>Número de Identificación</label>
                    <div class="input-wrapper">
                        <input type="text" class="adulto-doc" placeholder="N.º Cédula o Pasaporte" required>
                    </div>
                </div>
            </div>
            <div class="passport-alert hidden-section">
                ⚠️ Huésped extranjero: Debe adjuntar la foto del pasaporte con el sello de ingreso al Ecuador por WhatsApp.
            </div>
        `;

        // Al cambiar tipo de documento, alertar si es extranjero
        const selectTipo = div.querySelector('.adulto-tipo');
        const alertBox = div.querySelector('.passport-alert');
        selectTipo.addEventListener('change', () => {
            if (selectTipo.value.includes('Pasaporte')) {
                alertBox.classList.remove('hidden-section');
            } else {
                alertBox.classList.add('hidden-section');
            }
        });

        // Eliminar tarjeta
        div.querySelector('.btn-remove-item').addEventListener('click', () => div.remove());
        contenedorAdultos.appendChild(div);
    });

    // ======================================================
    // DINÁMICA: MENORES DE EDAD
    // ======================================================
    btnAddMenor.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'dynamic-item menor-item';
        div.innerHTML = `
            <button type="button" class="btn-remove-item" title="Eliminar">&times;</button>
            <div class="form-row">
                <div class="input-group">
                    <label>Nombre completo del menor</label>
                    <div class="input-wrapper">
                        <input type="text" class="menor-nombre" placeholder="Nombre completo" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>N.º Cédula o Pasaporte</label>
                    <div class="input-wrapper">
                        <input type="text" class="menor-doc" placeholder="Documento del menor" required>
                    </div>
                </div>
            </div>
            <div class="form-row" style="margin-top: 8px;">
                <div class="input-group">
                    <label>Adulto responsable con quien viaja</label>
                    <div class="input-wrapper">
                        <input type="text" class="menor-responsable" placeholder="Nombre del adulto a cargo" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Relación o Parentesco</label>
                    <div class="input-wrapper">
                        <input type="text" class="menor-relacion" placeholder="Ej: Madre, Padre, Tutor" required>
                    </div>
                </div>
            </div>
        `;
        div.querySelector('.btn-remove-item').addEventListener('click', () => div.remove());
        contenedorMenores.appendChild(div);
    });

    // ======================================================
    // ENVÍO DE DATOS A GOOGLE APPS SCRIPT
    // ======================================================
    document.getElementById('reservaForm').addEventListener('submit', async function(e) {
        e.preventDefault(); 

        if (celularInput.value.length < 10) {
            alert("El número de WhatsApp debe tener al menos 10 dígitos.");
            return;
        }

        const form = e.target;
        const btnSubmit = document.getElementById('submitBtn');
        const statusMessage = document.getElementById('statusMessage');
        
        const btnText = btnSubmit.querySelector('span');
        const btnIcon = btnSubmit.querySelector('i');
        const originalText = btnText.textContent;

        btnText.textContent = 'Enviando registro...';
        btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.8';
        btnSubmit.style.cursor = 'not-allowed';
        statusMessage.textContent = ''; 

        // 1. Consolidar lista de adultos
        const listaAdultos = [];
        document.querySelectorAll('.adulto-item').forEach((item, index) => {
            const nom = item.querySelector('.adulto-nombre').value.trim();
            const tipo = item.querySelector('.adulto-tipo').value;
            const doc = item.querySelector('.adulto-doc').value.trim();
            if (nom && doc) {
                listaAdultos.push(`${index + 1}. ${nom} (${tipo}: ${doc})`);
            }
        });
        const textoAdultos = listaAdultos.length > 0 ? listaAdultos.join(' | ') : 'Ninguno adicional';

        // 2. Consolidar lista de menores
        const listaMenores = [];
        document.querySelectorAll('.menor-item').forEach((item, index) => {
            const nom = item.querySelector('.menor-nombre').value.trim();
            const doc = item.querySelector('.menor-doc').value.trim();
            const resp = item.querySelector('.menor-responsable').value.trim();
            const rel = item.querySelector('.menor-relacion').value.trim();
            if (nom) {
                listaMenores.push(`${index + 1}. ${nom} (Doc: ${doc}, A cargo: ${resp}, Relación: ${rel})`);
            }
        });
        const textoMenores = listaMenores.length > 0 ? listaMenores.join(' | ') : 'Sin menores';

        // 3. Empaquetar formulario
        const celularFormateado = "'" + celularInput.value;
        const formData = {
            action: "create",
            nombres: nombresInput.value.trim(),
            cedula: document.getElementById('cedula').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            celular: celularFormateado,
            cabana: document.getElementById('cabana').value,
            ingreso: document.getElementById('ingreso').value,
            salida: document.getElementById('salida').value,
            horaLlegada: document.getElementById('horaLlegada').value || "No especificada",
            adultos: textoAdultos,
            menores: textoMenores,
            vehiculo: document.getElementById('vehiculo').value.trim() || "No aplica",
            mascota: document.getElementById('mascota').value.trim() || "No",
            factura: "No",
            datosFactura: "No aplica"
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

            statusMessage.textContent = '¡Registro y reserva completados con éxito!';
            statusMessage.style.color = '#2d4a27';
            form.reset(); 
            contenedorAdultos.innerHTML = '';
            contenedorMenores.innerHTML = '';

        } catch (error) {
            console.error('Error de conexión:', error);
            statusMessage.textContent = 'Hubo un problema de conexión. Por favor intenta de nuevo.';
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
