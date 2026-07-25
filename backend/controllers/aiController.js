/* ============================
   PharmaSync Backend - AI Safety Controller
   Calls Groq API (same pattern used in MenuVision) to check
   drug interactions / dosage warnings for a list of medicines.
   ============================ */

async function checkSafety(req, res) {
  try {
    const { medicines } = req.body;
    if (!medicines || !medicines.length) {
      return res.status(400).json({ message: "Please provide at least one medicine." });
    }

    const prompt = `You are a pharmacology safety assistant for a B2B pharmacy platform in India.
A pharmacist is checking the following medicines together: ${medicines.join(", ")}.
In 3-4 short sentences, explain:
1) Any known interactions or risks of taking these together.
2) Any general dosage/timing caution.
Keep it concise and practical for a pharmacist, not a patient. If you are not fully certain, say so and recommend consulting a doctor.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error("Groq error:", data);
      return res.status(500).json({ message: "AI service error.", detail: data.error?.message });
    }

    const resultText = data.choices?.[0]?.message?.content || "No response from AI.";

    // crude risk detection for the badge color on the frontend
    const lower = resultText.toLowerCase();
    let risk = "info";
    if (lower.includes("avoid") || lower.includes("dangerous") || lower.includes("severe")) risk = "high";
    else if (lower.includes("caution") || lower.includes("monitor")) risk = "medium";

    res.json({ result: resultText, risk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not run AI safety check." });
  }
}

module.exports = { checkSafety };
