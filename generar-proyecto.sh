#!/bin/bash
# ===============================================
# AutoService Liam Yahir - Halloween PRO v2
# Generador local y servidor automático
# ===============================================

RUTA="/media/tino/Externo1/autoservicio-liam-yahir"

echo "🚀 Creando estructura del proyecto en $RUTA..."

mkdir -p "$RUTA"/{css,js,images/{logo,icons,products}}

# --- config.js (modo mantenimiento) ---
cat > "$RUTA/js/config.js" <<'EOF'
const modoMantenimiento = true; // cambiar a false para activar el sitio
const SHEETS_URL = "https://docs.google.com/spreadsheets/d/1MjCExw6iwjcr0ubYgUdklIsWL_3IXn14hSE5qIXpGI4/gviz/tq?tqx=out:csv";
const WHATSAPP_NUMBER = "59892308828";
EOF

# --- index.html simplificado con mantenimiento ---
cat > "$RUTA/index.html" <<'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AutoService Liam & Yahir 🎃</title>
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/halloween.css">
<script src="js/config.js"></script>
<script>
document.addEventListener("DOMContentLoaded",()=>{
  if(modoMantenimiento){
    document.body.innerHTML = `
      <div class="mantenimiento">
        <h1>⚠️ Sitio en actualización</h1>
        <p>Estamos mejorando tu experiencia.<br>
        Podés hacer tu pedido igual por WhatsApp 📲 <b>+59892308828</b></p>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20hacer%20un%20pedido%20mientras%20actualizan%20la%20web"
           class="cta-button">Hacer pedido igual</a>
      </div>`;
  } else {
    document.body.innerHTML = `
      <div class="halloween-banner"><marquee>🎃 ¡Bienvenido a AutoService Liam & Yahir!</marquee></div>
      <header class="header"><div class="container"><nav>
        <ul>
          <li><a href="categories.html">Categorías</a></li>
          <li><a href="products.html">Productos</a></li>
          <li><a href="delivery.html">Delivery</a></li>
          <li><a href="#" onclick="showLoginModal()">Ingresar</a></li>
          <li><a href="dashboard.html" id="account-li" style="display:none;">Mi Cuenta</a></li>
        </ul></nav></div></header>
      <section class="hero"><div class="container">
        <h1>🎃 AutoService Liam Yahir</h1>
        <p>Almacén de barrio con frutas, verduras y delivery rápido</p>
        <a href="products.html" class="cta-button">Ver productos</a>
      </div></section>`;
  }
});
</script>
</head>
<body></body>
</html>
EOF

# --- css/styles.css (básico) ---
cat > "$RUTA/css/styles.css" <<'EOF'
body{margin:0;padding:0;font-family:system-ui;background:#fff;color:#111}
.container{width:90%;max-width:900px;margin:0 auto}
.header{background:#111;color:#fff;padding:.5rem 0}
.header ul{list-style:none;display:flex;justify-content:center;gap:1rem;padding:0}
.header a{color:#ffcc66;text-decoration:none;font-weight:600}
.cta-button{background:#ff6600;color:#000;padding:.7rem 1rem;border-radius:.5rem;text-decoration:none;font-weight:600}
.mantenimiento{text-align:center;padding:5rem 1rem;background:#111;color:#fff;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}
.mantenimiento h1{color:#ffcc66}
EOF

# --- css/halloween.css (tema oscuro) ---
cat > "$RUTA/css/halloween.css" <<'EOF'
body{background:#0a0a0a;color:#f8fafc}
.halloween-banner{background:linear-gradient(90deg,#000,#220000,#ff6600);color:#ffcc66;padding:1rem;text-align:center;text-shadow:0 0 10px #ff6600;animation:flicker 2.5s infinite}
@keyframes flicker{0%,18%,22%,25%,53%,57%,100%{text-shadow:0 0 10px #ff9d00,0 0 20px #ff6600}20%,24%,55%{text-shadow:none}}
EOF

# --- iniciar.sh para abrir servidor local ---
cat > "$RUTA/iniciar.sh" <<'EOF'
#!/bin/bash
cd "$(dirname "$0")"
PORT=5500
python3 -m http.server $PORT >/dev/null 2>&1 &
sleep 1
xdg-open "http://localhost:$PORT" >/dev/null 2>&1
echo "🔥 Servidor iniciado en http://localhost:$PORT"
EOF
chmod +x "$RUTA/iniciar.sh"

echo "✅ Proyecto base creado en: $RUTA"
echo "👉 Para probar localmente, ejecutá:"
echo "   bash iniciar.sh"
