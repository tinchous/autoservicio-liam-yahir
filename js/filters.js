// js/filters.js
// Crea el panel izquierdo de filtros (sticky), buscador y orden.
// Requiere window.obtenerProductos() y window.renderProductos()

(function(){
  async function buildFiltersUI(){
    const panel = document.getElementById("filters-panel");
    if (!panel) return;
    panel.innerHTML = `<div class="filters-box">
      <div class="filters-header"><strong>Buscar</strong></div>
      <input id="filter-search" placeholder="Buscar producto..." aria-label="Buscar producto" />
      <div class="filters-header" style="margin-top:10px"><strong>Categorías</strong></div>
      <div id="filters-cats" class="filters-cats"></div>
      <div class="filters-header" style="margin-top:10px"><strong>Etiquetas</strong></div>
      <label><input type="checkbox" id="filter-masvendidos">  🔥 Más vendidos</label><br>
      <label><input type="checkbox" id="filter-oferta">  💸 Ofertas</label><br>
      <label><input type="checkbox" id="filter-nuevo">  ✨ Nuevos</label><br>
      <div class="filters-header" style="margin-top:10px"><strong>Ordenar</strong></div>
      <select id="filter-sort">
        <option value="default">Por defecto</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
        <option value="price_asc">Precio ↑</option>
        <option value="price_desc">Precio ↓</option>
      </select>
    </div>`;

    // styles: make sticky
    panel.querySelector(".filters-box").style.position = "sticky";
    panel.querySelector(".filters-box").style.top = "100px";

    const products = await window.obtenerProductos();
    const cats = Array.from(new Set((products||[]).map(p=> (p.categoria||"OTROS").trim() || "OTROS")));
    const catsCont = document.getElementById("filters-cats");
    catsCont.innerHTML = cats.map(c => `<label><input type="checkbox" class="filter-cat" value="${c}">  ${iconForCategory(c)} ${c}</label>`).join("");

    // wire events
    document.getElementById("filter-search").addEventListener("input", applyFiltersDebounced);
    document.querySelectorAll(".filter-cat").forEach(ch => ch.addEventListener("change", applyFilters));
    document.getElementById("filter-masvendidos").addEventListener("change", applyFilters);
    document.getElementById("filter-oferta").addEventListener("change", applyFilters);
    document.getElementById("filter-nuevo").addEventListener("change", applyFilters);
    document.getElementById("filter-sort").addEventListener("change", applyFilters);

    // initial render
    applyFilters();
  }

  function iconForCategory(c){
    // emojis simples para alegrar
    const map = {
      "FRUTAS": "🍎","VERDURAS":"🥦","CARNES":"🥩","EMBUTIDOS":"🥓","LACTEOS":"🥛","BEBIDAS":"🥤","PANADERIA":"🥐",
      "SNACKS/DULCES":"🍫","TABACO":"🚬","ROTISERIA":"🍗","FIAMBRERIA":"🧀","MASCOTAS":"🐶","ALMACEN":"🏪"
    };
    // try match keywords
    const key = c.toUpperCase();
    for (const k in map) if (key.includes(k)) return map[k];
    // default
    return "📦";
  }

  let lastProducts = null;
  async function applyFilters(){
    const products = lastProducts || (lastProducts = await window.obtenerProductos());
    const search = (document.getElementById("filter-search").value || "").toLowerCase().trim();
    const checkedCats = Array.from(document.querySelectorAll(".filter-cat:checked")).map(i=>i.value);
    const mas = document.getElementById("filter-masvendidos").checked;
    const oferta = document.getElementById("filter-oferta").checked;
    const nuevo = document.getElementById("filter-nuevo").checked;
    const sort = document.getElementById("filter-sort").value;

    let out = products.slice();

    if (search) {
      out = out.filter(p => (p.nombre || "").toLowerCase().includes(search) || (p.descripcion||"").toLowerCase().includes(search));
    }
    if (checkedCats.length) {
      out = out.filter(p => checkedCats.includes((p.categoria||"").trim() || "OTROS"));
    }
    if (mas) out = out.filter(p => (String(p.mas_vendido||"")+'').toLowerCase() === 'si' || p.mas_vendido === true);
    if (oferta) out = out.filter(p => (String(p.oferta||"")+'').toLowerCase() === 'si' || p.oferta === true);
    if (nuevo) out = out.filter(p => (String(p.nuevo||"")+'').toLowerCase() === 'si' || p.nuevo === true);

    // sort
    if (sort === "az") out.sort((a,b)=> (a.nombre||"").localeCompare(b.nombre||""));
    if (sort === "za") out.sort((a,b)=> (b.nombre||"").localeCompare(a.nombre||""));
    if (sort === "price_asc") out.sort((a,b)=> Number(a.precio||0) - Number(b.precio||0));
    if (sort === "price_desc") out.sort((a,b)=> Number(b.precio||0) - Number(a.precio||0));

    window.renderProductos(out, "productos");
  }

  let debounceTimer = null;
  function applyFiltersDebounced(){ clearTimeout(debounceTimer); debounceTimer = setTimeout(applyFilters, 220); }

  window.initFilters = buildFiltersUI;

  // auto attach if filters-panel exists in DOM content loaded
  document.addEventListener("DOMContentLoaded", ()=> {
    if (document.getElementById("filters-panel")) buildFiltersUI().catch(e=>console.error(e));
  });

})();
