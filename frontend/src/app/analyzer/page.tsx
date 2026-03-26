"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import ResumeUpload from "@/components/upload/ResumeUpload";
import Results from "@/components/results/Results";
import JobListings from "@/components/job-card/JobListings";
import { AnalysisResult, Job } from "@/app/types";
export type { AnalysisResult, Job };

interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: Date;
  analysis: AnalysisResult;
  jobs: Job[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setJobs([]);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setAnalysis(data.analysis);

      // Fetch jobs based on recommended roles
      if (data.analysis.recommended_roles?.length > 0) {
        setLoadingJobs(true);
        try {
          const jobsRes = await fetch(`${API_URL}/jobs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roles: data.analysis.recommended_roles }),
          });
          const jobsData = await jobsRes.json();
          if (jobsData.success) {
            setJobs(jobsData.jobs);
          }
        } catch (jobErr) {
          console.error("Failed to fetch jobs:", jobErr);
        } finally {
          setLoadingJobs(false);
        }
      }

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        fileName: file.name,
        timestamp: new Date(),
        analysis: data.analysis,
        jobs: jobs,
      };
      setHistory((prev) => [historyItem, ...prev]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setAnalysis(item.analysis);
    setJobs(item.jobs);
    setError(null);
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    setJobs([]);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        history={history}
        onHistoryClick={handleHistoryClick}
        onNewAnalysis={handleNewAnalysis}
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? "ml-[280px]" : "ml-0"}`}
      >
        {/* Toggle button when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-5 left-5 z-30 p-2.5 bg-white rounded-xl shadow-glass hover:shadow-glass-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-zinc-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Hero / Header */}
          {!analysis && !loading && (
            <div className="text-center mb-14 animate-fade-in">
              {/* Logo Mark */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl mb-6 shadow-glow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="gradient-text">AI Resume</span>{" "}
                <span className="text-zinc-900">Analyzer</span>
              </h1>
              <p className="text-base md:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed font-medium">
                Upload your resume and get instant AI-powered analysis with skill insights and personalized job matches.
              </p>

              {/* Feature pills */}
              <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-zinc-100 shadow-sm text-sm text-zinc-500 font-medium">
                  <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI-Powered
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-zinc-100 shadow-sm text-sm text-zinc-500 font-medium">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Job Matching
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-zinc-100 shadow-sm text-sm text-zinc-500 font-medium">
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Skill Analysis
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          {!analysis && !loading && (
            <div className="animate-slide-up-delayed">
              <ResumeUpload onUpload={handleUpload} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 border-[3px] border-zinc-100 rounded-full" />
                <div className="w-20 h-20 border-[3px] border-transparent rounded-full animate-spin border-t-brand-500 absolute top-0 left-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-500 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="mt-8 text-xl font-bold text-zinc-800">Analyzing your resume</p>
              <p className="mt-2 text-sm text-zinc-400 font-medium">Extracting skills and matching jobs...</p>

              {/* Progress steps */}
              <div className="mt-8 space-y-3">
                <LoadingStep label="Extracting text from PDF" done />
                <LoadingStep label="Analyzing skills with AI" active />
                <LoadingStep label="Finding job matches" />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="animate-slide-up max-w-lg mx-auto">
              <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center shadow-card">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Analysis Failed</h3>
                <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{error}</p>
                <button
                  onClick={handleNewAnalysis}
                  className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Results Header */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900">Analysis Complete</h2>
                    <p className="text-xs text-zinc-400 font-medium">Here&apos;s what we found in your resume</p>
                  </div>
                </div>
                <button
                  onClick={handleNewAnalysis}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white border border-zinc-200 text-zinc-600 font-semibold rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New
                </button>
              </div>

              <Results analysis={analysis} />

              {/* Job Listings */}
              {loadingJobs ? (
                <div className="flex flex-col items-center py-16 animate-fade-in">
                  <div className="relative">
                    <div className="w-12 h-12 border-[3px] border-zinc-100 rounded-full" />
                    <div className="w-12 h-12 border-[3px] border-transparent rounded-full animate-spin border-t-emerald-500 absolute top-0 left-0" />
                  </div>
                  <p className="mt-5 text-sm font-bold text-zinc-700">Finding matching jobs...</p>
                  <p className="mt-1 text-xs text-zinc-400">Searching across multiple platforms</p>
                </div>
              ) : (
                jobs.length > 0 && <JobListings jobs={jobs} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function LoadingStep({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : active ? (
        <div className="w-6 h-6 border-2 border-brand-200 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-soft" />
        </div>
      ) : (
        <div className="w-6 h-6 border-2 border-zinc-200 rounded-full" />
      )}
      <span className={`text-sm font-medium ${done ? "text-emerald-600" : active ? "text-zinc-700" : "text-zinc-300"}`}>
        {label}
      </span>
    </div>
  );
}
