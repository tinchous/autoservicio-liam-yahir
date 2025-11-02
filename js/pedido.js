// pedido.js
import { CONFIG } from "./config.js";
import { obtenerCarrito, vaciarCarrito } from "./cart.js";

async function enviarPedido(nombre, email, direccion) {
  const carrito = obtenerCarrito();
  if (!carrito || carrito.length === 0) { alert("El carrito está vacío."); return; }
  const total = carrito.reduce((a,p)=> a + p.precio * p.cantidad, 0);
  const productosTxt = carrito.map(p=> `${p.nombre} (${p.cantidad})`).join(" - ");
  const fecha = new Date().toLocaleString("es-UY");

  // Guardar en Google Sheets (append)
  const body = {
    values: [[nombre, email, direccion, productosTxt, total, fecha, "Pendiente"]]
  };

  try {
    const appendURL = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_PEDIDOS}:append?valueInputOption=RAW&key=${CONFIG.API_KEY}`;
    await fetch(appendURL, { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
  } catch (e) {
    console.warn("No se pudo registrar en Sheets:", e);
  }

  // Abrir WhatsApp con resumen
  const mensaje = `🛒 Pedido Liam-Yahir\n\n👤 ${nombre}\n📧 ${email}\n🏠 ${direccion}\n\n🧾 Productos:\n${productosTxt}\n\n💰 Total: $${total}\n📅 ${fecha}`;
  const wa = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(wa, "_blank");

  // Vaciar carrito y redirigir
  vaciarCarrito();
  alert("Pedido registrado. Se abrirá WhatsApp para confirmar.");
  window.location.href = "index.html";
}

// conectar form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pedido");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.querySelector("#nombre").value.trim();
    const email = form.querySelector("#email").value.trim();
    const direccion = form.querySelector("#direccion").value.trim();
    if(!nombre || !direccion) { alert("Completá nombre y dirección."); return; }
    enviarPedido(nombre,email,direccion);
  });
});
