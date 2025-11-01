/**
 * 🎇 Efecto de luces neón dinámico
 * Autor: Tino & Onit 🤖
 * Descripción:
 *  - Crea un resplandor suave que sigue al puntero.
 *  - Cambia de color con tonos neón (rojo fuego, naranja, amarillo, cian).
 *  - Le da profundidad visual tipo “cartel iluminado”.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Crear el elemento visual del resplandor
  const luz = document.createElement("div");
  luz.id = "luz-animada";
  document.body.appendChild(luz);

  // Inicializar coordenadas y color
  let x = 0, y = 0;
  const colores = ["#ff3b3b", "#ff8c00", "#ffae00", "#00ffff"];
  let colorIndex = 0;

  // Estilo inicial del div de luz
  Object.assign(luz.style, {
    position: "fixed",
    width: "200px",
    height: "200px",
    pointerEvents: "none",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${colores[colorIndex]}33 0%, transparent 70%)`,
    mixBlendMode: "screen",
    filter: "blur(50px)",
    zIndex: 0,
    opacity: 0.6,
    transition: "background 0.5s ease"
  });

  // Movimiento del mouse
  document.addEventListener("mousemove", e => {
    x = e.clientX - 100;
    y = e.clientY - 100;
    luz.style.transform = `translate(${x}px, ${y}px)`;
  });

  // Cambiar color cíclicamente cada pocos segundos
  setInterval(() => {
    colorIndex = (colorIndex + 1) % colores.length;
    luz.style.background = `radial-gradient(circle, ${colores[colorIndex]}33 0%, transparent 70%)`;
  }, 2000);

  // Foco más tenue cuando no hay movimiento
  let timer;
  document.addEventListener("mousemove", () => {
    luz.style.opacity = 0.8;
    clearTimeout(timer);
    timer = setTimeout(() => {
      luz.style.opacity = 0.3;
    }, 1500);
  });
});
