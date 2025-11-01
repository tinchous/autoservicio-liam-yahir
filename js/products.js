async function loadProducts() {
  const products = await getProducts();
  const list = document.getElementById("product-list");
  const search = document.getElementById("search");
  const filter = document.getElementById("filter-cat");

  // 🧩 Detectar categoría pasada por URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaInicial = urlParams.get("categoria");
  if (categoriaInicial && filter) filter.value = categoriaInicial;

  function render() {
    list.innerHTML = "";
    const q = (search?.value || "").toLowerCase();
    const cat = (filter?.value || "").toUpperCase();

    products
      .filter(p =>
        p.nombre.toLowerCase().includes(q) &&
        (!cat || (p.categoria || "").toUpperCase() === cat)
      )
      .forEach((p, index) => {
        const id = p.id && p.id.trim() ? p.id : String(index + 1);
        const precio = parseFloat(p.precio || 0);
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.imagen || 'images/products/default.jpg'}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>${p.categoria}</p>
          <p class="price">$${precio.toFixed(2).replace('.', ',')}</p>
          <div class="qty-controls">
            <button class="qty-btn" data-action="-">−</button>
            <input type="number" min="1" value="1" class="qty-input">
            <button class="qty-btn" data-action="+">+</button>
          </div>
          <button class="add-btn">🛒 Agregar al carrito</button>
        `;

        const qtyInput = card.querySelector(".qty-input");
        card.querySelectorAll(".qty-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            let val = parseInt(qtyInput.value);
            if (btn.dataset.action === "+") val++;
            if (btn.dataset.action === "-" && val > 1) val--;
            qtyInput.value = val;
          });
        });

        card.querySelector(".add-btn").addEventListener("click", () => {
          const cantidad = parseInt(qtyInput.value);
          addToCart({
            id,
            nombre: p.nombre,
            precio,
            qty: cantidad
          });
          alert(`🛒 ${cantidad} × ${p.nombre} agregado(s) al carrito`);
        });

        list.appendChild(card);
      });
  }

  search?.addEventListener("input", render);
  filter?.addEventListener("change", render);
  render();
}

document.addEventListener("DOMContentLoaded", loadProducts);
