// efecto-luces.js
document.addEventListener("DOMContentLoaded", () => {
  const luz = document.createElement("div");
  luz.id = "luz-animada";
  document.body.appendChild(luz);

  const colores = ["#ff3b3b", "#ff8c00", "#ffae00", "#00ffff"];
  let colorIndex = 0;
  Object.assign(luz.style, {
    position: "fixed", width: "220px", height: "220px", pointerEvents: "none",
    borderRadius: "50%", mixBlendMode: "screen", zIndex: 5,
    background: `radial-gradient(circle, ${colores[colorIndex]}33 0%, transparent 70%)`,
    filter: "blur(60px)", opacity: 0.6, transition: "background .6s ease, opacity .3s ease"
  });

  let timer;
  document.addEventListener("mousemove", e => {
    luz.style.left = (e.clientX - 110) + "px";
    luz.style.top = (e.clientY - 110) + "px";
    luz.style.opacity = 0.85;
    clearTimeout(timer);
    timer = setTimeout(()=> luz.style.opacity = 0.35, 1200);
  });

  setInterval(()=> {
    colorIndex = (colorIndex + 1) % colores.length;
    luz.style.background = `radial-gradient(circle, ${colores[colorIndex]}33 0%, transparent 70%)`;
  }, 2200);
});
