/* ============================
   PharmaSync - Common Utilities
   Used on every page. Injects navbar + bottom nav,
   provides toast notifications and localStorage helpers.
   ============================ */

// ---------- Toast ----------
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---------- LocalStorage helpers (temporary mock DB until backend is connected) ----------
const DB = {
  get(key, fallback = []) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

function getCurrentUser() {
  return DB.get("pharmasync_currentUser", null);
}

function setCurrentUser(user) {
  DB.set("pharmasync_currentUser", user);
}

function logout() {
  localStorage.removeItem("pharmasync_currentUser");
  window.location.href = "login.html";
}

// Redirect to login if not authenticated (call on protected pages)
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// ---------- Cart count badge ----------
function getCartCount() {
  const cart = DB.get("pharmasync_cart", []);
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = getCartCount();
}

// ---------- Navbar injection ----------
function renderNavbar({ showGreeting = false, showSearch = true } = {}) {
  const el = document.getElementById("navbar-placeholder");
  if (!el) return;
  const user = getCurrentUser();
  const name = user ? user.name : "Guest";

  el.innerHTML = `
    <div class="navbar">
      <div class="navbar-top">
        ${showGreeting ? `
          <div class="navbar-greeting">
            <p class="greeting-small">Good day</p>
            <p class="greeting-name">${name}</p>
          </div>
        ` : `
          <div class="navbar-brand"><i class="ti ti-vaccine"></i> <span class="full-name">PharmaSync</span></div>
        `}
        <div class="navbar-icons">
          <a href="cart.html"><i class="ti ti-shopping-cart"></i><span class="cart-count" id="cart-count">0</span></a>
          <a href="orders.html"><i class="ti ti-bell"></i></a>
          <a href="retailer-dashboard.html"><i class="ti ti-user-circle"></i></a>
        </div>
      </div>
      ${showSearch ? `
        <div class="navbar-search">
          <i class="ti ti-search"></i>
          <input type="text" id="global-search" placeholder="Search medicine, batch, distributor">
        </div>
      ` : ""}
    </div>
  `;
  updateCartBadge();
}

// ---------- Bottom nav injection ----------
function renderBottomNav(active = "home") {
  const el = document.getElementById("bottomnav-placeholder");
  if (!el) return;
  const items = [
    { key: "home", href: "index.html", icon: "ti-home", label: "Home" },
    { key: "orders", href: "orders.html", icon: "ti-truck-delivery", label: "Orders" },
    { key: "redistribute", href: "redistribution.html", icon: "ti-recycle", label: "Redistribute" },
    { key: "ai", href: "ai-safety-check.html", icon: "ti-shield-check", label: "AI Check" },
    { key: "profile", href: "retailer-dashboard.html", icon: "ti-user", label: "Profile" }
  ];
  el.innerHTML = `
    <div class="bottom-nav">
      ${items.map(item => `
        <a href="${item.href}" class="${item.key === active ? "active" : ""}">
          <i class="ti ${item.icon}"></i>${item.label}
        </a>
      `).join("")}
    </div>
  `;
}

// ---------- Footer / include on load ----------
document.addEventListener("DOMContentLoaded", () => {
  // Pages set window.PAGE_CONFIG = {greeting: true/false, search: true/false, activeNav: "home"} before this script runs, or we use defaults.
  const config = window.PAGE_CONFIG || {};
  renderNavbar({ showGreeting: config.greeting || false, showSearch: config.search !== false });
  renderBottomNav(config.activeNav || "home");
});
