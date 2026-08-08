/**
 * jobRecommender.js
 *
 * Ranks fetched jobs using a Weighted Multi-Factor Scoring (WMFS) algorithm:
 *   CombinedSim = 0.4 × Jaccard + 0.6 × SBERTCosine
 *   FinalScore  = 0.70 × CombinedSim
 *               + 0.25 × ExperienceScore
 *               + 0.05 × LocationScore
 *
 * Embeddings are computed once for the candidate profile and once per job
 * description in a single batched call to the SBERT microservice to minimise
 * HTTP overhead.
 */

const express = require("express");
const router = express.Router();

const SBERT_SERVICE_URL =
  process.env.SBERT_SERVICE_URL || "http://localhost:8001";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Jaccard similarity between two sets represented as arrays.
 * Intersection / Union on lowercased tokens.
 */
function jaccardSimilarity(setA, setB) {
  if (!setA.length || !setB.length) return 0;
  const a = new Set(setA.map((s) => s.toLowerCase().trim()));
  const b = new Set(setB.map((s) => s.toLowerCase().trim()));
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

/**
 * Extract simple keyword tokens from a job description for Jaccard matching.
 * Strips punctuation, splits on whitespace, returns unique words ≥ 3 chars.
 */
function tokenize(text) {
  if (!text) return [];
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 3)
    ),
  ];
}

/**
 * Dot product of two L2-normalised vectors == cosine similarity.
 * SBERT service returns normalised embeddings, so this is exact.
 */
function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Experience fit: Gaussian penalty centred at 0 delta, σ = 2 years.
 * exp(-(Δyears²) / (2 × σ²)) = exp(-(Δ²) / 8)
 */
function experienceScore(candidateYears, jobDescriptionText) {
  const candidate = parseFloat(candidateYears) || 0;

  // Try to parse required years from job description text
  const match = jobDescriptionText.match(
    /(\d+)\s*(?:\+\s*)?years?\s+(?:of\s+)?(?:experience|exp)/i
  );
  const required = match ? parseFloat(match[1]) : candidate; // assume perfect fit if unknown

  const delta = candidate - required;
  return Math.exp(-(delta * delta) / 8);
}

/**
 * Location score: 1.0 if job location contains user's location string, else 0.5.
 * Adzuna results are India-scoped, so we always default to 0.5 (soft preference).
 */
function locationScore(jobLocation) {
  // All Adzuna results are already filtered to India — treat as soft match
  return jobLocation && jobLocation.toLowerCase().includes("india") ? 0.8 : 0.5;
}

/**
 * Build the candidate profile text for SBERT from the analysis object.
 * Combines all structured fields into a single rich sentence for embedding.
 */
function buildCandidateText(analysis, resumeText) {
  const parts = [];

  if (analysis.recommended_roles?.length)
    parts.push("Roles: " + analysis.recommended_roles.join(", "));
  if (analysis.technical_skills?.length)
    parts.push("Skills: " + analysis.technical_skills.join(", "));
  if (analysis.frameworks?.length)
    parts.push("Frameworks: " + analysis.frameworks.join(", "));
  if (analysis.languages?.length)
    parts.push("Languages: " + analysis.languages.join(", "));
  if (analysis.experience_years)
    parts.push(`Experience: ${analysis.experience_years} years`);

  // Append a truncated excerpt of raw resume text for richer context
  if (resumeText) {
    const excerpt = resumeText.replace(/\s+/g, " ").trim().slice(0, 500);
    parts.push(excerpt);
  }

  return parts.join(". ");
}

/**
 * Fetch embeddings from the SBERT microservice.
 * Returns an array of float arrays (one per input text).
 * Throws if the service is unavailable or returns an error.
 */
async function fetchEmbeddings(texts) {
  const response = await fetch(`${SBERT_SERVICE_URL}/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `SBERT service error (${response.status}): ${err.detail || response.statusText}`
    );
  }

  const data = await response.json();
  return data.embeddings; // float[][]
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const { analysis, resumeText, jobs } = req.body;

    if (!analysis || !jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res
        .status(400)
        .json({ error: "analysis and non-empty jobs array are required" });
    }

    // 1. Build candidate skill set for Jaccard
    const candidateSkills = [
      ...(analysis.technical_skills || []),
      ...(analysis.frameworks || []),
      ...(analysis.languages || []),
    ];

    // 2. Build candidate profile text for SBERT
    const candidateText = buildCandidateText(analysis, resumeText || "");

    // 3. Build job description texts for SBERT
    const jobTexts = jobs.map(
      (job) =>
        `${job.title || ""}. ${job.searchRole || ""}. ${job.description || ""}`
    );

    // 4. Fetch all embeddings in a single batched call
    //    Index 0 = candidate, indices 1..N = jobs
    const allTexts = [candidateText, ...jobTexts];
    const allEmbeddings = await fetchEmbeddings(allTexts);

    const candidateEmbedding = allEmbeddings[0];
    const jobEmbeddings = allEmbeddings.slice(1);

    // 5. Score each job
    const scored = jobs.map((job, idx) => {
      const jobDesc = job.description || "";

      // ── Jaccard (exact skill match) ──────────────────────────────────────
      const jobTokens = tokenize(`${job.title} ${jobDesc}`);
      const jaccard = jaccardSimilarity(candidateSkills, jobTokens);

      // ── SBERT cosine similarity ──────────────────────────────────────────
      const sbertCosine = dotProduct(candidateEmbedding, jobEmbeddings[idx]);

      // ── Combined semantic score (per spec) ──────────────────────────────
      const combinedSim = 0.4 * jaccard + 0.6 * sbertCosine;

      // ── Experience fit ───────────────────────────────────────────────────
      const expScore = experienceScore(analysis.experience_years, jobDesc);

      // ── Location ─────────────────────────────────────────────────────────
      const locScore = locationScore(job.location);

      // ── Weighted total ───────────────────────────────────────────────────
      const totalScore =
        0.70 * combinedSim + 0.25 * expScore + 0.05 * locScore;

      return {
        ...job,
        matchScore: Math.round(totalScore * 100) / 100,
        scoreBreakdown: {
          jaccard: Math.round(jaccard * 100) / 100,
          sbert: Math.round(sbertCosine * 100) / 100,
          combined: Math.round(combinedSim * 100) / 100,
          experience: Math.round(expScore * 100) / 100,
          location: Math.round(locScore * 100) / 100,
        },
      };
    });

    // 6. Sort descending and return top 10
    const rankedJobs = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return res.json({ success: true, rankedJobs });
  } catch (error) {
    console.error("Error in job recommender:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to rank jobs",
    });
  }
});

module.exports = router;
