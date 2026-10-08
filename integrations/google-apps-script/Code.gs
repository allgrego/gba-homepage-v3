/**
 * GBA Logistics: receives quote requests from the website and appends them to this Sheet.
 *
 * Container-bound script: create it from the Sheet via Extensions > Apps Script.
 * Setup steps: docs/quote-form-setup.md
 *
 * The email to sales is sent by the website itself (Mailtrap), not by this script.
 */

var SHEET_NAME = 'Cotizaciones';
var TIME_ZONE = 'America/Caracas';
var HEADERS = [
  'Fecha', 'Estado', 'Idioma', 'Modo', 'Origen', 'Destino', 'Mercancía',
  'Peso bruto (kg)', 'Bultos', 'Medidas', 'Embalaje', 'Valor (USD)', 'Lista el',
  'Dato según modo', 'Valor dato según modo', 'Tipo de cliente', 'Nombre', 'Empresa', 'RIF', 'Correo', 'Teléfono', 'Comentarios'
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // The secret lives in Script Properties (Project Settings), never in the code.
    var expected = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!expected || body.secret !== expected) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    var r = body.row || {};
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet_();
      sheet.appendRow([
        Utilities.formatDate(new Date(r.receivedAt), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss'),
        'Nuevo',
        r.lang, r.mode, r.origin, r.destination, r.cargo,
        r.weight, r.packages, r.dims, r.packaging, r.value, r.ready,
        r.modeFieldLabel, r.modeFieldValue, r.clientType, r.name, r.company, r.rif, r.email, r.phone, r.notes
      ].map(safe_));
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Stop visitor input from being interpreted as a formula (=, +, -, @).
function safe_(value) {
  var s = value == null ? '' : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
