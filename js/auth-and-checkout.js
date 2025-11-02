// js/auth-and-checkout.js
import { CONFIG } from "./config.js";
import { getCartSnapshot, vaciarCarritoUI } from "./cart-ui.js";

const USERS_KEY = "liamyahir_users";
const SESSION_KEY = "liamyahir_session";
const PEDIDOS_KEY = "liamyahir_pedidos";

function log(...a){ console.log("[AUTH]",...a); }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function loadUsers(){ try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch(e){ return []; } }
function setSession(v){ localStorage.setItem(SESSION_KEY, JSON.stringify(v)); refreshHeaderSession(); }
function getSession(){ try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch(e){ return null; } }
function clearSession(){ localStorage.removeItem(SESSION_KEY); refreshHeaderSession(); }

window.getSession = getSession;
window.clearSession = clearSession;

async function fetchUsersFromSheet(){
  if (!CONFIG.SHEET_ID || !CONFIG.API_KEY) return loadUsers();
  try {
    const range = CONFIG.RANGE_USUARIOS || "Usuarios!A:Z";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(range)}?key=${CONFIG.API_KEY}`;
    const res = await fetch(url); const json = await res.json();
    if (!json.values || json.values.length < 2) return loadUsers();
    const [headers, ...rows] = json.values;
    const h = headers.map(x => (x||'').toString().toLowerCase());
    const idxName = h.findIndex(x=>x.includes("nombre")||x.includes("apodo"));
    const idxPhone = h.findIndex(x=>x.includes("telefono")||x.includes("celular"));
    const idxEmail = h.findIndex(x=>x.includes("email"));
    const idxPass = h.findIndex(x=>x.includes("pass")||x.includes("contrase"));
    const out = rows.map(r => ({
      name: r[idxName]||"",
      phone: r[idxPhone]||"",
      email: r[idxEmail]||"",
      password: r[idxPass]||""
    }));
    saveUsers(out);
    return out;
  } catch(e){ console.warn(e); return loadUsers(); }
}

async function registerUserToSheet(payload){
  // try webhook first
  if (typeof window.postRegisterToWebhook === "function") {
    try {
      const res = await window.postRegisterToWebhook(payload);
      if (res && res.ok) { setSession({ name: payload.name, email: payload.email, phone: payload.phone }); return payload; }
    } catch(e){ console.warn(e); }
  }
  // fallback: save local
  const users = loadUsers(); users.push(payload); saveUsers(users);
  setSession({ name: payload.name, email: payload.email, phone: payload.phone });
  return payload;
}

async function loginUserViaSheet(email, pass){
  try {
    const users = await fetchUsersFromSheet();
    const u = users.find(x => (x.email||"").toLowerCase() === (email||"").toLowerCase());
    if (!u) throw new Error("Usuario no encontrado");
    if (!u.password) throw new Error("Usuario sin contraseña en sheet");
    if (u.password !== pass) throw new Error("Contraseña incorrecta");
    setSession({ name: u.name || u.email, email: u.email, phone: u.phone });
    return u;
  } catch(e){ throw e; }
}

function savePedidoLocal(pedido){
  try {
    const arr = JSON.parse(localStorage.getItem(PEDIDOS_KEY) || "[]");
    arr.push(pedido);
    localStorage.setItem(PEDIDOS_KEY, JSON.stringify(arr));
  } catch(e){ console.error(e); }
}

function genOrderId(){ return 'ORD-' + Date.now().toString(); }
function money(n){ return Number(n||0).toFixed(2); }

function buildWhatsAppMessage(orderId, cliente, direccion, items, subtotal, envio, total, metodoPago){
  const fecha = new Date().toLocaleString();
  const itemsText = items.map(it => `☐ ${it.cantidad}x ${it.nombre} - $${money(it.precio)} c/u = *$${money(Number(it.precio)*Number(it.cantidad))}*`).join("\n");
  const checklist = [
    `☐ Separar productos (${items.length} item${items.length>1?'s':''})`,
    "☐ Confirmar stock",
    "☐ Preparar pedido",
    "☐ Calcular tiempo entrega",
    "☐ Asignar repartidor"
  ].join("\n");
  const lines = [];
  lines.push("👋 *HOLA AUTO SERVICE LIAM YAHIR!* 👋");
  lines.push("");
  lines.push(`*PEDIDO WEB N° ${orderId}*`);
  lines.push("══════════════════════════════=");
  lines.push("");
  lines.push("*🧾 CLIENTE*");
  lines.push(`• Nombre: ${cliente.nombre}`);
  lines.push(`• Teléfono: ${cliente.telefono}`);
  if (cliente.email) lines.push(`• Email: ${cliente.email}`);
  lines.push(`• Tipo: ${cliente.tipo}`);
  lines.push("");
  lines.push("*📍 ENTREGA*");
  lines.push(direccion || "• (sin dirección)");
  lines.push("");
  lines.push("*🧾 DETALLE DEL PEDIDO*");
  lines.push(itemsText);
  lines.push("");
  lines.push("*💳 PAGO*");
  lines.push(`• Subtotal: $${money(subtotal)}`);
  lines.push(`• 🚚 Delivery: $${money(envio)}`);
  lines.push(`• Método: 💳 *${metodoPago}*`);
  lines.push(`• *TOTAL: $${money(total)}*`);
  lines.push("");
  lines.push("*🧾 CHECKLIST PREPARACIÓN*");
  lines.push(checklist);
  lines.push("");
  lines.push(`*Pedido web - ${fecha}*`);
  lines.push("────────────────");
  return lines.join("\n");
}

/* --------- Header session (show name & open dashboard) ---------- */
function refreshHeaderSession(){
  const sess = getSession();
  const loginBtn = document.getElementById("login-toggle");
  if (!loginBtn) return;
  if (sess && sess.name) {
    loginBtn.textContent = sess.name.split(" ")[0];
    loginBtn.classList.add("logged");
    loginBtn.onclick = (e) => { e.preventDefault(); if (typeof openDashboard === "function") openDashboard(); else {
      const dash = document.getElementById("dashboard-modal");
      if (dash) { dash.style.display='flex'; dash.setAttribute('aria-hidden','false'); }
    }};
  } else {
    loginBtn.textContent = "Ingresar / Registrar";
    loginBtn.classList.remove("logged");
    loginBtn.onclick = (e)=> { e.preventDefault(); document.getElementById("auth-modal") && (document.getElementById("auth-modal").style.display='flex'); };
  }
}
window.refreshHeaderSession = refreshHeaderSession;

/* ---------- DOM wiring ---------- */
document.addEventListener("DOMContentLoaded", ()=> {
  // tabs
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> {
      document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-content").forEach(tc=>tc.classList.add("hidden"));
      const id = "tab-" + btn.dataset.tab;
      const target = document.getElementById(id);
      if (target) target.classList.remove("hidden");
    });
  });

  document.getElementById("login-toggle")?.addEventListener("click", (e)=> {
    e.preventDefault();
    const sess = getSession();
    if (sess && sess.name) {
      // if logged, open dashboard
      refreshHeaderSession();
      if (typeof openDashboard === "function") openDashboard();
    } else {
      document.getElementById("auth-modal") && (document.getElementById("auth-modal").style.display='flex');
    }
  });

  // register
  const fr = document.getElementById("form-register");
  if (fr) fr.addEventListener("submit", async (ev)=> {
    ev.preventDefault();
    const payload = {
      name: document.getElementById("reg-name").value.trim(),
      address: document.getElementById("reg-address").value.trim(),
      phone: document.getElementById("reg-phone").value.trim(),
      paymethod: document.getElementById("reg-paymethod")?.value || "EFECTIVO",
      notes: document.getElementById("reg-notes")?.value?.trim() || "",
      email: document.getElementById("reg-email").value.trim(),
      password: document.getElementById("reg-pass").value
    };
    if (!payload.email || !payload.password || !payload.name) { alert("Completá Nombre, Email y Contraseña."); return; }
    await registerUserToSheet(payload);
    alert("Registrado y logueado ✅");
    document.getElementById("auth-modal").style.display='none';
    refreshHeaderSession();
  });

  // login
  const fl = document.getElementById("form-login");
  if (fl) fl.addEventListener("submit", async (ev)=> {
    ev.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-pass").value;
    if (!email || !pass) { alert("Completá email y contraseña."); return; }
    try {
      await loginUserViaSheet(email, pass);
      alert("Bienvenido!");
      document.getElementById("auth-modal").style.display='none';
      refreshHeaderSession();
    } catch(sheetErr){
      // fallback local
      const localUsers = loadUsers();
      const u = localUsers.find(x=> (x.email||"").toLowerCase() === email.toLowerCase());
      if (!u) { alert("Usuario no encontrado"); return; }
      if (u.password !== pass) { alert("Contraseña incorrecta"); return; }
      setSession({ name: u.name || u.email, email: u.email, phone: u.phone });
      alert("Bienvenido (fallback local)!");
      document.getElementById("auth-modal").style.display='none';
      refreshHeaderSession();
    }
  });

  // checkout modal opening hooked by cart-ui: we listen for custom event
  window.addEventListener("checkout-request", ()=>{
    const session = getSession();
    if (session) {
      document.getElementById("c-name").value = session.name || "";
      document.getElementById("c-phone").value = session.phone || "";
      document.getElementById("c-email").value = session.email || "";
      document.getElementById("c-type").value = "Cliente Registrado";
    } else {
      document.getElementById("c-type").value = "Invitado";
    }
    document.getElementById("checkout-modal").style.display='flex';
  });

  // checkout submit
  const fco = document.getElementById("form-checkout");
  if (fco) fco.addEventListener("submit", async (ev)=> {
    ev.preventDefault();
    const cliente = {
      nombre: document.getElementById("c-name").value.trim(),
      telefono: document.getElementById("c-phone").value.trim(),
      email: document.getElementById("c-email").value.trim(),
      tipo: document.getElementById("c-type").value || "Invitado"
    };
    const direccion = document.getElementById("c-address").value.trim();
    const metodoPago = document.getElementById("c-paymethod").value || "EFECTIVO";
    if (!cliente.nombre || !cliente.telefono || !direccion) { alert("Completá Nombre, Teléfono y Dirección."); return; }

    let snapshot = [];
    try { snapshot = (typeof getCartSnapshot === "function") ? getCartSnapshot() : window.getCartSnapshot(); } catch(e){ snapshot = []; }
    if (!snapshot || snapshot.length === 0) { alert("Carrito vacío"); return; }

    const subtotal = snapshot.reduce((s,it) => s + (Number(it.precio) * Number(it.cantidad)), 0);
    const envio = subtotal >= (Number(CONFIG.FREE_DELIVERY_THRESHOLD || 1500)) ? 0 : Number(CONFIG.DELIVERY_FEE || 50);
    const total = subtotal + envio;
    const orderId = genOrderId();

    const mensaje = buildWhatsAppMessage(orderId, cliente, direccion, snapshot, subtotal, envio, total, metodoPago);

    // open WhatsApp
    const waNum = (CONFIG.WHATSAPP || "").replace(/\D/g,'') || "59892308828";
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(mensaje)}`;
    window.open(waUrl, "_blank");

    // build pedido object
    const pedidoObj = {
      id: orderId,
      fecha: new Date().toISOString(),
      cliente,
      direccion,
      items: snapshot,
      subtotal,
      envio,
      total,
      metodoPago
    };

    // save local
    savePedidoLocal(pedidoObj);

    // send to webhook if available
    try {
      if (typeof window.postPedidoToWebhook === "function") await window.postPedidoToWebhook(pedidoObj);
      else if (CONFIG.PEDIDOS_WEBHOOK) await fetch(CONFIG.PEDIDOS_WEBHOOK, { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ action:"save_pedido", pedido: pedidoObj, secret: window.WEBHOOK_SECRET || CONFIG.WEBHOOK_SECRET }) });
    } catch(e){ console.warn("webhook error", e); }

    // empty cart
    try { vaciarCarritoUI(); } catch(e){}
    document.getElementById("checkout-modal").style.display='none';
    alert("Pedido enviado por WhatsApp. ¡Gracias!");
  });

  document.getElementById("checkout-cancel")?.addEventListener("click", ()=> { document.getElementById("checkout-modal").style.display='none'; });

  // header init
  refreshHeaderSession();
});
