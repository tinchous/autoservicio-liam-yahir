const USERS_KEY = "liam_users";
const ACTIVE_USER_KEY = "liam_active_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getActiveUser() {
  return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY) || "null");
}
function setActiveUser(user) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}
function logoutUser() {
  localStorage.removeItem(ACTIVE_USER_KEY);
  location.reload();
}

async function syncUserToSheets(user) {
  if (typeof USERS_WEBAPP_URL === "undefined") return;
  await fetch(USERS_WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
}

// Registro
async function registerUser(data) {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    alert("⚠️ Este email ya está registrado.");
    return false;
  }
  const newUser = {
    id: Date.now().toString(),
    email: data.email,
    nombre: data.nombre,
    password: data.password,
    telefono: data.telefono,
    direccion: data.direccion,
    rol: "cliente",
    activo: true,
    fechaRegistro: new Date().toLocaleString()
  };
  users.push(newUser);
  saveUsers(users);
  await syncUserToSheets(newUser);
  setActiveUser(newUser);
  alert("✅ Registro exitoso y guardado en la base de datos.");
  location.reload();
  return true;
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert("❌ Email o contraseña incorrectos.");
    return false;
  }
  setActiveUser(user);
  alert(`👋 Bienvenido, ${user.nombre}!`);
  location.reload();
  return true;
}
