/* ============================
   PharmaSync - AI Safety Checker
   Sends selected medicines to the backend, which calls Groq API
   to check for interactions/dosage warnings.
   Falls back to a local mock response if the backend isn't running yet.
   ============================ */

async function runAiSafetyCheck(event) {
  event.preventDefault();
  const input = document.getElementById("ai-medicines-input").value.trim();
  const resultEl = document.getElementById("ai-result");

  if (!input) {
    showToast("Enter at least one medicine name", "error");
    return;
  }

  resultEl.innerHTML = `<p class="text-muted">Checking with AI...</p>`;

  const medicines = input.split(",").map(m => m.trim()).filter(Boolean);

  try {
    const data = await api.post("/ai/check", { medicines });
    renderAiResult(data.result || data.message, data.risk || "info");
  } catch (err) {
    // Backend not reachable yet — show a clear local fallback instead of failing silently
    renderAiResult(
      "Backend not connected yet, so this is a placeholder. Once the AI route is live, this will show real interaction/dosage guidance from Groq for: " + medicines.join(", "),
      "info"
    );
  }
}

function renderAiResult(text, risk) {
  const resultEl = document.getElementById("ai-result");
  const riskClass = risk === "high" ? "badge-danger" : risk === "medium" ? "badge-warning" : "badge-info";
  resultEl.innerHTML = `
    <div class="ai-card" style="margin:16px 0;">
      <i class="ti ti-shield-check ai-icon"></i>
      <div>
        <p class="ai-title">AI Safety Check <span class="badge ${riskClass}" style="margin-left:6px;">${risk}</span></p>
        <p class="ai-sub">${text}</p>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ai-check-form");
  if (form) form.addEventListener("submit", runAiSafetyCheck);
});
