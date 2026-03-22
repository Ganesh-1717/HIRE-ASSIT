# AI Resume Analyzer & Job Recommender

A full-stack web application that analyzes resumes using AI and recommends matching jobs.

![Tech Stack](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js)
![Tech Stack](https://img.shields.io/badge/Express.js-grey?style=flat&logo=express)
![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-blue?style=flat&logo=tailwindcss)
![Tech Stack](https://img.shields.io/badge/Google_Gemini-blue?style=flat&logo=google)

## Features

- **Resume Upload** – Drag & drop or browse to upload PDF resumes
- **AI Analysis** – Powered by Google Gemini to extract skills, experience, and recommendations
- **Job Recommendations** – Fetches matching jobs from Adzuna API based on AI-recommended roles
- **ChatGPT-style UI** – Clean, minimal interface with sidebar navigation
- **History** – Track previously analyzed resumes in the session

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js 14, Tailwind CSS, TypeScript |
| Backend  | Node.js, Express.js                 |
| AI       | Google Gemini API                    |
| Jobs     | Adzuna Jobs API                      |
| PDF      | pdf-parse                            |

## Project Structure

```
resume-ai/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       └── components/
│           ├── upload/ResumeUpload.tsx
│           ├── results/Results.tsx
│           ├── job-card/JobListings.tsx
│           └── sidebar/Sidebar.tsx
├── backend/
│   ├── server.js
│   └── routes/
│       ├── parseResume.js
│       ├── analyzeResume.js
│       └── getJobs.js
└── README.md
```

## Prerequisites

- Node.js 18+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Adzuna API credentials ([Register here](https://developer.adzuna.com/))

## Setup & Run

### 1. Clone and navigate

```bash
cd resume-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The app will run on `http://localhost:3000`.

### 4. Open the app

Visit **http://localhost:3000** in your browser.

## Usage

1. Click "New Analysis" or drag and drop a PDF resume onto the upload area
2. Wait for the AI to analyze your resume (takes a few seconds)
3. View your extracted skills, experience, recommended roles, and skill gaps
4. Browse matching job listings and click "Apply" to visit job pages

## API Endpoints

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| POST   | `/upload-resume` | Upload PDF, extract text, analyze with AI |
| POST   | `/jobs`          | Get job listings for given roles         |
| GET    | `/`              | Health check                             |

## Environment Variables

### Backend (`backend/.env`)

| Variable         | Description              |
| ---------------- | ------------------------ |
| `GEMINI_API_KEY`  | Google Gemini API key    |
| `ADZUNA_APP_ID`   | Adzuna application ID   |
| `ADZUNA_APP_KEY`  | Adzuna application key  |
| `PORT`            | Server port (default 5000) |

## License

MIT
