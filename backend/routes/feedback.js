const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /feedback — submit full feedback
router.post("/", async (req, res) => {
  const {
    user_id,
    resume_accuracy,
    job_recommendation,
    skill_gap_analysis,
    learning_roadmap,
    interview_questions,
    career_chatbot,
    overall_satisfaction,
    recommendation,
    future_usage,
    suggestions,
  } = req.body;

  // Validate required fields
  const requiredRatings = [
    resume_accuracy, job_recommendation, skill_gap_analysis,
    learning_roadmap, interview_questions, career_chatbot, overall_satisfaction,
  ];
  for (const r of requiredRatings) {
    if (!r || r < 1 || r > 5) {
      return res.status(400).json({ error: "All rating questions (1–7) are required and must be 1–5." });
    }
  }
  if (!recommendation) return res.status(400).json({ error: "Recommendation field is required." });
  if (!future_usage) return res.status(400).json({ error: "Future usage field is required." });

  try {
    const { data, error } = await supabase.from("feedback").insert({
      user_id: user_id || null,
      resume_accuracy: Number(resume_accuracy),
      job_recommendation: Number(job_recommendation),
      skill_gap_analysis: Number(skill_gap_analysis),
      learning_roadmap: Number(learning_roadmap),
      interview_questions: Number(interview_questions),
      career_chatbot: Number(career_chatbot),
      overall_satisfaction: Number(overall_satisfaction),
      recommendation,
      future_usage,
      suggestions: suggestions || "",
    });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Feedback submission error:", err);
    res.status(500).json({ error: "Failed to save feedback", detail: err.message });
  }
});

// GET /feedback/stats — aggregate data for admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("resume_accuracy, job_recommendation, skill_gap_analysis, learning_roadmap, interview_questions, career_chatbot, overall_satisfaction, recommendation, future_usage");

    if (error) throw error;

    const total = (data || []).length;

    if (total === 0) {
      return res.json({
        success: true,
        total: 0,
        averageOverall: 0,
        recommendation: { Yes: 0, No: 0, Maybe: 0 },
        futureUsage: { "Very Likely": 0, Likely: 0, Neutral: 0, Unlikely: 0, "Very Unlikely": 0 },
        pieChart: { Excellent: 0, Good: 0, Average: 0, "Needs Improvement": 0, Poor: 0 },
      });
    }

    // Compute per-user averages of Q1–7, then overall mean
    let totalOverall = 0;
    const pieCategories = { Excellent: 0, Good: 0, Average: 0, "Needs Improvement": 0, Poor: 0 };
    const recommendation = { Yes: 0, No: 0, Maybe: 0 };
    const futureUsage = { "Very Likely": 0, Likely: 0, Neutral: 0, Unlikely: 0, "Very Unlikely": 0 };

    (data || []).forEach((row) => {
      const avg = (
        row.resume_accuracy + row.job_recommendation + row.skill_gap_analysis +
        row.learning_roadmap + row.interview_questions + row.career_chatbot +
        row.overall_satisfaction
      ) / 7;

      totalOverall += avg;

      // Categorize
      if (avg >= 4.5) pieCategories["Excellent"]++;
      else if (avg >= 3.5) pieCategories["Good"]++;
      else if (avg >= 2.5) pieCategories["Average"]++;
      else if (avg >= 1.5) pieCategories["Needs Improvement"]++;
      else pieCategories["Poor"]++;

      // Recommendation tallies
      if (recommendation[row.recommendation] !== undefined) recommendation[row.recommendation]++;
      if (futureUsage[row.future_usage] !== undefined) futureUsage[row.future_usage]++;
    });

    const averageOverall = totalOverall / total;

    res.json({
      success: true,
      total,
      averageOverall: Math.round(averageOverall * 10) / 10,
      recommendation,
      futureUsage,
      pieChart: pieCategories,
    });
  } catch (err) {
    console.error("Feedback stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats", detail: err.message });
  }
});

module.exports = router;
