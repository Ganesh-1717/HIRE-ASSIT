"use client";

import { Job } from "@/app/page";

interface JobListingsProps {
  jobs: Job[];
}

export default function JobListings({ jobs }: JobListingsProps) {
  const groupedJobs = jobs.reduce(
    (acc, job) => {
      const role = job.searchRole;
      if (!acc[role]) acc[role] = [];
      acc[role].push(job);
      return acc;
    },
    {} as Record<string, Job[]>
  );

  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.35s", animationFillMode: "both" }}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center border border-emerald-100">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900">Job Recommendations</h3>
          <p className="text-xs text-zinc-400 font-medium">{jobs.length} matching positions found</p>
        </div>
      </div>

      {Object.entries(groupedJobs).map(([role, roleJobs]) => (
        <div key={role} className="mb-8 last:mb-0">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-brand-500 to-violet-500 rounded-full" />
            <h4 className="text-sm font-bold text-zinc-700 uppercase tracking-wide">{role}</h4>
            <span className="text-[11px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md font-bold">
              {roleJobs.length}
            </span>
          </div>
          <div className="grid gap-3">
            {roleJobs.map((job, i) => (
              <JobCard key={i} job={job} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <div
      className="glass-card p-5 group animate-slide-up"
      style={{ animationDelay: `${0.04 * index}s`, animationFillMode: "both" }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Job Title */}
          <h5
            className="font-bold text-zinc-900 mb-2 leading-tight text-[15px] group-hover:text-brand-700 transition-colors"
            dangerouslySetInnerHTML={{ __html: job.title }}
          />

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm mb-3">
            {job.company !== "N/A" && (
              <span className="flex items-center gap-1.5 text-zinc-500">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">{job.company}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 text-zinc-500">
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            {job.salary !== "Not disclosed" && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.salary}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
            {job.description}
          </p>
        </div>

        {/* Apply Button */}
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-brand-500/20"
        >
          Apply
          <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
