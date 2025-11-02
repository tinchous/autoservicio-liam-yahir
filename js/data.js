// data.js
import { CONFIG } from "./config.js";

/**
 * Obtener productos desde Google Sheets (public read)
 * Espera encabezados en la primera fila: nombre, precio, imagen, categoria, stock
 */
export async function obtenerProductos() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_PRODUCTOS}?key=${CONFIG.API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.values || data.values.length < 2) return [];
    const [headers, ...rows] = data.values;
    const lista = rows.map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h.toLowerCase()] = r[i] ?? "");
      // normalizar campos
      return {
        nombre: obj["nombre"] || obj["producto"] || "Sin nombre",
        precio: Number((obj["precio"] || "0").replace(/[^\d.]/g, "")) || 0,
        imagen: obj["imagen"] || "images/products/placeholder.png",
        categoria: (obj["categoria"] || "OTROS").toUpperCase(),
        stock: obj["stock"] || ""
      };
    });
    return lista;
  } catch (e) {
    console.error("Error cargando productos:", e);
    return [];
  }
}

/**
 * Renderiza las categorías y productos en el DOM
 */
export async function renderCategoriasYProductos() {
  const productos = await obtenerProductos();
  const categorias = [...new Set(productos.map(p => p.categoria))];
  const contCats = document.getElementById("categorias");
  const contProds = document.getElementById("productos");

  // categorias
  if (contCats) {
    contCats.innerHTML = categorias.map(c => `<button class="cat-btn" data-cat="${c}">${c}</button>`).join("");
    contCats.querySelectorAll(".cat-btn").forEach(b => {
      b.addEventListener("click", e => {
        document.querySelectorAll(".cat-btn").forEach(x=>x.classList.remove("activo"));
        e.target.classList.add("activo");
        renderProductos(productos.filter(p=>p.categoria===e.target.dataset.cat));
      });
    });
  }

  // productos (inicio: mostrar todos)
  if (contProds) renderProductos(productos);
}

/**
 * renderProductos(lista)
 * Genera las tarjetas que el carrito-animado espera (.producto con estructura interna)
 */
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

// util
function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
