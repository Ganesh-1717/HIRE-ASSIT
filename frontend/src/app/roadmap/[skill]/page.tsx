"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface RoadmapStep {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  youtube_query: string;
  time_estimate: string;
}

interface Roadmap {
  skill: string;
  description: string;
  total_time: string;
  steps: RoadmapStep[];
}

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    glow: "shadow-emerald-200/50",
    line: "from-emerald-400 to-emerald-300",
  },
  intermediate: {
    label: "Intermediate",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    glow: "shadow-amber-200/50",
    line: "from-amber-400 to-amber-300",
  },
  advanced: {
    label: "Advanced",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
    glow: "shadow-rose-200/50",
    line: "from-rose-400 to-rose-300",
  },
};

// ── Smart YouTube Channel Picker ──────────────────────────────────────────────
// Maps topic keywords → best-known curated YouTube channel search
function getYouTubeUrl(title: string, youtubeQuery: string): string {
  const text = (title + " " + youtubeQuery).toLowerCase();
  // Helper: search within a specific channel
  const ch = (handle: string) =>
    `https://www.youtube.com/@${handle}/search?query=${encodeURIComponent(youtubeQuery)}`;

  // Data Structures & specific DS topics → TakeUForward (Striver)
  if (/data structure|linked list|\bstack\b|\bqueue\b|\btree\b|\bheap\b|\btrie\b|\bgraph\b|\bhashing\b|binary tree|bst/i.test(text))
    return ch("takeUforward");

  // Dynamic Programming → Aditya Verma
  if (/dynamic programming|\bdp\b|memoization|tabulation|knapsack|coin change|longest common/i.test(text))
    return ch("AdityaVermaTheProgrammingLord");

  // Algorithms & Complexity → Abdul Bari
  if (/\balgorithm|sorting|searching|binary search|complexity|big.?o|divide.?and.?conquer|backtracking|greedy/i.test(text))
    return ch("abdul_bari");

  // React / Redux / Next.js → Codevolution
  if (/\breact\b|\bjsx\b|\bhooks\b|\bredux\b|next\.?js|nextjs|react.?native/i.test(text))
    return ch("Codevolution");

  // JavaScript fundamentals → Akshay Saini (Namaste JavaScript – hugely popular in India)
  if (/\bjavascript\b|\bjs\b|closure|prototype|\basync\b|\bpromise\b|event.?loop|hoisting|this.?keyword/i.test(text))
    return ch("akshaymarch7");

  // TypeScript → Matt Pocock
  if (/typescript|\btypes\b|\binterface\b|generics/i.test(text))
    return ch("mattpocockuk");

  // Node.js / Express / REST API → The Net Ninja
  if (/node\.?js|\bexpress\b|\bbackend\b|rest.?api|api.?design|\bmiddleware\b/i.test(text))
    return ch("NetNinja");

  // Python → Corey Schafer
  if (/\bpython\b|\bdjango\b|\bflask\b|\bpandas\b|\bnumpy\b|\bpip\b/i.test(text))
    return ch("coreyms");

  // Machine Learning → Krish Naik
  if (/machine.?learning|\bml\b|scikit|random.?forest|\bregression\b|\bclassification\b|feature.?engineering/i.test(text))
    return ch("krishnaik06");

  // Deep Learning / Neural Networks → 3Blue1Brown (math intuition) + fallback Sentdex
  if (/deep.?learning|neural.?network|\btensorflow\b|\bpytorch\b|\btransformer\b|\bllm\b|backpropagation/i.test(text))
    return ch("3blue1brown");

  // System Design & Architecture → Gaurav Sen
  if (/system.?design|scalab|microservice|load.?balanc|cach|\bcap\b|\bsharding\b|\bmessage.?queue\b/i.test(text))
    return ch("GauravSensei");

  // DevOps / Docker / Kubernetes / CI-CD → TechWorld with Nana
  if (/\bdocker\b|kubernetes|\bdevops\b|ci.?cd|\bjenkins\b|\bterraform\b|\bansible\b|\bhelm\b/i.test(text))
    return ch("TechWorldwithNana");

  // SQL / Databases → kudvenkat (very popular for SQL series)
  if (/\bsql\b|\bmysql\b|postgresql|\bdatabase\b|\bmongodb\b|\bredis\b|normalization/i.test(text))
    return ch("Csharp-video-tutorialsBlogspot");

  // Java / Spring → Telusko (Navin Reddy)
  if (/\bjava\b|\bspring\b|hibernate|\bjvm\b|\bmaven\b|\bgradle\b/i.test(text))
    return ch("Telusko");

  // C++ / Competitive Programming → The Cherno
  if (/c\+\+|\bcpp\b|pointers|memory.?management|stl/i.test(text))
    return ch("TheCherno");

  // CSS / UI / Responsive Design → Kevin Powell
  if (/\bcss\b|tailwind|flexbox|\bgrid\b|responsive|\banimation\b|\bui\b design/i.test(text))
    return ch("KevinPowell");

  // HTML / Web Basics → Traversy Media
  if (/\bhtml\b|web.?basics|web.?fundamentals|dom.?manipulation/i.test(text))
    return ch("TraversyMedia");

  // Git / GitHub / Version Control → Traversy Media
  if (/\bgit\b|\bgithub\b|version.?control|branching|\bpull.?request\b/i.test(text))
    return ch("TraversyMedia");

  // Linux / Shell / Bash → The Linux Experiment
  if (/\blinux\b|\bbash\b|\bshell\b|\bcommand.?line\b|\bterminal\b/i.test(text))
    return ch("thelinuxexp");

  // General CS / Programming → freeCodeCamp (fallback for most topics)
  if (/programming|computer.?science|\bcs\b|\boop\b|object.?oriented/i.test(text))
    return ch("freecodecamp");

  // Final fallback → generic YouTube search
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function SkillRoadmapPage() {
  const params = useParams();
  const router = useRouter();

  const skill = decodeURIComponent((params.skill as string) || "");

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skill) return;

    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/skill-roadmap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skill }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch roadmap");

        setRoadmap(data.roadmap);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading the roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [skill]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-[3px] border-zinc-100 rounded-full" />
          <div className="w-16 h-16 border-[3px] border-transparent rounded-full animate-spin border-t-brand-500 absolute top-0 left-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-500 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Building Your Roadmap</h2>
        <p className="text-slate-500 mt-2">Generating learning path for <span className="font-semibold text-brand-600">{skill}</span>...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 text-center max-w-md">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to Load Roadmap</h2>
          <p className="text-slate-500 mb-6">{error || "Could not load roadmap"}</p>
          <button
            onClick={() => router.push('/analyzer')}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.push('/analyzer')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">{roadmap.skill}</h1>
            <p className="text-xs font-medium text-slate-500">Learning Roadmap</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        {/* Overview Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-10 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-violet-500 rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-slate-600 leading-relaxed text-sm">{roadmap.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {roadmap.total_time}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {roadmap.steps.length} Steps
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {roadmap.steps.map((step, index) => {
            const config = difficultyConfig[step.difficulty] || difficultyConfig.beginner;
            const isLast = index === roadmap.steps.length - 1;

            return (
              <div
                key={index}
                className="relative flex gap-6 animate-slide-up"
                style={{ animationDelay: `${0.1 + index * 0.08}s`, animationFillMode: "both" }}
              >
                {/* Timeline Spine */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Step Number Dot */}
                  <div className={`relative w-10 h-10 rounded-full ${config.dot} flex items-center justify-center text-white text-sm font-bold shadow-lg ${config.glow} z-10`}>
                    {index + 1}
                  </div>
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className={`w-0.5 flex-1 min-h-[40px] bg-gradient-to-b ${config.line} opacity-40`} />
                  )}
                </div>

                {/* Step Card */}
                <div className={`flex-1 mb-6 ${isLast ? "" : "pb-2"}`}>
                  <div className="w-full text-left bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300">
                    {/* Title & Description */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-800">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                        {config.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {step.time_estimate}
                      </span>
                    </div>

                    {/* Resource Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      {/* YouTube */}
                      <button
                        onClick={() =>
                          window.open(
                            getYouTubeUrl(step.title, step.youtube_query),
                            "_blank"
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-600 text-xs font-semibold rounded-xl transition-all duration-200 group/yt"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                        </svg>
                        Watch on YouTube
                        <svg className="w-3 h-3 opacity-0 group-hover/yt:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>

                      {/* Articles */}
                      <button
                        onClick={() =>
                          window.open(
                            `https://dev.to/search?q=${encodeURIComponent(step.youtube_query)}`,
                            "_blank"
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-50 hover:bg-brand-100 border border-brand-100 hover:border-brand-200 text-brand-700 text-xs font-semibold rounded-xl transition-all duration-200 group/art"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Read Articles
                        <svg className="w-3 h-3 opacity-0 group-hover/art:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>

                      {/* Medium */}
                      <button
                        onClick={() =>
                          window.open(
                            `https://medium.com/search?q=${encodeURIComponent(step.youtube_query)}`,
                            "_blank"
                          )
                        }
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold rounded-xl transition-all duration-200 group/med"
                        title="Search on Medium"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                        </svg>
                        Medium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Finish Flag */}
          <div className="flex gap-6 animate-slide-up" style={{ animationDelay: `${0.1 + roadmap.steps.length * 0.08}s`, animationFillMode: "both" }}>
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-brand-200/50 z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 pb-2">
              <div className="bg-gradient-to-r from-brand-50 to-violet-50 rounded-2xl p-5 border border-brand-100">
                <h3 className="text-base font-bold text-brand-800">Roadmap Complete! 🎉</h3>
                <p className="text-sm text-brand-600/80 mt-1">You&apos;ve mastered <span className="font-semibold">{roadmap.skill}</span>. Keep practicing and building projects!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
