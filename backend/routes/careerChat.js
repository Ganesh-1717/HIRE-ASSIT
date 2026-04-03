const express = require("express");
const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

router.post("/", async (req, res) => {
  try {
    const { message, role, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not set" });
    }

    // Build context from the career insights page data
    let systemPrompt = `You are an expert career advisor AI assistant for the HireAssist platform. You help candidates prepare for interviews and understand career paths.`;

    if (role) {
      systemPrompt += ` The user is currently exploring the "${role}" career path.`;
    }

    if (context) {
      systemPrompt += `\n\nHere is the career insights data currently displayed to the user:\n${JSON.stringify(context, null, 2)}`;
    }

    systemPrompt += `\n\nGuidelines:
- Give clear, actionable answers
- When answering interview questions, provide structured answers with key points
- If asked for more questions, generate relevant ones for the "${role || 'given'}" role
- Keep responses concise but thorough (2-4 paragraphs max)
- Use bullet points for lists
- Be encouraging and supportive`;

    // Build conversation messages
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Support conversation history
    if (req.body.history && Array.isArray(req.body.history)) {
      for (const msg of req.body.history) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    messages.push({ role: "user", content: message });

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.6,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error (${response.status}): ${errData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Error in career chat:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate response",
    });
  }
});

module.exports = router;
