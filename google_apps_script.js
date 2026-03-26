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
  var tipoUsuario = e.parameter.tipoUsuario || "";

  // Guardaremos la fecha oficial como objeto de fecha nativo de Google Sheets
  var fechaIngreso = new Date();

  // Orden exacto sin la fórmula aún: A(número), B(correo), C(contraseña), D(tipoUsuario), E(fecha)
  sheet.appendRow([numeroCliente, correo, contrasena, tipoUsuario, fechaIngreso]);

  // Inyectamos la fórmula especial de R1C1 en la columna F (la 6)
  // Al usar setFormulaR1C1, Google lo traducirá solo a tu idioma (Español) evitando el #ERROR!
  var ultimaFila = sheet.getLastRow();
  var formulaExcel = '=IF(ISBLANK(RC[-1]), "", MAX(0, 30 + (TODAY() - INT(RC[-1]))) & " días restantes")';
  sheet.getRange(ultimaFila, 6).setFormulaR1C1(formulaExcel);

  // Permitir respuesta para evitar errores CORS al final del proceso
  return ContentService.createTextOutput("Éxito").setMimeType(ContentService.MimeType.TEXT);
}
