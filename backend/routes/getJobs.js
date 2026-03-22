const express = require("express");
const router = express.Router();

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1";

router.post("/", async (req, res) => {
  try {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ error: "No roles provided" });
    }

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      return res.status(500).json({ error: "Adzuna API keys not configured" });
    }

    const allJobs = [];

    for (const role of roles.slice(0, 5)) {
      try {
        const url = `${ADZUNA_BASE_URL}?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(role)}&where=india&results_per_page=5&content-type=application/json`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          const jobs = data.results.map((job) => ({
            title: job.title || "N/A",
            company: job.company?.display_name || "N/A",
            location: job.location?.display_name || "India",
            salary:
              job.salary_min && job.salary_max
                ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}`
                : job.salary_min
                  ? `₹${Math.round(job.salary_min).toLocaleString()}+`
                  : "Not disclosed",
            description: job.description || "No description available",
            url: job.redirect_url || "#",
            searchRole: role,
          }));
          allJobs.push(...jobs);
        }
      } catch (err) {
        console.error(`Error fetching jobs for role "${role}":`, err.message);
      }
    }

    return res.json({ success: true, jobs: allJobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch job recommendations",
    });
  }
});

module.exports = router;
