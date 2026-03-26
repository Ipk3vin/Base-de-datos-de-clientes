const form = document.getElementById('clienteForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const statusMessage = document.getElementById('statusMessage');

// ¡IMPORTANTE! Reemplaza esta URL con la que te dé Google Apps Script al implementar el código.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgRACzHXFucgCVTOpJip8K4ZY3Or7-8axyLDU6wgUpjtBvpdtF90g8018zP0FaRyesbQ/exec';

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (GOOGLE_SCRIPT_URL === 'PÉGALA_AQUÍ') {
        showStatus('error', 'Falta configurar la URL de Google Apps Script en el archivo script.js');
        return;
    }

    setLoading(true);

    // Obtenemos los valores
    const numeroCliente = document.getElementById('numeroCliente').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const params = new URLSearchParams({
        numeroCliente: numeroCliente,
        correo: correo,
        contrasena: contrasena
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
