// ==========================================================
// SCRIPT.JS - FORMULARIO PÚBLICO (REGISTRO Y RESERVAS)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4pFHwCfKEhodnpHwDAe8ZiPjp6fTMKnD_0WWdV7aXKL7p8Zw_ruuxYP_0l_7HGEMsLw/exec';

    const nombresInput = document.getElementById('nombres');
    const cedulaInput = document.getElementById('cedula');
    const celularInput = document.getElementById('celular');
    const btnAddAdulto = document.getElementById('btnAddAdulto');
    const btnAddMenor = document.getElementById('btnAddMenor');
    const contenedorAdultos = document.getElementById('contenedorAdultos');
    const contenedorMenores = document.getElementById('contenedorMenores');

    // Función auxiliar: Permite solo letras, tildes, diéresis, eñes y espacios
    function limpiarSoloLetrasConTilde(texto) {
        return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    }

    // 1. RESTRICCIONES DE ENTRADA: NOMBRE DEL TITULAR (Con tildes y eñes)
    if (nombresInput) {
        nombresInput.addEventListener('input', function() {
            this.value = limpiarSoloLetrasConTilde(this.value);
        });
    }

    // 2. RESTRICCIONES DE ENTRADA: SOLO NÚMEROS ESTRICTOS (Cédula y Celular)
    if (cedulaInput) {
        cedulaInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }

    if (celularInput) {
        celularInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }

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
                        <input type="text" class="adulto-doc" placeholder="N.º Cédula (10 dígitos)" required>
                    </div>
                </div>
            </div>
            <div class="passport-alert hidden-section">
                ⚠️ Huésped extranjero: Debe adjuntar la foto del pasaporte con el sello de ingreso al Ecuador por WhatsApp.
            </div>
        `;

        const inputNombre = div.querySelector('.adulto-nombre');
        const inputDoc = div.querySelector('.adulto-doc');
        const selectTipo = div.querySelector('.adulto-tipo');
        const alertBox = div.querySelector('.passport-alert');

        // Solo letras con tildes y eñes para el acompañante
        inputNombre.addEventListener('input', function() {
            this.value = limpiarSoloLetrasConTilde(this.value);
        });

        // Solo números si es cédula; alfanumérico si es pasaporte
        inputDoc.addEventListener('input', function() {
            if (selectTipo.value.includes('Cédula')) {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
            }
        });

        selectTipo.addEventListener('change', () => {
            if (selectTipo.value.includes('Pasaporte')) {
                alertBox.classList.remove('hidden-section');
                inputDoc.placeholder = "N.º Pasaporte";
            } else {
                alertBox.classList.add('hidden-section');
                inputDoc.placeholder = "N.º Cédula (10 dígitos)";
                inputDoc.value = inputDoc.value.replace(/[^0-9]/g, '').slice(0, 10);
            }
        });

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
                        <input type="text" class="menor-relacion" placeholder="Ej: Madre, Padre, Tío, Tutor" required>
                    </div>
                </div>
            </div>
        `;

        const inputNomMenor = div.querySelector('.menor-nombre');
        const inputDocMenor = div.querySelector('.menor-doc');
        const inputResp = div.querySelector('.menor-responsable');
        const inputRel = div.querySelector('.menor-relacion');

        // Nombres, adultos a cargo y parentescos: aceptan letras, tildes y eñes
        inputNomMenor.addEventListener('input', function() {
            this.value = limpiarSoloLetrasConTilde(this.value);
        });
        inputResp.addEventListener('input', function() {
            this.value = limpiarSoloLetrasConTilde(this.value);
        });
        inputRel.addEventListener('input', function() {
            this.value = limpiarSoloLetrasConTilde(this.value);
        });

        // Documento del menor (permite letras o números por si es pasaporte o cédula)
        inputDocMenor.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9a-zA-Z]/g, '');
        });

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

        // 3. Formatear hora de llegada con apóstrofe
        const valorHora = document.getElementById('horaLlegada').value;
        const horaFormateada = valorHora ? "'" + valorHora : "No especificada";

        // 4. Empaquetar formulario (con apóstrofe para preservar ceros a la izquierda)
        const cedulaFormateada = "'" + cedulaInput.value.trim();
        const celularFormateado = "'" + celularInput.value.trim();

        const formData = {
            action: "create",
            nombres: nombresInput.value.trim(),
            cedula: cedulaFormateada,
            correo: document.getElementById('correo').value.trim(),
            celular: celularFormateado,
            cabana: document.getElementById('cabana').value,
            ingreso: document.getElementById('ingreso').value,
            salida: document.getElementById('salida').value,
            horaLlegada: horaFormateada,
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
