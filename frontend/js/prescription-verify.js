/* ============================
   PharmaSync - Prescription Verification
   Now saves upload records to the real backend (TiDB) instead of localStorage.
   Note: actual file storage (the image/PDF itself) isn't wired up yet —
   only the file name + a pending record is saved. A pharmacist/admin
   would need a review screen to mark it Verified (future addition).
   ============================ */

async function handlePrescriptionUpload(event) {
  event.preventDefault();
  const fileInput = document.getElementById("rx-file");
  const statusEl = document.getElementById("rx-status");

  if (!fileInput.files.length) {
    showToast("Please choose a prescription file", "error");
    return;
  }

  const file = fileInput.files[0];

  try {
    const data = await api.post("/prescriptions/upload", { fileName: file.name });

    statusEl.innerHTML = `
      <div class="card mt-2" style="border-color:var(--warning-amber);">
        <p class="badge badge-warning mb-1">Pending Review</p>
        <p style="font-weight:600;">${file.name}</p>
        <p class="text-muted" style="font-size:12px;">Reference: ${data.rxCode} — a licensed pharmacist will verify this before Rx items are dispatched.</p>
      </div>
    `;
    showToast("Prescription uploaded for verification");
    renderPrescriptionHistory();
  } catch (err) {
    showToast(err.message || "Could not upload prescription", "error");
  }
}

async function renderPrescriptionHistory() {
  const el = document.getElementById("rx-history");
  if (!el) return;

  try {
    const records = await api.get("/prescriptions/my");

    if (!records.length) {
      el.innerHTML = `<div class="empty-state"><i class="ti ti-file-off"></i><p>No prescriptions uploaded yet</p></div>`;
      return;
    }

    el.innerHTML = records.map(r => `
      <div class="card flex-between mb-1">
        <div>
          <p style="font-weight:600;font-size:13px;">${r.file_name}</p>
          <p class="text-muted" style="font-size:12px;">${new Date(r.created_at).toLocaleString()}</p>
        </div>
        <span class="badge ${r.status === "Verified" ? "badge-success" : r.status === "Rejected" ? "badge-danger" : "badge-warning"}">${r.status}</span>
      </div>
    `).join("");
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p class="text-muted">Could not load history</p></div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("rx-history")) renderPrescriptionHistory();
});
