// users.js
import { CONFIG } from "./config.js";

/**
 * registrarUsuario - guarda nombre/email/pass en hoja Usuarios
 * Nota: contraseñas sin cifrar (solo demo). Para producción usar backend seguro.
 */
export async function registrarUsuario(nombre, email, pass) {
  const body = { values: [[nombre, email, pass, new Date().toLocaleString()]] };
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_USUARIOS}:append?valueInputOption=RAW&key=${CONFIG.API_KEY}`;
  await fetch(url, { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
  return true;
}
