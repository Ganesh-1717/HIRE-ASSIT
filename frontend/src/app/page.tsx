"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-500 rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Hire<span className="text-brand-500">Assist</span>
            </span>
          </div>
          <Link
            href="/analyzer"
            className="px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-sm hover:shadow-glow"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Subtle background decorations */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />

        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full text-sm font-medium text-brand-600 mb-8">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-soft" />
            Powered by AI &middot; Groq + Llama 3.3
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="text-slate-800">Your Career,</span>
            <br />
            <span className="gradient-text">Supercharged</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Upload your resume and get instant AI-powered analysis with deep skill insights, 
            gap identification, and personalized job recommendations.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/analyzer"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-base font-semibold rounded-2xl hover:bg-brand-600 transition-all duration-300 shadow-lg hover:shadow-glow-lg"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-600 text-base font-semibold rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-16 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-800">AI</div>
              <div className="text-sm text-slate-400 font-medium mt-1">Powered Analysis</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-800">10s</div>
              <div className="text-sm text-slate-400 font-medium mt-1">Average Speed</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-800">Free</div>
              <div className="text-sm text-slate-400 font-medium mt-1">No Credit Card</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
              Everything you need to <span className="gradient-text">land your dream job</span>
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto font-medium">
              Our AI analyzes your resume in seconds and provides actionable insights to boost your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-card-hover hover:border-brand-100 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                <svg className="w-7 h-7 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">AI-Powered Analysis</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Advanced AI reads and understands your resume, extracting technical skills, frameworks, languages, and experience level with high accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-card-hover hover:border-emerald-100 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Smart Job Matching</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Based on your skills and experience, we recommend the best-fit roles and surface real job listings from across the web.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-card-hover hover:border-violet-100 transition-all duration-300">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-100 transition-colors">
                <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Skill Gap Analysis</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Discover what skills you&apos;re missing for your target roles and get a clear roadmap to level up your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-base text-slate-400 max-w-lg mx-auto font-medium">
              Three simple steps to unlock powerful career insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-brand-50 border-2 border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-extrabold text-brand-500">1</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Resume</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Drop your PDF resume into the upload zone. It&apos;s fast, secure, and private.
              </p>
              {/* Connector line (hidden on mobile) */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-0.5 bg-gradient-to-r from-brand-200 to-emerald-200" />
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-extrabold text-emerald-500">2</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">AI Analyzes</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our AI engine extracts your skills, experience, and identifies gaps in seconds.
              </p>
              <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-0.5 bg-gradient-to-r from-emerald-200 to-violet-200" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-50 border-2 border-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-extrabold text-violet-500">3</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Get Matched</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Receive personalized job recommendations and a detailed skill breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-3xl border border-slate-100 p-12 md:p-16 shadow-card">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow-lg animate-float">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
              Ready to level up your career?
            </h2>
            <p className="text-base text-slate-500 max-w-lg mx-auto mb-8 font-medium leading-relaxed">
              Join thousands of professionals using AI to optimize their resumes and find their perfect role.
            </p>
            <Link
              href="/analyzer"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-500 text-white text-base font-semibold rounded-2xl hover:bg-brand-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
            >
              Try It Now — It&apos;s Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-violet-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">HireAssist</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 HireAssist. Built with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
