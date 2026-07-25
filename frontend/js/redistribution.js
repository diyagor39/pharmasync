/* ============================
   PharmaSync - Redistribution Marketplace
   Now connected to the real backend (TiDB) instead of localStorage.
   ============================ */

async function getRedistributionListings() {
  try {
    const listings = await api.get("/redistribution");
    return listings.map(l => ({
      code: l.listing_code,
      productName: l.product_name,
      quantity: l.quantity,
      discountPct: l.discount_pct,
      listedBy: l.listed_by_name,
      status: l.status
    }));
  } catch (err) {
    console.error("Could not load redistribution listings:", err.message);
    return [];
  }
}

async function listForRedistribution(productId) {
  await window.productsReady;
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;

  const discountPct = product.expiryDays <= 45 ? 40 : 25;
  const quantity = Math.min(product.stock, 200);

  try {
    await api.post("/redistribution", { productId, quantity, discountPct });
    showToast(`${product.name} listed on redistribution marketplace`);
    renderRedistributionPage();
  } catch (err) {
    showToast(err.message || "Could not create listing", "error");
  }
}

async function claimListing(listingCode) {
  try {
    await api.post("/redistribution/claim", { listingCode });
    showToast("Listing claimed — contact the retailer to arrange pickup");
    renderRedistributionPage();
  } catch (err) {
    showToast(err.message || "Could not claim listing", "error");
  }
}

async function renderRedistributionPage() {
  const el = document.getElementById("redistribution-list");
  if (!el) return;
  const listings = await getRedistributionListings();

  if (!listings.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-recycle-off"></i><p>No near-expiry stock listed right now</p></div>`;
    return;
  }

  el.innerHTML = listings.map(l => `
    <div class="redis-item">
      <div>
        <p style="font-weight:600;font-size:13px;">${l.productName}</p>
        <p class="text-muted" style="font-size:12px;">${l.quantity} units · listed by ${l.listedBy}</p>
      </div>
      <div class="text-center">
        <span class="badge badge-warning">${l.discountPct}% off</span>
        <div class="mt-1">
          ${l.status === "Available"
            ? `<button class="btn btn-primary btn-sm" onclick="claimListing('${l.code}')">Claim</button>`
            : `<span class="badge badge-success">Claimed</span>`}
        </div>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("redistribution-list")) renderRedistributionPage();
});
