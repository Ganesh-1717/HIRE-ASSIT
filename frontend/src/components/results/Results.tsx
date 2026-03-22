"use client";

import { AnalysisResult } from "@/app/page";

interface ResultsProps {
  analysis: AnalysisResult;
}

function SectionCard({
  icon,
  iconBg,
  iconColor,
  title,
  count,
  children,
  delay = "0s",
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  count?: number;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <div
      className="glass-card p-6 animate-slide-up"
      style={{ animationDelay: delay, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-zinc-900">{title}</h3>
          {count !== undefined && (
            <span className="text-[11px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
              {count}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Results({ analysis }: ResultsProps) {
  return (
    <div className="space-y-5">
      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up">
        <StatCard
          label="Experience"
          value={analysis.experience_years || "N/A"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="brand"
        />
        <StatCard
          label="Tech Skills"
          value={String(analysis.technical_skills?.length || 0)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="Languages"
          value={String(analysis.languages?.length || 0)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="emerald"
        />
        <StatCard
          label="Skill Gaps"
          value={String(analysis.missing_skills?.length || 0)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          color="rose"
        />
      </div>

      {/* Technical Skills */}
      {analysis.technical_skills?.length > 0 && (
        <SectionCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          title="Technical Skills"
          count={analysis.technical_skills.length}
          delay="0.05s"
        >
          <div className="flex flex-wrap gap-2">
            {analysis.technical_skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Programming Languages */}
      {analysis.languages?.length > 0 && (
        <SectionCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          title="Programming Languages"
          count={analysis.languages.length}
          delay="0.1s"
        >
          <div className="flex flex-wrap gap-2">
            {analysis.languages.map((lang, i) => (
              <span key={i} className="skill-tag-green">{lang}</span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Frameworks */}
      {analysis.frameworks?.length > 0 && (
        <SectionCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          title="Frameworks & Libraries"
          count={analysis.frameworks.length}
          delay="0.15s"
        >
          <div className="flex flex-wrap gap-2">
            {analysis.frameworks.map((fw, i) => (
              <span key={i} className="skill-tag-purple">{fw}</span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Soft Skills */}
      {analysis.soft_skills?.length > 0 && (
        <SectionCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          title="Soft Skills"
          count={analysis.soft_skills.length}
          delay="0.2s"
        >
          <div className="flex flex-wrap gap-2">
            {analysis.soft_skills.map((skill, i) => (
              <span key={i} className="skill-tag-amber">{skill}</span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Recommended Roles */}
      {analysis.recommended_roles?.length > 0 && (
        <SectionCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          iconBg="bg-gradient-to-br from-brand-50 to-violet-50"
          iconColor="text-brand-600"
          title="Recommended Roles"
          delay="0.25s"
        >
          <div className="grid gap-2.5">
            {analysis.recommended_roles.map((role, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3.5 bg-gradient-to-r from-brand-50/80 to-violet-50/50 rounded-xl border border-brand-100/50 hover:border-brand-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-sm font-bold text-brand-600 shadow-sm border border-brand-100 group-hover:shadow-md transition-shadow">
                  {i + 1}
                </div>
                <span className="font-semibold text-zinc-800 text-sm">{role}</span>
                <svg className="w-4 h-4 text-zinc-300 ml-auto group-hover:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Skill Gaps */}
      {analysis.missing_skills?.length > 0 && (
        <SectionCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
          title="Skills to Develop"
          count={analysis.missing_skills.length}
          delay="0.3s"
        >
          <p className="text-xs text-zinc-400 mb-3 font-medium">Consider learning these to boost your profile</p>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.map((skill, i) => (
              <span key={i} className="skill-tag-red">{skill}</span>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    brand: { bg: "bg-brand-50", text: "text-brand-600", border: "border-brand-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-100" },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`${c.bg} rounded-2xl p-4 border ${c.border} animate-scale-in`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={c.text}>{icon}</div>
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-2xl font-extrabold ${c.text}`}>{value}</p>
    </div>
  );
}
