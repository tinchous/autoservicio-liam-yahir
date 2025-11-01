import { CONFIG } from "./config.js";

export async function obtenerProductos() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_PRODUCTOS}?key=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const [headers, ...rows] = data.values;
  return rows.map(r => Object.fromEntries(headers.map((h, i) => [h.toLowerCase(), r[i]])));
}

export async function renderCategorias() {
  const productos = await obtenerProductos();
  const categorias = [...new Set(productos.map(p => p.categoria))];
  const cont = document.getElementById("categorias");

  cont.innerHTML = categorias.map(cat => `
    <button class="cat-btn" data-cat="${cat}">${cat}</button>
  `).join("");

  document.querySelectorAll(".cat-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderProductos(productos.filter(p => p.categoria === e.target.dataset.cat));
    })
  );

  renderProductos(productos); // muestra todo al inicio
}

export function renderProductos(lista) {
  const cont = document.getElementById("productos");
  cont.innerHTML = lista.map(p => `
    <div class="producto">
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick='agregarAlCarrito(${JSON.stringify(p)})'>🛒 Agregar</button>
    </div>
  `).join("");
}
