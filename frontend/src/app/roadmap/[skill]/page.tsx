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
            onClick={() => router.back()}
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
            onClick={() => router.back()}
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
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(step.youtube_query)}`,
                        "_blank"
                      )
                    }
                    className="w-full text-left bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                      </div>
                      {/* YouTube Icon */}
                      <div className="shrink-0 w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                        {config.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {step.time_estimate}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Watch on YouTube
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    </div>
                  </button>
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
