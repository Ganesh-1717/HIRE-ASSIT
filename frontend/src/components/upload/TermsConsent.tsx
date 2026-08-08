"use client";

import { useState } from "react";

interface TermsConsentProps {
  onAccept: () => void;
}

export default function TermsConsent({ onAccept }: TermsConsentProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-card overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-100/30 via-violet-100/20 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-glow shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-50 text-brand-700 rounded-md text-[11px] font-bold uppercase tracking-wider mb-1">
                Step 1 of 2 &middot; Security & Privacy Gate
              </div>
              <h2 className="text-xl font-extrabold text-zinc-900">
                Terms of Service & Privacy Policy
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Please review and accept our data security agreement to proceed to resume analysis.
              </p>
            </div>
          </div>

          {/* Security Guarantee Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center text-center">
              <span className="text-lg mb-1">🔒</span>
              <span className="text-[11px] font-bold text-zinc-800">TLS 1.3 Encrypted</span>
              <span className="text-[10px] text-zinc-400">In-transit & at rest</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center text-center">
              <span className="text-lg mb-1">🤖</span>
              <span className="text-[11px] font-bold text-zinc-800">LLM Protected</span>
              <span className="text-[10px] text-zinc-400">No training data reuse</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center text-center">
              <span className="text-lg mb-1">🛡️</span>
              <span className="text-[11px] font-bold text-zinc-800">Strict RLS</span>
              <span className="text-[10px] text-zinc-400">Clerk + Supabase Auth</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center text-center">
              <span className="text-lg mb-1">⚡</span>
              <span className="text-[11px] font-bold text-zinc-800">Sanitizer Guard</span>
              <span className="text-[10px] text-zinc-400">Anti-prompt injection</span>
            </div>
          </div>

          {/* Security Terms Box */}
          <div className="bg-zinc-50/80 border border-zinc-200/70 rounded-2xl p-5 max-h-64 overflow-y-auto space-y-4 text-xs text-zinc-600 leading-relaxed divide-y divide-zinc-200/50">
            <div>
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                1. User Consent & Data Processing
              </h4>
              <p>
                By uploading your resume, you grant HireAssist explicit consent to parse your professional skills, work history, and qualifications solely for generating AI-powered evaluation metrics, skill roadmaps, and career insights.
              </p>
            </div>

            <div className="pt-3">
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                2. Data Encryption & Sensitive Information
              </h4>
              <p>
                All uploaded documents and personal information are transmitted securely via TLS 1.3 protocols and stored using encrypted storage mechanisms at rest in Supabase infrastructure.
              </p>
            </div>

            <div className="pt-3">
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                3. LLM Data Exposure Disclosure
              </h4>
              <p>
                Resume text is processed through enterprise LLM endpoints (Groq / Gemini) exclusively for real-time inference. Your data is never stored by third-party LLM providers nor retained for foundational AI model training.
              </p>
            </div>

            <div className="pt-3">
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                4. Access Control & Data Retention
              </h4>
              <p>
                Access to your saved resume history is protected via Clerk user session authentication and Supabase Row Level Security (RLS). You retain complete ownership and may delete your evaluation history anytime.
              </p>
            </div>

            <div className="pt-3">
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                5. Defense Against Prompt-Injection Attacks
              </h4>
              <p>
                All extracted text is passed through automated security sanitizers to prevent prompt-injection attacks, model hijacking, or malicious command execution.
              </p>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="p-4 bg-brand-50/50 border border-brand-100 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="gate-terms-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor="gate-terms-checkbox" className="text-xs text-zinc-700 font-semibold cursor-pointer leading-relaxed">
              I have read, understood, and agree to the Terms of Service & Privacy Policy outlined above.
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            disabled={!isChecked}
            onClick={onAccept}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              isChecked
                ? "bg-slate-900 hover:bg-brand-600 text-white cursor-pointer hover:shadow-glow"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
          >
            Accept Terms & Proceed to Resume Upload
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
