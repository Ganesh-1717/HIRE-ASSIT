"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CareerInsights, Job } from "../../types";
import JobListings from "@/components/job-card/JobListings";
import CareerChatbot from "@/components/career-chat/CareerChatbot";

export default function CareerInsightsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const role = decodeURIComponent((params.role as string) || "");
  const exp = searchParams.get("exp") || "";
  const skills = searchParams.get("skills") || "";

  const [insights, setInsights] = useState<CareerInsights | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        // Fetch insights and jobs in parallel
        const [insightsRes, jobsRes] = await Promise.all([
          fetch(`${API_URL}/career-insights`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, experience_years: exp, skills: skills.split(",") }),
          }),
          fetch(`${API_URL}/jobs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roles: [role] }),
          })
        ]);

        const insightsData = await insightsRes.json();
        const jobsData = await jobsRes.json();

        if (!insightsRes.ok) throw new Error(insightsData.error || "Failed to fetch career insights");

        setInsights(insightsData.insights);
        
        if (jobsRes.ok && jobsData.success) {
          setJobs(jobsData.jobs);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading career insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, exp, skills]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
         <div className="relative mb-6">
            <div className="w-16 h-16 border-[3px] border-zinc-100 rounded-full" />
            <div className="w-16 h-16 border-[3px] border-transparent rounded-full animate-spin border-t-brand-500 absolute top-0 left-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-500 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Generating Career Insights</h2>
          <p className="text-slate-500 mt-2">Analyzing market data for {role}...</p>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 text-center max-w-md">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h2>
          <p className="text-slate-500 mb-6">{error || "Could not load insights"}</p>
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
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">{role}</h1>
            <p className="text-xs font-medium text-slate-500">Career Insights & Market Data</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 grid md:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-slide-up">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Role Overview
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              {insights.role_description}
            </p>
          </section>

          {/* Salary Estimation */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
               <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estimated Salary (India)
            </h2>

            {insights.salary.candidate_estimate && (
              <div className="mb-8 p-4 bg-gradient-to-r from-brand-50 to-violet-50 rounded-xl border border-brand-100 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-16 h-16 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-sm font-bold text-brand-700 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Your Estimated Value
                  </span>
                  <span className="text-lg font-extrabold text-brand-900">
                    {insights.salary.candidate_estimate.min >= 100000 ? `₹${(insights.salary.candidate_estimate.min / 100000).toFixed(1)}L` : `₹${(insights.salary.candidate_estimate.min / 1000).toFixed(0)}K`} - {insights.salary.candidate_estimate.max >= 100000 ? `₹${(insights.salary.candidate_estimate.max / 100000).toFixed(1)}L` : `₹${(insights.salary.candidate_estimate.max / 1000).toFixed(0)}K`}
                  </span>
                </div>
                <p className="text-xs text-brand-600/80 leading-relaxed font-medium relative z-10 max-w-[90%]">
                  {insights.salary.candidate_estimate.rationale}
                </p>
              </div>
            )}
            
            <div className="space-y-6">
              <SalaryBar 
                level="Entry Level" 
                range={insights.salary.entry} 
                color="emerald" 
              />
              <SalaryBar 
                level="Mid Level" 
                range={insights.salary.mid} 
                color="brand" 
                active={exp === "3-5 years"}
              />
              <SalaryBar 
                level="Senior Level" 
                range={insights.salary.senior} 
                color="violet" 
                active={exp === "6+ years"}
              />
            </div>
            <p className="text-xs text-slate-400 mt-6 text-center">
              *Estimates based on current market data and AI analysis for the Indian tech hub markets.
            </p>
          </section>

          {/* Interview Questions */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
               <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Top Interview Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  Technical Questions
                </h3>
                <div className="space-y-3">
                  {insights.interview_questions.technical.map((q, i) => (
                    <QuestionCard key={`tech-${i}`} index={i + 1} question={q.question} hint={q.hint} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Behavioral Questions
                </h3>
                <div className="space-y-3">
                  {insights.interview_questions.behavioral.map((q, i) => (
                    <QuestionCard key={`beh-${i}`} index={i + 1} question={q.question} hint={q.hint} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar / Jobs */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Top Hiring Companies</h3>
            <div className="flex flex-wrap gap-2">
              {insights.top_companies.map((company, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                  {company}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-transparent animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {jobs.length > 0 ? (
               <JobListings jobs={jobs} />
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                 <p className="text-sm text-slate-500">No open positions found right now.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Career Chatbot */}
      <CareerChatbot role={role} context={insights} />
    </div>
  );
}

function SalaryBar({ level, range, color, active }: { level: string, range: any, color: string, active?: boolean }) {
  const formatINR = (num: number) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${(num / 1000).toFixed(0)}K`;
  };

  const colorMap: any = {
    emerald: "bg-emerald-500",
    brand: "bg-brand-500",
    violet: "bg-violet-500"
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-700'}`}>{level}</span>
          <span className="text-xs text-slate-500 ml-2">({range.label})</span>
        </div>
        <span className="text-sm font-bold text-slate-900">
          {formatINR(range.min)} - {formatINR(range.max)}
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorMap[color]} rounded-full opacity-80`} 
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

function QuestionCard({ index, question, hint }: { index: number, question: string, hint: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 transition-colors hover:bg-slate-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start text-left p-4 gap-3 focus:outline-none"
      >
        <span className="shrink-0 w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold font-mono">
          Q{index}
        </span>
        <span className="text-sm font-semibold text-slate-800 leading-tight pt-0.5 pr-4 flex-1">
          {question}
        </span>
        <svg 
          className={`shrink-0 w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-1 ml-9">
          <div className="bg-brand-50/50 border border-brand-100/50 rounded-lg p-3 relative">
            <span className="absolute top-0 left-3 -translate-y-1/2 bg-white px-2 text-[10px] font-bold tracking-wider text-brand-500 uppercase rounded border border-brand-100">
              Hint
            </span>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              {hint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
