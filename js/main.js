// main.js
import { renderProductos, obtenerProductos } from "./data.js";
import { renderCarrito } from "./cart.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Si la URL trae ?cat=XYZ mostramos filtrado inicial
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat") || "";

  const productos = await obtenerProductos();
  renderCarrito();

  if (catParam) {
    const filtrados = productos.filter(p=> p.categoria.toUpperCase() === catParam.toUpperCase());
    renderProductos(filtrados);
    // preseleccionar en el sidebar si existe
    const sel = document.getElementById("filter-categoria");
    if (sel) {
      sel.value = catParam.toUpperCase();
    }
  } else {
    renderProductos(productos);
  }
});
