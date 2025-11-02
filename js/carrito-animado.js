/**
 * 🚀 carrito-animado.js (versión extendida)
 * Controla cantidad, agrega productos al carrito y muestra feedback visual.
 */

import { agregarAlCarrito } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".producto").forEach(card => {
    const input = card.querySelector("input");
    const btnMas = card.querySelector(".cantidad button:nth-child(3)");
    const btnMenos = card.querySelector(".cantidad button:nth-child(1)");
    const btnAgregar = card.querySelector(".btn-agregar");

    // 🔢 Control de cantidad
    btnMas.addEventListener("click", () => (input.value = +input.value + 1));
    btnMenos.addEventListener("click", () => (input.value = Math.max(1, +input.value - 1)));

    // 🛒 Agregar al carrito con animación + notificación
    btnAgregar.addEventListener("click", () => {
      const nombre = card.querySelector("h3").textContent;
      const precio = parseFloat(card.querySelector(".precio").textContent.replace("$", ""));
      const cantidad = parseInt(input.value);

      agregarAlCarrito({ nombre, precio, cantidad });
      animarVuelo(card);
      mostrarNotificacion(nombre);
    });
  });
});

/* 💫 Animación del vuelo al carrito */
function animarVuelo(card) {
  const img = card.querySelector("img");
  const clone = img.cloneNode(true);
  const carrito = document.querySelector(".carrito-flotante");

  const rect = img.getBoundingClientRect();
  Object.assign(clone.style, {
    position: "fixed",
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    opacity: "0.9",
    transition: "all 1s ease-in-out",
    zIndex: "9999",
    borderRadius: "10px"
  });
  document.body.appendChild(clone);

  const carritoRect = carrito.getBoundingClientRect();
  setTimeout(() => {
    Object.assign(clone.style, {
      left: carritoRect.left + carritoRect.width / 2 + "px",
      top: carritoRect.top + "px",
      width: "40px",
      height: "40px",
      opacity: "0",
      transform: "rotate(360deg)"
    });
  }, 100);
  setTimeout(() => clone.remove(), 1100);
}

/* 💥 Notificación flotante tipo neón */
function mostrarNotificacion(nombre) {
  const nota = document.createElement("div");
  nota.className = "notificacion-neon";
  nota.innerHTML = `🛒 <strong>${nombre}</strong> agregado <span>+1</span>`;
  document.body.appendChild(nota);

  setTimeout(() => nota.classList.add("show"), 10);  // Aparece
  setTimeout(() => nota.classList.remove("show"), 2000); // Desaparece
  setTimeout(() => nota.remove(), 2500);
}
