const form = document.getElementById('clienteForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const statusMessage = document.getElementById('statusMessage');

// ¡IMPORTANTE! Reemplaza esta URL con la que te dé Google Apps Script al implementar el código.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc8yS4FgitNbhFpvhgu2QOF3QW2F4jw_qbCvm6tSQErCnOTK9pm5kgQzeCFLIFFZmRKw/exec';

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (GOOGLE_SCRIPT_URL === 'PÉGALA_AQUÍ') {
        showStatus('error', 'Falta configurar la URL de Google Apps Script en el archivo script.js');
        return;
    }

    setLoading(true);

    // Obtenemos los valores
    let numeroCliente = document.getElementById('numeroCliente').value;
    let correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const tipoCuenta = document.getElementById('tipoCuenta').value;

    const radiosDom = document.getElementsByName('tipoUsuario');
    let tipoUsuario = "";
    for (let i = 0; i < radiosDom.length; i++) {
        if (radiosDom[i].checked) {
            tipoUsuario = radiosDom[i].value;
            break;
        }
    }

    // Función mágica para evitar que Google Sheets crea que un número tipo "+51" es una suma matemática
    const protegerDeGoogleSheets = (texto) => {
        // Si el texto empieza con signos matemáticos, le pegamos una comilla simple oculta
        if (texto.startsWith('+') || texto.startsWith('=') || texto.startsWith('-') || texto.startsWith('@')) {
            return "'" + texto;
        }
        return texto;
    };

    const params = new URLSearchParams({
        numeroCliente: protegerDeGoogleSheets(numeroCliente),
        correo: protegerDeGoogleSheets(correo),
        contrasena: protegerDeGoogleSheets(contrasena),
        tipoUsuario: tipoUsuario,
        tipoCuenta: protegerDeGoogleSheets(tipoCuenta)
    });

    try {
        // Usamos GET porque Google a veces bloquea o pierde los datos POST por redirecciones (CORS 302)
        const URL_FINAL = GOOGLE_SCRIPT_URL + '?' + params.toString();

        await fetch(URL_FINAL, {
            method: 'GET',
            mode: 'no-cors'
        });

        // Al usar no-cors, no podemos leer la respuesta exacta, pero si llega aquí sabemos que la petición se envió.
        showStatus('success', '¡Datos guardados correctamente en Google Sheets!');
        
        // Preparar y enviar mensaje de WhatsApp
        const fechaActual = new Date().toLocaleDateString('es-ES');
        
        // Usamos Texto Codificado en URL (URL Encoded) 100% en formato americano para evitar 
        // totalmente todos los "rombos" o errores por la codificación de Windows en el archivo.
        const textParam = 
            "%F0%9F%91%8B%20*%C2%A1Hola!%20Aqu%C3%AD%20tienes%20los%20detalles%20de%20tu%20nueva%20cuenta:*%0A%0A" +
            "%E2%AD%90%20*Usuario%20(Correo):*%20" + encodeURIComponent(correo || 'No especificado') + "%0A" +
            "%F0%9F%94%92%20*Contrase%C3%B1a:*%20" + encodeURIComponent(contrasena) + "%0A" +
            "%E2%9C%85%20*Tipo%20de%20Usuario:*%20" + encodeURIComponent(tipoUsuario || 'No especificado') + "%0A" +
            "%F0%9F%93%BA%20*Tipo%20de%20Cuenta:*%20" + encodeURIComponent(tipoCuenta || 'No especificado') + "%0A" +
            "%F0%9F%93%85%20*Fecha%20de%20compra:*%20" + encodeURIComponent(fechaActual) + "%0A" +
            "%E2%8F%B3%20*D%C3%ADas%20restantes:*%2030%0A%0A" +
            "_%C2%A1Gracias%20por%20tu%20preferencia!_%20%E2%9C%A8";
                        
        // Limpiamos el número de símbolos (+, espacios) para pasarlo a la api de WhatsApp
        const telefonoLimpio = numeroCliente.replace(/[^0-9]/g, '');
        
        // Usamos el protocolo nativo (whatsapp://) para abrir la app instalada directamente sin la ventana web intermedia
        const whatsappUrl = `whatsapp://send?phone=${telefonoLimpio}&text=${textParam}`;
        
        // Usar window.location.href en vez de window.open abre la app sin generar pestañas en blanco basura
        window.location.href = whatsappUrl;

        form.reset();

    } catch (error) {
        showStatus('error', 'Error al guardar los datos. Verifica tu conexión e inténtalo de nuevo.');
        console.error('Error!', error.message);
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'block';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        loader.style.display = 'none';
    }
}

function showStatus(type, message) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    statusMessage.classList.remove('hidden');

    // Ocultar automáticamente en 5 segundos si fue exitoso
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }
}
