import { CONFIG } from "./config.js";

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

export function agregarAlCarrito(prod) {
  const item = carrito.find(p => p.nombre === prod.nombre);
  if (item) item.cantidad++;
  else carrito.push({ ...prod, cantidad: 1 });
  guardar();
}

export function cambiarCantidad(nombre, delta) {
  const item = carrito.find(p => p.nombre === nombre);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(p => p.nombre !== nombre);
  guardar();
}

export function vaciarCarrito() {
  carrito = [];
  guardar();
}

export function obtenerCarrito() {
  return carrito;
}

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

export function renderCarrito() {
  const c = document.getElementById("carrito");
  if (!c) return;
  if (carrito.length === 0) {
    c.innerHTML = "<p>🛒 Carrito vacío</p>";
    return;
  }
  c.innerHTML = carrito.map(p => `
    <div class="item">
      <span>${p.nombre}</span>
      <div class="qty">
        <button onclick="cambiarCantidad('${p.nombre}',-1)">−</button>
        <span>${p.cantidad}</span>
        <button onclick="cambiarCantidad('${p.nombre}',1)">+</button>
      </div>
      <span>$${p.precio * p.cantidad}</span>
    </div>
  `).join("");

  const total = carrito.reduce((a, p) => a + (p.precio * p.cantidad), 0);
  c.innerHTML += `<div class="total">Total: $${total}</div>
  <a href="pedido.html" class="btn-finalizar">Finalizar pedido</a>`;
}

window.cambiarCantidad = cambiarCantidad;
window.renderCarrito = renderCarrito;
