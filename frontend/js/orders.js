/* ============================
   PharmaSync - Orders
   Now saves/fetches orders from the real backend (TiDB) instead of localStorage.
   ============================ */

async function placeOrder(details = {}) {
  const cart = getCart();
  if (!cart.length) {
    showToast("Cart is empty", "error");
    return null;
  }

  try {
    const data = await api.post("/orders", {
      items: cart,
      total: cartTotal(),
      address: details.address,
      paymentMethod: details.paymentMethod
    });

    saveCart([]);
    return { id: data.orderCode, total: cartTotal() };
  } catch (err) {
    showToast(err.message || "Could not place order", "error");
    return null;
  }
}

async function getOrders() {
  try {
    const orders = await api.get("/orders/my");
    return orders.map(o => ({
      id: o.order_code,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
      total: Number(o.total),
      status: o.status,
      date: o.created_at
    }));
  } catch (err) {
    console.error("Could not load orders:", err.message);
    return [];
  }
}

async function renderOrdersPage() {
  const el = document.getElementById("orders-list");
  if (!el) return;
  const orders = await getOrders();

  if (!orders.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-package-off"></i><p>No orders yet</p></div>`;
    return;
  }

  el.innerHTML = orders.map(order => `
    <div class="card mb-1">
      <div class="flex-between">
        <div>
          <p style="font-weight:600;font-size:13px;">${order.id}</p>
          <p class="text-muted" style="font-size:12px;">${new Date(order.date).toLocaleDateString()} · ${order.items.length} item(s)</p>
        </div>
        <div class="text-center">
          <span class="badge badge-info">${order.status}</span>
          <p style="font-weight:700;margin-top:4px;">₹${order.total}</p>
        </div>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("orders-list")) renderOrdersPage();
});
