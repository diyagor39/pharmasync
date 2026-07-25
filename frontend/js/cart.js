/* ============================
   PharmaSync - Cart
   Cart itself still stays in localStorage (fine for a shopping cart),
   but product lookups now wait for real backend data.
   ============================ */

function getCart() {
  return DB.get("pharmasync_cart", []);
}

function saveCart(cart) {
  DB.set("pharmasync_cart", cart);
  updateCartBadge();
}

async function addToCart(productId) {
  await window.productsReady;
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCartPage();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    return removeFromCart(productId);
  }
  saveCart(cart);
  renderCartPage();
}

function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCartPage() {
  const el = document.getElementById("cart-items");
  if (!el) return;
  const cart = getCart();

  if (!cart.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-shopping-cart-off"></i><p>Your cart is empty</p></div>`;
    document.getElementById("cart-total").textContent = "₹0";
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="card flex-between mb-1">
      <div>
        <p style="font-weight:600;font-size:13px;">${item.name}</p>
        <p class="text-muted" style="font-size:12px;">₹${item.price} each</p>
      </div>
      <div class="flex-gap" style="align-items:center;">
        <button class="btn btn-outline btn-sm" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="btn btn-outline btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})"><i class="ti ti-trash"></i></button>
      </div>
    </div>
  `).join("");

  document.getElementById("cart-total").textContent = "₹" + cartTotal();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-items")) renderCartPage();
});
