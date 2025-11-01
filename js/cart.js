let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(p) {
  const item = carrito.find(i => i.nombre === p.nombre);
  if (item) item.cantidad++;
  else carrito.push({ ...p, cantidad: 1 });
  guardar();
}

function cambiarCantidad(nombre, delta) {
  const item = carrito.find(i => i.nombre === nombre);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(p => p.nombre !== nombre);
  guardar();
}

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

function renderCarrito() {
  const c = document.getElementById("carrito");
  if (!c) return;
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
}

window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.renderCarrito = renderCarrito;
