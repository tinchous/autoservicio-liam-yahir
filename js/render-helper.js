// js/render-helper.js
// Render de tarjetas y badges. No usa modules para evitar problemas con <script defer>.

(function(){
  function escapeHTML(s=""){ return (s+'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function formatMoney(n){ return `$${Number(n||0).toFixed(2)}`; }

  function isFlagTrue(v){
    if (v === true) return true;
    if (!v && v !== 0) return false;
    const s = (v + "").toLowerCase().trim();
    return s === "si" || s === "yes" || s === "true" || s === "1";
  }

  function renderProductos(lista, contId="productos"){
    const cont = document.getElementById(contId);
    if (!cont) { console.warn("[render-helper] contenedor no encontrado:", contId); return; }
    const html = (lista || []).map((p, i) => {
      const oferta = isFlagTrue(p.oferta);
      const nuevo = isFlagTrue(p.nuevo);
      const mas_vendido = isFlagTrue(p.mas_vendido);
      const ofertaBadge = oferta ? `<div class="badge oferta">OFERTA</div>` : "";
      const nuevoBadge  = nuevo  ? `<div class="badge nuevo">NUEVO</div>` : "";
      const masBadge    = mas_vendido ? `<div class="badge mas_vendido">MÁS VENDIDO</div>` : "";
      const imagen = escapeHTML(p.imagen || 'images/products/placeholder.png');
      const categoria = escapeHTML(p.categoria || "");
      return `
      <article class="producto" data-nombre="${escapeHTML(p.nombre)}" data-precio="${Number(p.precio||0)}" data-imagen="${imagen}" data-categoria="${categoria}">
        <div class="card-media" style="position:relative">
          ${ofertaBadge}${nuevoBadge}${masBadge}
          <img loading="lazy" src="${imagen}" alt="${escapeHTML(p.nombre)}">
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(p.nombre)}</h3>
          <div class="card-cat">${categoria}</div>
          <div class="card-price">${formatMoney(p.precio)}</div>
          <div class="card-qty" aria-label="Cantidad">
            <button class="menos" aria-label="Disminuir">−</button>
            <input class="qty-input" type="number" min="1" value="1" aria-label="Cantidad del producto" title="Cantidad">
            <button class="mas" aria-label="Aumentar">+</button>
          </div>
          <button class="btn-agregar btn" aria-label="Agregar al carrito">Agregar al Carrito</button>
        </div>
      </article>
      `;
    }).join("");
    cont.innerHTML = html;
    attachCardDelegation(cont);
  }

  function attachCardDelegation(container){
    if (!container) return;
    container.querySelectorAll(".producto").forEach(card=>{
      if (card.dataset.bound === "1") return;
      card.dataset.bound = "1";

      const btnMas = card.querySelector(".mas");
      const btnMenos = card.querySelector(".menos");
      const input = card.querySelector(".qty-input");
      const add = card.querySelector(".btn-agregar");

      btnMas?.addEventListener("click", ()=> { input.value = Number(input.value||1) + 1; });
      btnMenos?.addEventListener("click", ()=> { input.value = Math.max(1, Number(input.value||1) - 1); });

      add?.addEventListener("click", ()=>{
        const evDetail = {
          nombre: card.dataset.nombre,
          precio: Number(card.dataset.precio || 0),
          cantidad: Number(input.value || 1),
          imagen: card.dataset.imagen || card.querySelector("img")?.src || "images/products/placeholder.png",
          categoria: card.dataset.categoria || ""
        };
        window.dispatchEvent(new CustomEvent("agregarAlCarritoDesdeTarjeta", { detail: evDetail }));
        // feedback rápido
        add.textContent = "✓ Agregado";
        setTimeout(()=> add.textContent = "Agregar al Carrito", 900);
      });
    });
  }

  // export
  window.renderProductos = renderProductos;
  window.isFlagTrue = isFlagTrue;
})();
