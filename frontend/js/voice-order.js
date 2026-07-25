/* ============================
   PharmaSync - Voice Ordering
   Uses the browser's Web Speech API (free, no key needed).
   ============================ */

function startVoiceOrder() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById("voice-status");
  const resultEl = document.getElementById("voice-result");

  if (!SpeechRecognition) {
    showToast("Voice recognition not supported in this browser", "error");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = document.getElementById("voice-lang")?.value || "en-IN";
  recognition.interimResults = false;

  statusEl.textContent = "Listening...";
  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    statusEl.textContent = "Heard: \"" + transcript + "\"";
    await window.productsReady;
    const matches = getProducts().filter(p =>
      p.name.toLowerCase().includes(transcript.toLowerCase())
    );
    renderProductGrid("voice-results-grid", matches.length ? matches : getProducts().slice(0, 3));
  };

  recognition.onerror = () => {
    statusEl.textContent = "Didn't catch that. Try again.";
  };

  recognition.onend = () => {
    if (statusEl.textContent === "Listening...") statusEl.textContent = "Tap the mic to speak";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const micBtn = document.getElementById("voice-mic-btn");
  if (micBtn) micBtn.addEventListener("click", startVoiceOrder);
});
