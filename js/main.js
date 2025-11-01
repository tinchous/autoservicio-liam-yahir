// AutoService Liam Yahir - Login & Registro (localStorage)
const USER_KEY = "liam_user";

document.addEventListener("DOMContentLoaded", () => {
  renderHeaderLogin();
});

function showLoginModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "login-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Ingresar / Registrar</h2>
      <form id="auth-form">
        <input type="text" id="nombre" placeholder="Nombre completo" required />
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="text" id="telefono" placeholder="Teléfono (+598...)" required />
        <input type="text" id="direccion" placeholder="Dirección" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <select id="pago">
          <option value="">Forma de pago preferida</option>
          <option>POS</option>
          <option>Efectivo</option>
        </select>
        <button type="submit" class="cta-button">Guardar y continuar</button>
      </form>
      <button onclick="closeModal()">❌ Cerrar</button>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById("auth-form").addEventListener("submit", saveUser);
}

function saveUser(e) {
  e.preventDefault();
  const user = {
    nombre: nombre.value,
    email: email.value,
    telefono: telefono.value,
    direccion: direccion.value,
    password: password.value,
    pago: pago.value,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  alert(`👋 Bienvenido, ${user.nombre}!`);
  closeModal();
  renderHeaderLogin();
}

function closeModal() {
  const modal = document.getElementById("login-modal");
  if (modal) modal.remove();
}

function renderHeaderLogin() {
  const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  const accountLink = document.getElementById("account-li");
  const loginLinks = document.querySelectorAll('[onclick="showLoginModal()"]');
  if (user.nombre) {
    if (accountLink) accountLink.style.display = "inline";
    loginLinks.forEach(l => (l.style.display = "none"));
  } else {
    if (accountLink) accountLink.style.display = "none";
    loginLinks.forEach(l => (l.style.display = "inline"));
  }
}

function getActiveUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
}
