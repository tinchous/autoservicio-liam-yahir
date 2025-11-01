// Dashboard - AutoService Liam Yahir 🎃
const DASH_KEY = "liam_orders";

document.addEventListener("DOMContentLoaded", initDashboard);

function initDashboard() {
  const user = JSON.parse(localStorage.getItem("liam_user") || "{}");
  const orders = JSON.parse(localStorage.getItem(DASH_KEY) || "[]");

  if (!user.nombre) {
    document.body.innerHTML = `
      <div class="container">
        <h2>Debes iniciar sesión</h2>
        <a href="index.html" class="cta-button">Ir al inicio</a>
      </div>`;
    return;
  }

  renderUser(user, orders);
  renderOrders(orders);
}

function renderUser(user, orders) {
  const userInfo = document.getElementById("user-info");
  const totalOrders = orders.length;
  const level = getLevel(totalOrders);

  userInfo.innerHTML = `
    <div class="user-card">
      <h2>👋 Hola, ${user.nombre}</h2>
      <p>📞 ${user.telefono}</p>
      <p>🏠 ${user.direccion}</p>
      <p><b>Pedidos realizados:</b> ${totalOrders}</p>
      <p><b>Nivel:</b> ${level.icon} ${level.text}</p>
    </div>`;
}

function renderOrders(orders) {
  const ordersDiv = document.getElementById("orders");
  if (!orders.length) {
    ordersDiv.innerHTML = `<p>No hay pedidos registrados todavía.</p>`;
    return;
  }

  const rows = orders.map(o => `
      <tr><td>${o.id}</td><td>${o.fecha}</td><td>$${o.total}</td><td>${o.estado || "Pendiente"}</td></tr>`).join("");

  ordersDiv.innerHTML = `
    <h3>Mis pedidos recientes</h3>
    <table class="orders-table">
      <thead><tr><th>Orden</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function getLevel(c) {
  if (c >= 10) return { icon: "💀", text: "Cliente legendario" };
  if (c >= 5) return { icon: "🔥", text: "Cliente frecuente" };
  if (c >= 1) return { icon: "🧡", text: "Cliente nuevo" };
  return { icon: "🕸️", text: "Sin pedidos aún" };
}

function logout() {
  localStorage.removeItem("liam_user");
  window.location.href = "index.html";
}
