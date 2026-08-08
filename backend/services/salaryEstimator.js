/**
 * Salary Estimation Engine for HireAssist
 * Provides accurate, calibrated compensation estimates for Indian tech job markets
 * based on role benchmarks, experience levels, skill premiums, and live job market data.
 */

const ROLE_BENCHMARKS = [
  {
    keywords: ["data scientist", "machine learning", "ml engineer", "ai engineer", "deep learning"],
    entry: { min: 600000, max: 1200000, label: "0-2 years" },
    mid: { min: 1300000, max: 2500000, label: "3-5 years" },
    senior: { min: 2600000, max: 5000000, label: "6+ years" },
  },
  {
    keywords: ["devops", "cloud engineer", "site reliability", "sre", "infrastructure"],
    entry: { min: 500000, max: 1000000, label: "0-2 years" },
    mid: { min: 1100000, max: 2200000, label: "3-5 years" },
    senior: { min: 2400000, max: 4500000, label: "6+ years" },
  },
  {
    keywords: ["backend", "java developer", "python developer", "golang", "node.js developer"],
    entry: { min: 500000, max: 1050000, label: "0-2 years" },
    mid: { min: 1100000, max: 2250000, label: "3-5 years" },
    senior: { min: 2300000, max: 4400000, label: "6+ years" },
  },
  {
    keywords: ["frontend", "react developer", "vue", "angular", "ui engineer", "web developer"],
    entry: { min: 400000, max: 850000, label: "0-2 years" },
    mid: { min: 900000, max: 1800000, label: "3-5 years" },
    senior: { min: 1900000, max: 3600000, label: "6+ years" },
  },
  {
    keywords: ["product manager", "product owner", "technical product manager"],
    entry: { min: 700000, max: 1400000, label: "0-2 years" },
    mid: { min: 1500000, max: 2800000, label: "3-5 years" },
    senior: { min: 3000000, max: 5500000, label: "6+ years" },
  },
  {
    keywords: ["data engineer", "big data", "etl", "data architect"],
    entry: { min: 500000, max: 1100000, label: "0-2 years" },
    mid: { min: 1200000, max: 2300000, label: "3-5 years" },
    senior: { min: 2400000, max: 4500000, label: "6+ years" },
  },
  {
    keywords: ["qa", "test automation", "sdett", "quality assurance"],
    entry: { min: 350000, max: 700000, label: "0-2 years" },
    mid: { min: 800000, max: 1500000, label: "3-5 years" },
    senior: { min: 1600000, max: 3000000, label: "6+ years" },
  },
  {
    // Default / Full Stack / General Software Engineer
    keywords: ["software engineer", "full stack", "developer", "engineer"],
    entry: { min: 450000, max: 900000, label: "0-2 years" },
    mid: { min: 1000000, max: 2000000, label: "3-5 years" },
    senior: { min: 2200000, max: 4200000, label: "6+ years" },
  },
];

const HIGH_DEMAND_SKILLS = [
  "aws", "azure", "gcp", "kubernetes", "docker", "system design", "microservices",
  "pytorch", "tensorflow", "react", "next.js", "node.js", "golang", "kafka",
  "graphql", "rust", "spark", "hadoop", "langchain", "llm", "ci/cd"
];

function findMatchingBenchmark(roleName) {
  const normalized = (roleName || "").toLowerCase();
  for (const b of ROLE_BENCHMARKS) {
    if (b.keywords.some((kw) => normalized.includes(kw))) {
      return b;
    }
  }
  // Fallback to software engineer benchmark
  return ROLE_BENCHMARKS[ROLE_BENCHMARKS.length - 1];
}

function calculateSkillBoost(skillsList) {
  if (!skillsList || !Array.isArray(skillsList)) return 1.0;

  const normalizedSkills = skillsList.map((s) => String(s).toLowerCase());
  let boostCount = 0;

  for (const skill of HIGH_DEMAND_SKILLS) {
    if (normalizedSkills.some((s) => s.includes(skill))) {
      boostCount++;
    }
  }

  // Each high demand skill adds +4%, capped at +24% (1.24x)
  const boost = 1.0 + Math.min(boostCount * 0.04, 0.24);
  return { multiplier: boost, matchedCount: boostCount };
}

function parseExperienceBracket(expStr) {
  const str = String(expStr || "").toLowerCase();
  if (str.includes("0-2") || str.includes("entry") || str.includes("fresher") || str.includes("1 year") || str.includes("2 years") || str.includes("0 years")) {
    return "entry";
  }
  if (str.includes("6+") || str.includes("senior") || str.includes("lead") || str.includes("7") || str.includes("8") || str.includes("9") || str.includes("10")) {
    return "senior";
  }
  // Default to mid-level for 3-5 years or unparsed
  return "mid";
}

function calculateSalaryEstimates(role, experienceYears, skills = [], liveSalaries = []) {
  const benchmark = findMatchingBenchmark(role);
  const { multiplier: skillMultiplier, matchedCount } = calculateSkillBoost(skills);
  const candidateBracket = parseExperienceBracket(experienceYears);

  let entry = { ...benchmark.entry };
  let mid = { ...benchmark.mid };
  let senior = { ...benchmark.senior };

  // If live job market salary data is available, blend it (40% weight live, 60% benchmark)
  if (liveSalaries && liveSalaries.length > 0) {
    const validSalaries = liveSalaries.filter((s) => s.min && s.max && s.min > 100000);
    if (validSalaries.length > 0) {
      const avgLiveMin = Math.round(validSalaries.reduce((acc, s) => acc + s.min, 0) / validSalaries.length);
      const avgLiveMax = Math.round(validSalaries.reduce((acc, s) => acc + s.max, 0) / validSalaries.length);

      // Blend mid-level benchmark with live market average
      mid.min = Math.round(mid.min * 0.6 + avgLiveMin * 0.4);
      mid.max = Math.round(mid.max * 0.6 + avgLiveMax * 0.4);
      entry.min = Math.round(mid.min * 0.45);
      entry.max = Math.round(mid.max * 0.45);
      senior.min = Math.round(mid.min * 2.1);
      senior.max = Math.round(mid.max * 2.1);
    }
  }

  // Determine candidate specific baseline
  const baseRange = candidateBracket === "entry" ? entry : candidateBracket === "senior" ? senior : mid;
  const candidateMin = Math.round(baseRange.min * skillMultiplier);
  const candidateMax = Math.round(baseRange.max * skillMultiplier);

  const formatLPA = (num) => `₹${(num / 100000).toFixed(1)} LPA`;
  const rationale = matchedCount > 0
    ? `Based on ${experienceYears || "current"} experience and a ${(skillMultiplier * 100 - 100).toFixed(0)}% skill premium boost for high-demand tech skills in the Indian job market.`
    : `Based on standard Indian tech industry market benchmarks for ${experienceYears || "your"} experience bracket.`;

  return {
    role,
    candidate_estimate: {
      min: candidateMin,
      max: candidateMax,
      formatted_min: formatLPA(candidateMin),
      formatted_max: formatLPA(candidateMax),
      rationale,
    },
    entry,
    mid,
    senior,
  };
}

module.exports = { calculateSalaryEstimates };
