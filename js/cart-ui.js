// js/cart-ui.js
// Manejo completo del carrito. No usa import. Depende de window.CONFIG y funciones globales definidas en otros scripts.

(function(){
  const STORAGE_KEY = "carrito_liamyahir_v5";
  let carrito = loadFromStorage();

  function loadFromStorage(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch(e){ return []; } }
  function saveToStorage(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); dispatchCartUpdate(); }
  function dispatchCartUpdate(){ window.dispatchEvent(new CustomEvent("cart-updated",{detail:{length:countItems(),total:calcTotal()}})); }

  function calcTotal(){ return carrito.reduce((s,it)=> s + (Number(it.precio||0)*Number(it.cantidad||0)), 0); }
  function countItems(){ return carrito.reduce((s,it)=> s + Number(it.cantidad||0), 0); }
  function fmt(n){ return `$${Number(n||0).toFixed(2)}`; }
  function esc(s=""){ return (s+'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  // expose simple API
  window.getCartSnapshot = () => JSON.parse(JSON.stringify(carrito || []));

  function agregarAlCarrito(item){
    try {
      const nombre = String(item.nombre || "Sin nombre");
      const precio = Number(item.precio || 0);
      const cantidad = Math.max(1, Number(item.cantidad || 1));
      const imagen = item.imagen || "images/products/placeholder.png";

      const idx = carrito.findIndex(p => p.nombre === nombre);
      if (idx !== -1) carrito[idx].cantidad = Math.max(1, Number(carrito[idx].cantidad||0) + cantidad);
      else carrito.push({ nombre, precio, cantidad, imagen });

      saveToStorage(); renderPanel(); flashCartIcon(); return true;
    } catch(e){ console.error(e); return false; }
  }
  window.agregarAlCarrito = agregarAlCarrito;

  function ensureCartFooter(panel){
    if (!panel) return null;
    let footer = panel.querySelector(".cart-footer");
    if (footer) return footer;
    footer = document.createElement("div");
    footer.className = "cart-footer";
    footer.style.padding = "12px";
    footer.style.borderTop = "1px solid rgba(255,255,255,0.04)";
    footer.innerHTML = `
      <div id="cart-total" style="margin-bottom:8px;font-weight:700">Subtotal: $0.00</div>
      <div id="delivery-gap" style="margin-bottom:8px;color:#ddd"></div>
      <div style="display:flex;gap:8px;justify-content:space-between;align-items:center">
        <div>
          <button id="vaciar-carrito" class="btn">Vaciar</button>
          <button id="seguir-comprando" class="btn">Seguir Comprando</button>
        </div>
        <div>
          <button id="checkout-whatsapp" class="btn primary">Finalizar Pedido</button>
        </div>
      </div>
    `;
    panel.appendChild(footer);
    // handlers
    panel.querySelector("#vaciar-carrito")?.addEventListener("click", ()=> {
      if (confirm("Vaciar carrito?")) { carrito = []; saveToStorage(); renderPanel(); }
    });
    panel.querySelector("#seguir-comprando")?.addEventListener("click", ()=> {
      panel.classList.remove("open");
      if (!location.pathname.includes("products.html")) location.href = "products.html";
    });
    panel.querySelector("#checkout-whatsapp")?.addEventListener("click", ()=> {
      panel.classList.remove("open");
      window.dispatchEvent(new Event("checkout-request"));
    });
    return footer;
  }

  function renderPanel(){
    const panel = document.getElementById("cart-panel");
    const container = document.getElementById("cart-items");
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = String(countItems());
    if (!panel || !container) return;

    ensureCartFooter(panel);

    if (!carrito || carrito.length === 0) {
      container.innerHTML = `<div style="padding:18px;color:#ddd;text-align:center">🛒 Carrito vacío</div>`;
      panel.querySelector("#cart-total").textContent = `Subtotal: $0.00`;
      const gap = panel.querySelector("#delivery-gap");
      if (gap) {
        const free = Number(window.CONFIG?.FREE_DELIVERY_THRESHOLD || 1500);
        gap.textContent = `Faltan $${free} para envío gratis`;
      }
      return;
    }

    container.innerHTML = carrito.map((it, idx) => `
      <div class="cart-item" data-idx="${idx}" style="display:flex;gap:12px;padding:10px;border-bottom:1px solid rgba(255,255,255,0.03);align-items:center">
        <img src="${esc(it.imagen)}" alt="${esc(it.nombre)}" style="width:64px;height:64px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div style="font-weight:700">${esc(it.nombre)}</div>
          <div style="color:#ccc;font-size:13px">${fmt(it.precio)} c/u</div>
          <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
            <button class="ci-minus btn" data-idx="${idx}" aria-label="Disminuir">−</button>
            <span style="min-width:28px;text-align:center">${it.cantidad}</span>
            <button class="ci-plus btn" data-idx="${idx}" aria-label="Aumentar">+</button>
            <button class="ci-remove btn" data-idx="${idx}" style="margin-left:8px">Eliminar</button>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${fmt(it.precio * it.cantidad)}</div>
        </div>
      </div>
    `).join("");

    const subtotal = calcTotal();
    const totalEl = panel.querySelector("#cart-total");
    if (totalEl) totalEl.textContent = `Subtotal: ${fmt(subtotal)}`;
    const gapEl = panel.querySelector("#delivery-gap");
    const free = Number(window.CONFIG?.FREE_DELIVERY_THRESHOLD || 1500);
    const fee = Number(window.CONFIG?.DELIVERY_FEE || 50);
    if (gapEl) {
      if (subtotal >= free) gapEl.innerHTML = `<strong style="color:#9f6">¡Envío GRATIS!</strong>`;
      else gapEl.textContent = `Envío: $${fee} · Faltan $${Math.max(0, (free - subtotal))}`;
    }

    // attach item events
    panel.querySelectorAll(".ci-plus").forEach(bt => bt.addEventListener("click", e => {
      const idx = Number(bt.dataset.idx); changeQty(idx, +1);
    }));
    panel.querySelectorAll(".ci-minus").forEach(bt => bt.addEventListener("click", e => {
      const idx = Number(bt.dataset.idx); changeQty(idx, -1);
    }));
    panel.querySelectorAll(".ci-remove").forEach(bt => bt.addEventListener("click", e => {
      const idx = Number(bt.dataset.idx); removeIdx(idx);
    }));
  }

  function changeQty(idx, delta){
    if (!carrito[idx]) return;
    carrito[idx].cantidad = Math.max(0, Number(carrito[idx].cantidad || 0) + delta);
    if (carrito[idx].cantidad === 0) carrito.splice(idx, 1);
    saveToStorage(); renderPanel();
  }
  function removeIdx(idx){
    if (!carrito[idx]) return;
    carrito.splice(idx, 1);
    saveToStorage(); renderPanel();
  }

  function flashCartIcon(){
    const icon = document.getElementById("cart-toggle");
    if (!icon) return;
    icon.classList.add("flash");
    setTimeout(()=> icon.classList.remove("flash"), 600);
  }

  function setupUIEvents(){
    // open/close
    document.getElementById("cart-toggle")?.addEventListener("click", ()=> {
      const panel = document.getElementById("cart-panel");
      if (!panel) return;
      panel.classList.toggle("open");
      panel.style.display = panel.classList.contains("open") ? "block" : "none";
    });
    document.getElementById("cart-close")?.addEventListener("click", ()=> {
      const panel = document.getElementById("cart-panel");
      if (!panel) return;
      panel.classList.remove("open");
      panel.style.display = "none";
    });

    // listen add from product cards
    window.addEventListener("agregarAlCarritoDesdeTarjeta", (e) => {
      const d = e.detail || {};
      if (!d || !d.nombre) return;
      agregarAlCarrito({ nombre: d.nombre, precio: d.precio, cantidad: d.cantidad, imagen: d.imagen });
    });
    // listen generic add-to-cart
    window.addEventListener("add-to-cart", (e) => {
      const d = e.detail || {};
      agregarAlCarrito(d);
    });

    // storage sync across tabs
    window.addEventListener("storage", (e)=>{
      if (e.key === STORAGE_KEY) {
        carrito = loadFromStorage();
        renderPanel();
      }
    });
  }

  // init
  document.addEventListener("DOMContentLoaded", ()=>{
    setupUIEvents();
    renderPanel();
    // ensure mobile: small flash when page load if items
    if (countItems()>0) flashCartIcon();
    console.log("[cart-ui] listo");
  });

})();
