const express = require("express");
const router = express.Router();
const { calculateSalaryEstimates } = require("../services/salaryEstimator");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1";

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

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    const skillsList = skills && skills.length > 0 ? skills : [];
    const exp = experience_years || "0-2 years";

    // 1. Fetch live job salaries from Adzuna if available
    let liveSalaries = [];
    if (appId && appKey) {
      try {
        const url = `${ADZUNA_BASE_URL}?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(role)}&where=india&results_per_page=10&content-type=application/json`;
        const adzRes = await fetch(url);
        const adzData = await adzRes.json();
        if (adzData.results && Array.isArray(adzData.results)) {
          liveSalaries = adzData.results
            .filter((j) => j.salary_min || j.salary_max)
            .map((j) => ({ min: j.salary_min || j.salary_max * 0.7, max: j.salary_max || j.salary_min * 1.3 }));
        }
      } catch (adzErr) {
        console.warn("Could not fetch Adzuna live salary data, using internal benchmarks:", adzErr.message);
      }
    }

    // 2. Calculate calibrated salary estimates for Indian job market
    const calculatedSalary = calculateSalaryEstimates(role, exp, skillsList, liveSalaries);

    // 3. Build prompt with pre-calibrated market benchmarks
    const prompt = `You are an expert career advisor specializing in the Indian tech job market. For the job role "${role}" with approximately ${exp} experience and skills in ${skillsList.join(", ") || "general tech"}, provide career insights.

CALIBRATED SALARY BENCHMARKS FOR INDIA (INR / per annum):
- Candidate Estimate: Min ₹${calculatedSalary.candidate_estimate.min} to Max ₹${calculatedSalary.candidate_estimate.max} (${calculatedSalary.candidate_estimate.formatted_min} - ${calculatedSalary.candidate_estimate.formatted_max})
- Entry Level (0-2 years): Min ₹${calculatedSalary.entry.min} to Max ₹${calculatedSalary.entry.max}
- Mid Level (3-5 years): Min ₹${calculatedSalary.mid.min} to Max ₹${calculatedSalary.mid.max}
- Senior Level (6+ years): Min ₹${calculatedSalary.senior.min} to Max ₹${calculatedSalary.senior.max}

Tasks:
1. Use the provided calibrated salary numbers for candidate, entry, mid, and senior levels. Provide a clear 1-sentence rationale for the candidate estimate explaining why this range fits their skills (${skillsList.join(", ")}) and experience (${exp}).
2. Provide 10 interview questions for "${role}":
   - 6 technical questions specific to the role
   - 4 behavioral/situational questions
3. Provide a brief description of what this role involves (2-3 sentences).
4. List top 5 companies in India hiring for this role.

Return result ONLY as valid JSON with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "role_description": "",
  "salary": {
    "candidate_estimate": { "min": ${calculatedSalary.candidate_estimate.min}, "max": ${calculatedSalary.candidate_estimate.max}, "rationale": "" },
    "entry": { "min": ${calculatedSalary.entry.min}, "max": ${calculatedSalary.entry.max}, "label": "0-2 years" },
    "mid": { "min": ${calculatedSalary.mid.min}, "max": ${calculatedSalary.mid.max}, "label": "3-5 years" },
    "senior": { "min": ${calculatedSalary.senior.min}, "max": ${calculatedSalary.senior.max}, "label": "6+ years" }
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
              "You are a career advisor expert specializing in jobs in India. Always respond with valid JSON only, no markdown or extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
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

      // Ensure salary fields use calibrated non-zero numbers if AI omitted them
      if (!insights.salary || !insights.salary.candidate_estimate?.min) {
        insights.salary = {
          candidate_estimate: {
            min: calculatedSalary.candidate_estimate.min,
            max: calculatedSalary.candidate_estimate.max,
            rationale: calculatedSalary.candidate_estimate.rationale,
          },
          entry: calculatedSalary.entry,
          mid: calculatedSalary.mid,
          senior: calculatedSalary.senior,
        };
      }

      return res.json({ success: true, insights });
    } catch (e) {
      console.error("Failed to parse Groq career insights response:", text);
      // Fallback with calculated insights
      return res.json({
        success: true,
        insights: {
          role_description: `${role} plays a crucial role in modern software development and engineering teams in India.`,
          salary: {
            candidate_estimate: calculatedSalary.candidate_estimate,
            entry: calculatedSalary.entry,
            mid: calculatedSalary.mid,
            senior: calculatedSalary.senior,
          },
          interview_questions: {
            technical: [
              { question: `Explain core concepts and architectural patterns used in ${role}.`, hint: "Focus on fundamentals and real-world project application." }
            ],
            behavioral: [
              { question: "Describe a challenging situation in a past project and how you resolved it.", hint: "Use the STAR method (Situation, Task, Action, Result)." }
            ]
          },
          top_companies: ["TCS", "Infosys", "Wipro", "Amazon India", "Flipkart"]
        }
      });
    }
  } catch (error) {
    console.error("Error generating career insights:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate career insights",
    });
  }
});

module.exports = router;

