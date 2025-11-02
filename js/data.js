// data.js (resumen, reemplazar funciones relevantes)
import { CONFIG } from "./config.js";

export async function obtenerProductos() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_PRODUCTOS}?key=${CONFIG.API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.values || data.values.length < 2) return [];
    const [headers, ...rows] = data.values;
    const lista = rows.map(r => {
      const obj = {};
      headers.forEach((h,i)=> obj[h.toLowerCase()] = r[i] ?? "");
      return {
        nombre: obj["nombre"] || obj["producto"] || "Sin nombre",
        precio: Number((obj["precio"]||"0").replace(/[^\d.]/g,"")) || 0,
        imagen: obj["imagen"] || "images/products/placeholder.png",
        categoria: (obj["categoria"] || "OTROS").toUpperCase(),
        oferta: (obj["oferta"] || "").toLowerCase() === "si"
      };
    });
    return lista;
  } catch (e) {
    console.error("Error cargando productos:", e);
    return [];
  }
}

export function renderProductos(lista) {
  const cont = document.getElementById("productos");
  if (!cont) return;
  cont.innerHTML = lista.map(p => `
    <div class="producto" data-nombre="${escapeHtml(p.nombre)}" data-precio="${p.precio}" data-imagen="${p.imagen}" data-categoria="${p.categoria}">
      <div class="categoria">${p.categoria}</div>
      <img src="${p.imagen}" alt="${escapeHtml(p.nombre)}">
      <h3>${escapeHtml(p.nombre)}</h3>
      <div class="precio">$${p.precio}</div>
      <div class="cantidad">
        <button class="menos">−</button>
        <input type="number" min="1" value="1" />
        <button class="mas">+</button>
      </div>
      <button class="btn-agregar">Agregar al Carrito</button>
    </div>
  `).join("");
}

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
