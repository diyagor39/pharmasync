/* ============================
   PharmaSync - Batch/QR Scanner
   Uses device camera. Verification result is simulated locally;
   connect to /api/prescription/verify-batch once backend is ready.
   ============================ */

let scannerStream = null;

async function startScanner() {
  const video = document.getElementById("scanner-video");
  const statusEl = document.getElementById("scanner-status");
  if (!video) return;

  try {
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = scannerStream;
    video.play();
    statusEl.textContent = "Scanning...";

    // Simulate a scan result after 3 seconds (replace with real QR decode library later)
    setTimeout(() => simulateScanResult(), 3000);
  } catch (err) {
    statusEl.textContent = "Camera access denied or unavailable.";
    showToast("Please allow camera access to scan", "error");
  }
}

function stopScanner() {
  if (scannerStream) {
    scannerStream.getTracks().forEach(track => track.stop());
  }
}

function simulateScanResult() {
  stopScanner();
  const resultEl = document.getElementById("scanner-result");
  const statusEl = document.getElementById("scanner-status");
  statusEl.textContent = "Scan complete";

  const isAuthentic = Math.random() > 0.2; // mock outcome

  resultEl.innerHTML = isAuthentic ? `
    <div class="card" style="border-color:var(--success-green);">
      <p class="badge badge-success mb-1">Verified Authentic</p>
      <p style="font-weight:600;">Batch #AZ-2205-118</p>
      <p class="text-muted" style="font-size:12px;">Manufactured: Feb 2026 · Expiry: Aug 2026</p>
    </div>
  ` : `
    <div class="card" style="border-color:var(--danger-red);">
      <p class="badge badge-danger mb-1">Could Not Verify</p>
      <p style="font-weight:600;">Batch code not found in registry</p>
      <p class="text-muted" style="font-size:12px;">Please contact the distributor before dispensing this stock.</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("scanner-start-btn");
  if (startBtn) startBtn.addEventListener("click", startScanner);
});
