const CART_KEY = "liam_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(p => p.id === product.id);
  if (existing) existing.qty += product.qty;
  else cart.push({ ...product });
  saveCart(cart);
  showToast(`🛒 ${product.qty} × ${product.nombre} agregado`);
}

function changeQty(id, delta) {
  const cart = getCart();
  const p = cart.find(x => x.id === id);
  if (!p) return;
  p.qty += delta;
  if (p.qty <= 0) cart.splice(cart.indexOf(p), 1);
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
}

function vaciarCarrito() {
  saveCart([]);
}

function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((t, p) => t + p.qty, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "100px";
  toast.style.right = "30px";
  toast.style.background = "#ff6600";
  toast.style.color = "#fff";
  toast.style.padding = "0.6rem 1rem";
  toast.style.borderRadius = "0.5rem";
  toast.style.boxShadow = "0 0 10px rgba(255,102,0,0.7)";
  toast.style.zIndex = 2000;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

document.addEventListener("DOMContentLoaded", updateCartUI);
