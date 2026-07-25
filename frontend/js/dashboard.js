/* ============================
   PharmaSync - Dashboards
   Waits for real product data from the backend before rendering.
   ============================ */

async function renderRetailerStats() {
  const orders = await getOrders();
  const products = getProducts();
  const expiringSoon = products.filter(p => p.expiryDays <= 90).length;

  setText("stat-total-orders", orders.length);
  setText("stat-total-spend", "₹" + orders.reduce((s, o) => s + o.total, 0));
  setText("stat-expiring", expiringSoon);
  setText("stat-products", products.length);
}

function renderExpiryAlerts() {
  const el = document.getElementById("expiry-list");
  if (!el) return;
  const products = getProducts().filter(p => p.expiryDays <= 120).sort((a, b) => a.expiryDays - b.expiryDays);

  if (!products.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-check"></i><p>No items nearing expiry</p></div>`;
    return;
  }

  el.innerHTML = products.map(p => `
    <div class="expiry-item">
      <div>
        <p style="font-weight:600;font-size:13px;">${p.name}</p>
        <p class="text-muted" style="font-size:12px;">${p.stock} units in stock</p>
      </div>
      <div class="text-center">
        <span class="badge ${p.expiryDays <= 45 ? "badge-danger" : "badge-warning"}">${p.expiryDays} days left</span>
        <div class="mt-1">
          <button class="btn btn-outline btn-sm" onclick="listForRedistribution(${p.id})">List for redistribution</button>
        </div>
      </div>
    </div>
  `).join("");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", async () => {
  const needsProducts = document.getElementById("stat-total-orders") || document.getElementById("expiry-list");
  if (needsProducts) await window.productsReady;

  if (document.getElementById("stat-total-orders")) renderRetailerStats();
  if (document.getElementById("expiry-list")) renderExpiryAlerts();
});
