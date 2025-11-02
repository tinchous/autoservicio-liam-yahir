// main.js
import { renderCategoriasYProductos } from "./data.js";
import { renderCarrito } from "./cart.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderCategoriasYProductos();
  renderCarrito();
});
