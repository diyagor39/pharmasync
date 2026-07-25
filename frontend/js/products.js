/* ============================
   PharmaSync - Products
   Now fetches real products from the backend (TiDB) instead of localStorage.
   window.productsReady is a promise other files can await before using getProducts().
   ============================ */

let cachedProducts = [];

window.productsReady = (async () => {
  try {
    const raw = await api.get("/products");
    cachedProducts = raw.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      mrp: Number(p.mrp),
      stock: p.stock,
      expiryDays: p.expiry_date
        ? Math.max(0, Math.ceil((new Date(p.expiry_date) - new Date()) / 86400000))
        : 9999,
      rxRequired: !!p.rx_required
    }));
  } catch (err) {
    console.error("Could not load products from backend:", err.message);
    cachedProducts = [];
  }
  return cachedProducts;
})();

function getProducts() {
  return cachedProducts;
}

function renderProductCard(p) {
  const discount = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return `
    <div class="product-card">
      <div style="height:110px;background:var(--bg-light-gray);display:flex;align-items:center;justify-content:center;">
        <i class="ti ti-pill" style="font-size:32px;color:var(--text-light);"></i>
      </div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <p class="product-meta">${p.category || ""}${p.rxRequired ? ' · <span class="badge badge-info">Rx</span>' : ""}</p>
        <p class="product-price">₹${p.price}<span class="mrp">₹${p.mrp}</span></p>
        <button class="btn btn-primary btn-sm btn-block mt-1" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `;
}

function renderProductGrid(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-search-off"></i><p>No products found</p></div>`;
    return;
  }
  el.innerHTML = products.map(renderProductCard).join("");
}

function initProductSearch() {
  const input = document.getElementById("global-search") || document.getElementById("product-search");
  if (!input) return;
  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = getProducts().filter(p =>
      p.name.toLowerCase().includes(term) || (p.category || "").toLowerCase().includes(term)
    );
    renderProductGrid("product-grid", filtered);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("product-grid")) {
    await window.productsReady;
    renderProductGrid("product-grid", getProducts());
    initProductSearch();
  }
});
