"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface StatsData {
  total: number;
  averageOverall: number;
  recommendation: { Yes: number; No: number; Maybe: number };
  futureUsage: {
    "Very Likely": number;
    Likely: number;
    Neutral: number;
    Unlikely: number;
    "Very Unlikely": number;
  };
  pieChart: {
    Excellent: number;
    Good: number;
    Average: number;
    "Needs Improvement": number;
    Poor: number;
  };
}

const PIE_COLORS: Record<string, string> = {
  Excellent: "#22c55e", // emerald-500
  Good: "#3b82f6", // blue-500
  Average: "#eab308", // yellow-500
  "Needs Improvement": "#f97316", // orange-500
  Poor: "#ef4444", // red-500
};

const PIE_LABELS: Record<string, string> = {
  Excellent: "★★★★★ Excellent (4.5–5.0)",
  Good: "★★★★☆ Good (3.5–4.49)",
  Average: "★★★☆☆ Average (2.5–3.49)",
  "Needs Improvement": "★★☆☆☆ Needs Improvement (1.5–2.49)",
  Poor: "★☆☆☆☆ Poor (1.0–1.49)",
};

function SinglePieChart({ pieData, total }: { pieData: StatsData["pieChart"]; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-64 h-64 rounded-full border-4 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 text-center px-4">
          No feedback collected yet
        </p>
      </div>
    );
  }

  let cumulativeAngle = -90; // Start at top
  const categories = Object.keys(pieData) as (keyof typeof pieData)[];
  const slices: { category: string; path: string; color: string; count: number; pct: number }[] = [];

  const cx = 120;
  const cy = 120;
  const r = 95;

  categories.forEach((cat) => {
    const count = pieData[cat];
    if (count === 0) return;

    const pct = (count / total) * 100;
    const angle = (count / total) * 360;

    const startRad = (cumulativeAngle * Math.PI) / 180;
    const endRad = ((cumulativeAngle + angle) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    slices.push({
      category: cat,
      path,
      color: PIE_COLORS[cat],
      count,
      pct: Math.round(pct * 10) / 10,
    });

    cumulativeAngle += angle;
  });

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 240 240" width="240" height="240" className="drop-shadow-xl overflow-visible">
        {slices.map((slice) => (
          <path
            key={slice.category}
            d={slice.path}
            fill={slice.color}
            stroke="white"
            strokeWidth="3"
            onMouseEnter={() => setHovered(slice.category)}
            onMouseLeave={() => setHovered(null)}
            className="transition-all duration-200 cursor-pointer hover:opacity-85 hover:scale-105 transform-origin-center"
          >
            <title>{`${slice.category}: ${slice.count} (${slice.pct}%)`}</title>
          </path>
        ))}

        {/* Center Donut Cutout */}
        <circle cx={cx} cy={cy} r={50} className="fill-white dark:fill-zinc-900" />

        {/* Inner Text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          className="fill-zinc-900 dark:fill-zinc-100"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          className="fill-zinc-400 dark:fill-zinc-500 uppercase tracking-wider"
        >
          Evaluations
        </text>
      </svg>

      {hovered && (
        <div className="mt-3 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 animate-fade-in">
          {hovered}: {(pieData as Record<string, number>)[hovered] || 0} response(s) (
          {Math.round((((pieData as Record<string, number>)[hovered] || 0) / total) * 100)}%)
        </div>
      )}
    </div>
  );
}

export default function AdminFeedbackDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/feedback/stats`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard data.");
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/feedback")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Feedback Form
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin <span className="gradient-text">Analytics Dashboard</span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              System Evaluation Statistics
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm self-start md:self-auto"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Live Stats
          </button>
        </div>

        {/* Skeleton Loading State */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 animate-pulse flex flex-col justify-between">
                  <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="w-16 h-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
            <div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 animate-pulse" />
          </div>
        ) : error ? (
          <div className="p-8 bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/50 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Failed to Load Feedback Data</h3>
            <p className="text-xs text-rose-500 max-w-md mx-auto">{error}</p>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Total Submissions
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{stats.total}</span>
                  <span className="text-xs text-zinc-500">Evaluations</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Average Overall Score
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                    {stats.averageOverall > 0 ? stats.averageOverall : "—"}
                  </span>
                  <span className="text-xs text-zinc-500">/ 5.0</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Would Recommend (Yes)
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {stats.recommendation.Yes}
                  </span>
                  <span className="text-xs text-zinc-500">
                    ({stats.total > 0 ? Math.round((stats.recommendation.Yes / stats.total) * 100) : 0}%)
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Likely Future Usage
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {stats.futureUsage["Very Likely"] + stats.futureUsage["Likely"]}
                  </span>
                  <span className="text-xs text-zinc-500">Users</span>
                </div>
              </div>
            </div>

            {/* ONLY ONE PIE CHART CARD */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Overall Performance of HireAssist
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Calculated by averaging Questions 1–7 for each user and categorizing into IEEE satisfaction bands.
                  </p>
                </div>
                <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full self-start sm:self-auto">
                  Pie Chart Analysis
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4">
                {/* SVG Pie Chart */}
                <div className="shrink-0">
                  <SinglePieChart pieData={stats.pieChart} total={stats.total} />
                </div>

                {/* Legend & Band Breakdown */}
                <div className="w-full max-w-md space-y-3.5">
                  {(Object.keys(PIE_COLORS) as (keyof typeof PIE_COLORS)[]).map((cat) => {
                    const count = stats.pieChart[cat as keyof typeof stats.pieChart] || 0;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div
                        key={cat}
                        className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: PIE_COLORS[cat] }}
                          />
                          <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            {PIE_LABELS[cat]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{count}</span>
                          <span className="text-xs text-zinc-400 font-medium">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommendation & Future Usage Summary Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recommendation Breakdown */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
                  Question 8: Recommendation Distribution
                </h3>
                <div className="space-y-3">
                  {(["Yes", "No", "Maybe"] as const).map((opt) => {
                    const count = stats.recommendation[opt] || 0;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={opt} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-700 dark:text-zinc-300">{opt}</span>
                          <span className="text-zinc-500">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Future Usage Breakdown */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
                  Question 9: Future Usage Intent
                </h3>
                <div className="space-y-3">
                  {(["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"] as const).map((opt) => {
                    const count = stats.futureUsage[opt] || 0;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={opt} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-700 dark:text-zinc-300">{opt}</span>
                          <span className="text-zinc-500">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
