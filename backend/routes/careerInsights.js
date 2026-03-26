const express = require("express");
const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

router.post("/", async (req, res) => {
  try {
    const { role, experience_years, skills } = req.body;

    if (!role) {
      return res.status(400).json({ error: "No role provided" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not set" });
    }

    const skillsList = skills && skills.length > 0 ? skills.join(", ") : "general";
    const exp = experience_years || "0-2";

    const prompt = `You are a career advisor AI. For the job role "${role}" with approximately ${exp} years of experience and skills in ${skillsList}, provide:

1. Salary estimates for the Indian job market in INR (Indian Rupees) per annum:
   - Specific estimate for THIS candidate based on their ${exp} years of experience and specific skills (${skillsList}). Provide a min, max, and a 1-sentence rationale.
   - Entry level (0-2 years)
   - Mid level (3-5 years)  
   - Senior level (6+ years)

2. 10 interview questions that are commonly asked for this role:
   - 6 technical questions specific to the role
   - 4 behavioral/situational questions

3. A brief description of what this role involves (2-3 sentences).

4. Top 5 companies in India hiring for this role.

Return result ONLY as valid JSON with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "role_description": "",
  "salary": {
    "candidate_estimate": { "min": 0, "max": 0, "rationale": "" },
    "entry": { "min": 0, "max": 0, "label": "0-2 years" },
    "mid": { "min": 0, "max": 0, "label": "3-5 years" },
    "senior": { "min": 0, "max": 0, "label": "6+ years" }
  },
  "interview_questions": {
    "technical": [
      { "question": "", "hint": "" }
    ],
    "behavioral": [
      { "question": "", "hint": "" }
    ]
  },
  "top_companies": []
}

For salary, provide realistic numbers in INR (e.g., 400000 for 4 LPA). For hints, provide a brief 1-sentence guidance on how to approach the answer.`;

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
              "You are a career advisor expert specializing in jobs in India. Always respond with valid JSON only, no markdown or extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 3000,
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
      const insights = JSON.parse(text);
      return res.json({ success: true, insights });
    } catch (e) {
      console.error("Failed to parse Groq career insights response:", text);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    console.error("Error generating career insights:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate career insights",
    });
  }
});

module.exports = router;
