// carrito-animado.js
// Controla + / - y "Agregar al Carrito" con animación y notificación
import { agregarAlCarrito } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  // Delegado: si las tarjetas se generan después, esto cubre
  document.body.addEventListener("click", (e) => {
    const target = e.target;
    // manejar +
    if (target.matches(".producto .mas") || target.matches(".mas")) {
      const input = target.closest(".producto").querySelector("input[type=number]");
      input.value = Number(input.value || 0) + 1;
    }
    // manejar -
    if (target.matches(".producto .menos") || target.matches(".menos")) {
      const input = target.closest(".producto").querySelector("input[type=number]");
      input.value = Math.max(1, (Number(input.value || 1) - 1));
    }
    // manejar agregar
    if (target.matches(".producto .btn-agregar") || target.matches(".btn-agregar")) {
      const card = target.closest(".producto");
      const nombre = card.dataset.nombre || card.querySelector("h3").textContent.trim();
      const precio = Number(card.dataset.precio || card.querySelector(".precio").textContent.replace(/[^\d.]/g,""));
      const imagen = card.dataset.imagen || card.querySelector("img").src;
      const categoria = card.dataset.categoria || card.querySelector(".categoria").textContent.trim();
      const cantidad = Number(card.querySelector("input[type=number]").value || 1);

      // añadir al carrito (usa cart.js)
      agregarAlCarrito({ nombre, precio, cantidad, imagen, categoria });
      // animación
      animarVuelo(card);
      // notificación
      mostrarNotificacion(nombre);
    }
  });
});

// animación "imagen vuela al carrito"
function animarVuelo(card) {
  const img = card.querySelector("img");
  if (!img) return;
  const clone = img.cloneNode(true);
  const carrito = document.querySelector(".carrito-flotante") || document.getElementById("carrito");
  const rect = img.getBoundingClientRect();

  Object.assign(clone.style, {
    position: "fixed",
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    zIndex: 9999,
    transition: "all 1s cubic-bezier(.2,.9,.2,1)",
    borderRadius: "8px",
    opacity: "0.95"
  });

  document.body.appendChild(clone);
  const carritoRect = (carrito && carrito.getBoundingClientRect()) || { left: window.innerWidth - 80, top: window.innerHeight - 140, width: 40 };

  setTimeout(() => {
    Object.assign(clone.style, {
      left: (carritoRect.left + carritoRect.width/2) + "px",
      top: carritoRect.top + "px",
      width: "40px",
      height: "40px",
      opacity: 0,
      transform: "rotate(360deg) scale(.1)"
    });
  }, 50);

  setTimeout(() => clone.remove(), 1100);
}

// notificación breve
function mostrarNotificacion(nombre) {
  const note = document.createElement("div");
  note.className = "notificacion-neon";
  note.innerHTML = `🛒 <strong>${escapeHtml(nombre)}</strong> agregado <span>+1</span>`;
  document.body.appendChild(note);
  setTimeout(()=> note.classList.add("show"), 10);
  setTimeout(()=> note.classList.remove("show"), 1900);
  setTimeout(()=> note.remove(), 2400);
}

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
