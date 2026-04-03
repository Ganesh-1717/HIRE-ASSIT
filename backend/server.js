require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadResumeRoute = require("./routes/parseResume");
const getJobsRoute = require("./routes/getJobs");
const careerInsightsRoute = require("./routes/careerInsights");
const webhooksRoute = require("./routes/webhooks");
const careerChatRoute = require("./routes/careerChat");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/upload-resume", uploadResumeRoute);
app.use("/jobs", getJobsRoute);
app.use("/career-insights", careerInsightsRoute);
app.use("/webhooks", webhooksRoute);
app.use("/career-chat", careerChatRoute);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "AI Resume Analyzer API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
