const express = require("express");
const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

router.post("/", async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ error: "No skill provided" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not set" });
    }

    const prompt = `You are a technical learning advisor. Create a detailed learning roadmap for the skill "${skill}". 

The roadmap should have 6-8 steps/milestones arranged in a logical learning order from beginner to advanced. Each step should have:
- A short title (2-4 words)
- A description (1-2 sentences explaining what to learn)
- A difficulty level: "beginner", "intermediate", or "advanced"
- A YouTube search query that would find the best tutorial video for that step
- Estimated time to complete (e.g. "1-2 weeks", "2-3 days")

Return result ONLY as valid JSON with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "skill": "${skill}",
  "description": "A brief 2-sentence overview of what this skill is and why it matters.",
  "total_time": "Estimated total learning time",
  "steps": [
    {
      "title": "",
      "description": "",
      "difficulty": "beginner",
      "youtube_query": "",
      "time_estimate": ""
    }
  ]
}`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a technical learning advisor. Always respond with valid JSON only, no markdown or extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error (${response.status}): ${errData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";

    // Clean up response
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const roadmap = JSON.parse(text);
      return res.json({ success: true, roadmap });
    } catch (e) {
      console.error("Failed to parse Groq skill roadmap response:", text);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    console.error("Error generating skill roadmap:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate skill roadmap",
    });
  }
});

module.exports = router;
