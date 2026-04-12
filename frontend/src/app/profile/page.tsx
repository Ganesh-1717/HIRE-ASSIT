"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AnalysisResult } from "@/app/types";

interface HistoryItem {
  id: string;
  file_name: string;
  created_at: string;
  analysis: AnalysisResult;
}

interface AggregatedSkills {
  technical: { skill: string; count: number }[];
  frameworks: { skill: string; count: number }[];
  languages: { skill: string; count: number }[];
}

function aggregateSkills(history: HistoryItem[]): AggregatedSkills {
  const techMap = new Map<string, number>();
  const fwMap = new Map<string, number>();
  const langMap = new Map<string, number>();

  for (const item of history) {
    const a = item.analysis;
    (a.technical_skills || []).forEach((s) => techMap.set(s, (techMap.get(s) || 0) + 1));
    (a.frameworks || []).forEach((s) => fwMap.set(s, (fwMap.get(s) || 0) + 1));
    (a.languages || []).forEach((s) => langMap.set(s, (langMap.get(s) || 0) + 1));
  }

  const toSorted = (map: Map<string, number>) =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([skill, count]) => ({ skill, count }));

  return {
    technical: toSorted(techMap),
    frameworks: toSorted(fwMap),
    languages: toSorted(langMap),
  };
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [skills, setSkills] = useState<AggregatedSkills>({ technical: [], frameworks: [], languages: [] });

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("resume_history")
          .select("id, file_name, created_at, analysis")
          .eq("clerk_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setHistory(data as HistoryItem[]);
          setSkills(aggregateSkills(data as HistoryItem[]));
        }
      } catch (e) {
        console.error("Failed to load history:", e);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user, isLoaded]);

  const handleLoadAnalysis = (item: HistoryItem) => {
    sessionStorage.setItem("hireassist_analysis", JSON.stringify(item.analysis));
    sessionStorage.setItem("hireassist_jobs", JSON.stringify([]));
    router.push("/analyzer");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const totalUniqueSkills = new Set([
    ...skills.technical.map((s) => s.skill),
    ...skills.frameworks.map((s) => s.skill),
    ...skills.languages.map((s) => s.skill),
  ]).size;

  const lastAnalysisDate =
    history.length > 0
      ? new Date(history[0].created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-[3px] border-zinc-100 rounded-full" />
          <div className="w-12 h-12 border-[3px] border-transparent rounded-full animate-spin border-t-brand-500 absolute top-0 left-0" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.push("/analyzer")}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Back to analyzer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">My Profile</h1>
            <p className="text-xs font-medium text-slate-500">Account & Activity</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* ── Profile Hero Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-brand-500 via-violet-500 to-indigo-500 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
            />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                    {(user.fullName || user.firstName || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-12">
                <button
                  onClick={() => router.push("/analyzer")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm shadow-brand-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Analysis
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>

            {/* Name & Email */}
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {user.fullName || user.firstName || "Candidate"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>

            <div className="flex items-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Member since {new Date(user.createdAt!).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <StatCard
            label="Resumes Analyzed"
            value={loadingHistory ? "—" : history.length.toString()}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            color="brand"
          />
          <StatCard
            label="Skills Detected"
            value={loadingHistory ? "—" : totalUniqueSkills.toString()}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            color="violet"
          />
          <StatCard
            label="Last Analysis"
            value={loadingHistory ? "—" : lastAnalysisDate || "None yet"}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="emerald"
            small
          />
        </div>

        {/* ── Skills Summary ── */}
        {!loadingHistory && (skills.technical.length > 0 || skills.frameworks.length > 0 || skills.languages.length > 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-5">
              <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Your Skills Profile
            </h3>

            <div className="space-y-5">
              {skills.technical.length > 0 && (
                <SkillGroup label="Technical Skills" skills={skills.technical} colorClass="bg-brand-50 text-brand-700 border-brand-100" />
              )}
              {skills.frameworks.length > 0 && (
                <SkillGroup label="Frameworks & Tools" skills={skills.frameworks} colorClass="bg-violet-50 text-violet-700 border-violet-100" />
              )}
              {skills.languages.length > 0 && (
                <SkillGroup label="Languages" skills={skills.languages} colorClass="bg-emerald-50 text-emerald-700 border-emerald-100" />
              )}
            </div>
          </div>
        )}

        {/* ── Resume History ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-5">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Resume History
          </h3>

          {loadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl shimmer" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-600">No resumes analyzed yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload your first resume to get started</p>
              <button
                onClick={() => router.push("/analyzer")}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-brand-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-brand-500 hover:to-violet-500 transition-all duration-200"
              >
                Analyze Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => {
                const skills = [
                  ...(item.analysis.technical_skills || []),
                  ...(item.analysis.frameworks || []),
                ].slice(0, 4);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-200 group"
                  >
                    {/* Index */}
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-brand-600 transition-colors shrink-0">
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900">
                        {item.file_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                        {skills.map((s, i) => (
                          <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                        {(item.analysis.technical_skills?.length || 0) + (item.analysis.frameworks?.length || 0) > 4 && (
                          <span className="text-[11px] text-slate-400">
                            +{(item.analysis.technical_skills?.length || 0) + (item.analysis.frameworks?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Load Button */}
                    <button
                      onClick={() => handleLoadAnalysis(item)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 rounded-lg hover:bg-brand-100 hover:border-brand-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      Load
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({
  label, value, icon, color, small,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "brand" | "violet" | "emerald";
  small?: boolean;
}) {
  const colorMap = {
    brand: { bg: "bg-brand-50", text: "text-brand-600", border: "border-brand-100", val: "text-brand-700" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", val: "text-violet-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", val: "text-emerald-700" },
  }[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-xl ${colorMap.bg} ${colorMap.text} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className={`${small ? "text-base" : "text-2xl"} font-extrabold ${colorMap.val} leading-tight`}>{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function SkillGroup({
  label, skills, colorClass,
}: {
  label: string;
  skills: { skill: string; count: number }[];
  colorClass: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map(({ skill, count }) => (
          <span
            key={skill}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${colorClass}`}
          >
            {skill}
            {count > 1 && (
              <span className="text-[10px] font-bold bg-white/60 px-1 py-0.5 rounded">×{count}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
