/**
 * 🚀 carrito-animado.js
 * Autor: Tino & Onit 🤖
 * - Controla los botones + y −
 * - Enlaza el botón "Agregar al Carrito" al carrito real
 * - Añade animación tipo "vuelo" del producto al carrito
 */

import { agregarAlCarrito } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  // Asignar listeners a todos los productos
  document.querySelectorAll(".producto").forEach(card => {
    const input = card.querySelector("input");
    const btnMas = card.querySelector(".cantidad button:nth-child(3)");
    const btnMenos = card.querySelector(".cantidad button:nth-child(1)");
    const btnAgregar = card.querySelector(".btn-agregar");

    // Controles de cantidad
    btnMas.addEventListener("click", () => {
      input.value = parseInt(input.value) + 1;
    });
    btnMenos.addEventListener("click", () => {
      const val = parseInt(input.value);
      if (val > 1) input.value = val - 1;
    });

    // Agregar al carrito con animación
    btnAgregar.addEventListener("click", () => {
      const nombre = card.querySelector("h3").textContent;
      const precio = parseFloat(card.querySelector(".precio").textContent.replace("$", ""));
      const cantidad = parseInt(input.value);

      agregarAlCarrito({ nombre, precio, cantidad });
      animarVuelo(card);
    });
  });
});

/**
 * 💫 Animación de vuelo del producto al carrito
 */
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

  // Volar hacia el carrito
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

  // Eliminar después de la animación
  setTimeout(() => clone.remove(), 1100);
}
