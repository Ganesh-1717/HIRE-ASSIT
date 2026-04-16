# HireAssist – AI-Powered Career Platform

A full-stack web application that analyzes resumes using AI, recommends matching jobs, provides career insights, generates personalized skill roadmaps, and offers an interactive AI career chatbot.

![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-grey?style=flat&logo=express)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-blue?style=flat&logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-blue?style=flat&logo=google)
![Groq](https://img.shields.io/badge/Groq_LLaMA_3.3-orange?style=flat)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat)
![Supabase](https://img.shields.io/badge/Supabase-green?style=flat&logo=supabase)

---

## Features

- **Resume Upload** – Drag & drop or browse to upload PDF resumes
- **AI Resume Analysis** – Powered by Google Gemini to extract skills, experience, and recommendations
- **Job Recommendations** – Fetches matching jobs from Adzuna API based on AI-recommended roles
- **Career Insights** – Role-specific salary estimates (INR), interview questions, top companies, and role descriptions powered by Groq (LLaMA 3.3)
- **AI Career Chatbot** – Floating chat assistant on career pages that helps prep for interviews, answers questions, and generates more practice problems
- **Skill Roadmap** – Step-by-step learning roadmap for any skill, with YouTube video links and time estimates
- **User Authentication** – Secure sign-up/sign-in via Clerk with webhook-based user sync to Supabase
- **User Profile** – View resume history, skill statistics, account details, and manage saved data
- **Persistent Storage** – Resume analysis history and user data stored in Supabase
- **Session Continuity** – Analysis results preserved in session storage so navigating back never loses state
- **Responsive UI** – Mobile-friendly design with smooth animations, skeleton loaders, and toast notifications

---

## Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Frontend       | Next.js 14, Tailwind CSS, TypeScript               |
| Backend        | Node.js, Express.js                                |
| Authentication | Clerk (sign-in/sign-up, webhooks)                  |
| Database       | Supabase (PostgreSQL)                              |
| AI – Resume    | Google Gemini API                                  |
| AI – Career    | Groq API (LLaMA 3.3 70B Versatile)                 |
| Jobs           | Adzuna Jobs API                                    |
| PDF Parsing    | pdf-parse                                          |
| Webhooks       | Svix (Clerk webhook verification)                  |

---

## Project Structure

```
hireAssist/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx               # ClerkProvider wrapper
│       │   ├── page.tsx                 # Main resume upload & results page
│       │   ├── globals.css
│       │   ├── types.ts
│       │   ├── analyzer/                # Resume analysis page
│       │   ├── career/
│       │   │   └── [role]/              # Dynamic career insights page per role
│       │   ├── roadmap/
│       │   │   └── [skill]/             # Dynamic skill roadmap page per skill
│       │   ├── profile/                 # User profile page
│       │   ├── sign-in/                 # Clerk sign-in page
│       │   └── sign-up/                 # Clerk sign-up page
│       ├── components/
│       │   ├── career-chat/
│       │   │   └── CareerChatbot.tsx    # Floating AI chat assistant
│       │   ├── upload/ResumeUpload.tsx
│       │   ├── results/Results.tsx
│       │   ├── job-card/JobListings.tsx
│       │   └── sidebar/Sidebar.tsx
│       ├── lib/
│       │   └── supabaseClient.ts        # Lazy-init Supabase client
│       └── middleware.ts                # Clerk auth middleware (route protection)
├── backend/
│   ├── server.js
│   └── routes/
│       ├── parseResume.js              # PDF text extraction
│       ├── analyzeResume.js            # Gemini AI resume analysis
│       ├── getJobs.js                  # Adzuna job listings
│       ├── careerInsights.js           # Groq: salary, interview questions, companies
│       ├── skillRoadmap.js             # Groq: step-by-step skill learning roadmap
│       ├── careerChat.js               # Groq: AI chatbot for career pages
│       └── webhooks.js                 # Clerk webhook → Supabase user sync
├── supabase_migration.sql              # Database schema
└── README.md
```

---

## Prerequisites

- Node.js 18+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Adzuna API credentials ([Register here](https://developer.adzuna.com/))
- Groq API Key ([Get one here](https://console.groq.com/))
- Clerk account ([Sign up here](https://clerk.com/))
- Supabase project ([Create one here](https://supabase.com/))

---

## Setup & Run

### 1. Clone and navigate

```bash
git clone https://github.com/Ganesh-1717/HIRE-ASSIT.git
cd hireAssist
```

### 2. Supabase Database Setup

Run the migration file against your Supabase project:

```bash
# In the Supabase SQL editor, run the contents of:
supabase_migration.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret   # optional, for webhook verification
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will run on `http://localhost:3000`.

### 5. Open the app

Visit **http://localhost:3000** in your browser.

---

## Usage

1. **Sign up / Sign in** via Clerk authentication
2. **Upload a resume** – drag & drop or click to select a PDF
3. **View AI analysis** – see extracted skills, experience level, recommended roles, and skill gaps
4. **Browse job listings** matching your profile from Adzuna
5. **Explore Career Insights** – click a recommended role to see salary ranges, interview questions, and top hiring companies in India
6. **Chat with the AI assistant** – use the floating chatbot on career pages to practise interview questions and get career guidance
7. **Learn new skills** – click any skill gap to open a structured learning roadmap with YouTube resources
8. **View your profile** – track your resume history and skill statistics across sessions

---

## API Endpoints

| Method | Endpoint            | Description                                              |
| ------ | ------------------- | -------------------------------------------------------- |
| POST   | `/upload-resume`    | Upload PDF, extract text, and analyze with Gemini AI     |
| POST   | `/jobs`             | Get Adzuna job listings for given roles                  |
| POST   | `/career-insights`  | Generate salary estimates & interview questions (Groq)   |
| POST   | `/skill-roadmap`    | Generate a step-by-step skill learning roadmap (Groq)    |
| POST   | `/career-chat`      | AI chatbot for career prep with conversation history     |
| POST   | `/webhooks/clerk`   | Clerk webhook to sync new users to Supabase              |
| GET    | `/`                 | Health check                                             |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `GEMINI_API_KEY`        | Google Gemini API key (resume analysis)        |
| `ADZUNA_APP_ID`         | Adzuna application ID                          |
| `ADZUNA_APP_KEY`        | Adzuna application key                         |
| `GROQ_API_KEY`          | Groq API key (career insights, chatbot, roadmap)|
| `SUPABASE_URL`          | Supabase project URL                           |
| `SUPABASE_ANON_KEY`     | Supabase anonymous key                         |
| `CLERK_WEBHOOK_SECRET`  | Clerk webhook signing secret (optional)        |
| `PORT`                  | Server port (default: 5000)                    |

### Frontend (`frontend/.env.local`)

| Variable                            | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                          |
| `CLERK_SECRET_KEY`                  | Clerk secret key                               |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase anonymous key                         |
| `NEXT_PUBLIC_API_URL`               | Backend API base URL (default: localhost:5000) |

---

## License

MIT
