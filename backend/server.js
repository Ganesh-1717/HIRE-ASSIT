require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadResumeRoute = require("./routes/parseResume");
const getJobsRoute = require("./routes/getJobs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/upload-resume", uploadResumeRoute);
app.use("/jobs", getJobsRoute);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "AI Resume Analyzer API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
