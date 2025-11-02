// filters.js
import { obtenerProductos, renderProductos } from "./data.js"; // ajustar exports de data.js

let productosCache = [];

async function initFilters() {
  productosCache = await obtenerProductos(); // obtiene y guarda
  poblarCategorias(productosCache);
  bindUI();
  renderProductos(productosCache);
}

function poblarCategorias(list) {
  const sel = document.getElementById("filter-categoria");
  if (!sel) return;
  const cats = [...new Set(list.map(p => p.categoria))].sort();
  cats.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    sel.appendChild(o);
  });
}

function bindUI() {
  document.getElementById("filter-categoria")?.addEventListener("change", aplicarFiltros);
  document.getElementById("filter-orden")?.addEventListener("change", aplicarFiltros);
  document.getElementById("btn-limpiar-filtros")?.addEventListener("click", () => {
    document.getElementById("filter-categoria").value = "";
    document.getElementById("filter-orden").value = "default";
    renderProductos(productosCache);
  });
}

function aplicarFiltros() {
  const cat = document.getElementById("filter-categoria")?.value || "";
  const orden = document.getElementById("filter-orden")?.value || "default";

  let list = productosCache.slice();

  if (cat) list = list.filter(p => p.categoria === cat);

  // ofertas: ejemplo simple si tiene campo oferta true
  if (orden === "ofertas") list = list.filter(p => p.oferta === true);

  // ordenamientos
  if (orden === "az") list.sort((a,b)=> a.nombre.localeCompare(b.nombre));
  else if (orden === "za") list.sort((a,b)=> b.nombre.localeCompare(a.nombre));
  else if (orden === "precio-asc") list.sort((a,b)=> a.precio - b.precio);
  else if (orden === "precio-desc") list.sort((a,b)=> b.precio - a.precio);

  renderProductos(list);
}

document.addEventListener("DOMContentLoaded", () => { initFilters(); });
