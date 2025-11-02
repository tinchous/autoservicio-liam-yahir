// cart.js
// Carrito simple basado en localStorage
export let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

export function obtenerCarrito() {
  return carrito;
}

export function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

export function agregarAlCarrito(producto) {
  // producto: { nombre, precio, cantidad, imagen?, categoria? }
  const existente = carrito.find(p => p.nombre === producto.nombre);
  const cantidad = producto.cantidad ? Number(producto.cantidad) : 1;
  if (existente) {
    existente.cantidad = Number(existente.cantidad || 1) + cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }
  guardarCarrito();
}

export function cambiarCantidad(nombre, delta) {
  const item = carrito.find(i => i.nombre === nombre);
  if (!item) return;
  item.cantidad = Math.max(0, Number(item.cantidad || 0) + delta);
  if (item.cantidad === 0) carrito = carrito.filter(i => i.nombre !== nombre);
  guardarCarrito();
}

export function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

export function renderCarrito() {
  const cont = document.querySelector(".carrito-flotante") || document.getElementById("carrito");
  if (!cont) return;
  if (carrito.length === 0) {
    cont.innerHTML = `<p class="empty">🛒 Carrito vacío</p>`; return;
  }
  const itemsHTML = carrito.map(p => `
    <div class="item">
      <div>
        <div style="font-weight:700">${p.nombre}</div>
        <div style="font-size:.86rem;color:#ccc">${p.cantidad} x $${p.precio}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">$${(p.precio * p.cantidad).toFixed(0)}</div>
      </div>
    </div>
  `).join("");
  const total = carrito.reduce((a,p) => a + (p.precio * p.cantidad), 0);
  cont.innerHTML = `${itemsHTML}<div class="total">Total: $${total.toFixed(0)}</div>
    <div style="margin-top:8px;text-align:center"><a class="btn" href="pedido.html" style="background:#ff8c00;padding:8px 12px;border-radius:8px;color:#000;font-weight:700;text-decoration:none">Finalizar pedido</a></div>`;
}

// Hacer accesible en window por compatibilidad
window.agregarAlCarrito = (p) => agregarAlCarrito(p);
window.renderCarrito = () => renderCarrito();

// Inicial render
document.addEventListener("DOMContentLoaded", () => { renderCarrito(); });
