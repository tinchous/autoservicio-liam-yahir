import { CONFIG } from "./config.js";
import { obtenerCarrito, vaciarCarrito } from "./cart.js";

async function enviarPedido(nombre, email, direccion) {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((a, p) => a + (p.precio * p.cantidad), 0);
  const productosTxt = carrito.map(p => `${p.nombre} (${p.cantidad})`).join(", ");
  const fecha = new Date().toLocaleString("es-UY");

  // Guardar en Google Sheets
  const body = {
    values: [[nombre, email, direccion, productosTxt, total, fecha, "Pendiente"]]
  };

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_PEDIDOS}:append?valueInputOption=RAW&key=${CONFIG.API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  // Enviar a WhatsApp
  const mensaje = `🛒 *Pedido Liam-Yahir 24/7*\n\n👤 ${nombre}\n📧 ${email}\n🏠 ${direccion}\n\n🧾 *Productos:*\n${productosTxt}\n\n💰 Total: $${total}\n📅 ${fecha}`;
  const url = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  vaciarCarrito();
  alert("✅ Pedido registrado con éxito. Se abrirá WhatsApp para confirmar.");
  window.location.href = "index.html";
}

document.getElementById("form-pedido").addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const direccion = document.getElementById("direccion").value;
  enviarPedido(nombre, email, direccion);
});
