// js/data.js
import { CONFIG } from "./config.js";

export async function obtenerProductosRaw(){
  const range = CONFIG.RANGE_PRODUCTOS || "Productos!A:J";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(range)}?key=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

// devuelve array de objetos normalizados
export async function obtenerProductos(){
  try {
    const json = await obtenerProductosRaw();
    const rows = json.values || [];
    if (rows.length < 2) return [];
    const headers = rows[0].map(h => (h||'').toString().trim());
    const out = rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h,i)=> obj[h] = (r[i] !== undefined ? r[i] : ""));
      // normalizaciones
      obj.precio = Number(obj.precio || 0);
      obj.oferta = String(obj.oferta || "").toLowerCase() === "si" || obj.oferta === true;
      obj.nuevo = String(obj.nuevo || "").toLowerCase() === "si" || obj.nuevo === true;
      obj.mas_vendido = String(obj.mas_vendido || "").toLowerCase() === "si" || obj.mas_vendido === true;
      obj.imagen = obj.imagen || "images/products/placeholder.png";
      return obj;
    });
    return out;
  } catch(e){
    console.error("obtenerProductos error", e);
    return [];
  }
}

window.obtenerProductos = obtenerProductos; // fácil acceso global
