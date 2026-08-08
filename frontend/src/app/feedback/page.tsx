"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface StarQuestionProps {
  id: number;
  question: string;
  value: number;
  onChange: (val: number) => void;
}

const starLabels = ["", "Poor (1)", "Fair (2)", "Good (3)", "Very Good (4)", "Excellent (5)"];

function StarQuestion({ id, question, value, onChange }: StarQuestionProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 rounded-2xl transition-all hover:border-brand-400 dark:hover:border-brand-500">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
        Question {id} of 7
      </p>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3 leading-snug">
        {question}
      </h3>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-1 group transition-transform hover:scale-115 active:scale-95"
            aria-label={`${star} star`}
          >
            <svg
              className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-150 ${
                star <= (hovered || value)
                  ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                  : "text-zinc-300 dark:text-zinc-600 fill-zinc-200 dark:fill-zinc-700"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
        {(hovered || value) > 0 && (
          <span className="ml-3 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800 animate-fade-in">
            {starLabels[hovered || value]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const { userId } = useAuth();
  const router = useRouter();

  // Ratings 1-7
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState(0);
  const [q4, setQ4] = useState(0);
  const [q5, setQ5] = useState(0);
  const [q6, setQ6] = useState(0);
  const [q7, setQ7] = useState(0);

  // Q8 & Q9
  const [recommendation, setRecommendation] = useState<string>("");
  const [futureUsage, setFutureUsage] = useState<string>("");

  // Q10
  const [suggestions, setSuggestions] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Check duplicate submission for current session
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSubmitted = localStorage.getItem("hireassist_feedback_submitted");
      if (hasSubmitted) {
        setAlreadySubmitted(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7) {
      setError("Please answer all rating questions (1–7).");
      return;
    }
    if (!recommendation) {
      setError("Please select an answer for Question 8 (Recommendation).");
      return;
    }
    if (!futureUsage) {
      setError("Please select an answer for Question 9 (Future Usage).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId || "anonymous",
          resume_accuracy: q1,
          job_recommendation: q2,
          skill_gap_analysis: q3,
          learning_roadmap: q4,
          interview_questions: q5,
          career_chatbot: q6,
          overall_satisfaction: q7,
          recommendation,
          future_usage: futureUsage,
          suggestions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit feedback.");

      // Save duplicate check mark
      localStorage.setItem("hireassist_feedback_submitted", "true");
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 py-10 px-4 sm:px-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 animate-slide-up">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold">Feedback Submitted!</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600">Thank you for helping our research evaluation.</p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Navigation back */}
        <button
          onClick={() => router.push("/analyzer")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Analyzer
        </button>

        {/* Card Container */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
              🎓 Research & Conference Evaluation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Help Us Improve HireAssist
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Your feedback helps us evaluate the AI-powered career assistance system and directly supports our IEEE conference research validation.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {alreadySubmitted && !submitted ? (
              <div className="text-center py-12 px-4 animate-fade-in">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Feedback Already Submitted
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                  You have already completed the evaluation for your recent resume analysis session. Duplicate submissions are restricted.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      localStorage.removeItem("hireassist_feedback_submitted");
                      setAlreadySubmitted(false);
                    }}
                    className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-semibold rounded-xl transition-all"
                  >
                    Clear & Submit Another
                  </button>
                  <button
                    onClick={() => router.push("/feedback/dashboard")}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
                  >
                    View Analytics Dashboard →
                  </button>
                </div>
              </div>
            ) : submitted ? (
              /* Success Animation & State */
              <div className="text-center py-12 px-4 animate-scale-up">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                  Thank You!
                </h2>
                <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Your feedback has been submitted successfully.
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto mb-8">
                  Your responses have been logged in Supabase and integrated into our IEEE conference user study dataset.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => router.push("/analyzer")}
                    className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-semibold rounded-xl transition-all"
                  >
                    Back to Analyzer
                  </button>
                  <button
                    onClick={() => router.push("/feedback/dashboard")}
                    className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-600/20 hover:opacity-90 transition-all"
                  >
                    View Admin Analytics Dashboard →
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Ratings Q1 - Q7 */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    Part 1: Core Feature Ratings (1–5 Stars)
                  </h2>
                  <div className="space-y-4">
                    <StarQuestion
                      id={1}
                      question="How accurately did HireAssist extract information from your resume?"
                      value={q1}
                      onChange={setQ1}
                    />
                    <StarQuestion
                      id={2}
                      question="How relevant were the recommended jobs to your profile and skills?"
                      value={q2}
                      onChange={setQ2}
                    />
                    <StarQuestion
                      id={3}
                      question="Did the identified skill gaps accurately reflect the skills you need to improve?"
                      value={q3}
                      onChange={setQ3}
                    />
                    <StarQuestion
                      id={4}
                      question="How useful was the AI-generated personalized learning roadmap?"
                      value={q4}
                      onChange={setQ4}
                    />
                    <StarQuestion
                      id={5}
                      question="How relevant and useful were the generated interview questions?"
                      value={q5}
                      onChange={setQ5}
                    />
                    <StarQuestion
                      id={6}
                      question="How helpful was the AI Career Chatbot in answering your career-related questions?"
                      value={q6}
                      onChange={setQ6}
                    />
                    <StarQuestion
                      id={7}
                      question="Overall, how satisfied are you with HireAssist?"
                      value={q7}
                      onChange={setQ7}
                    />
                  </div>
                </div>

                {/* Section 2: Q8 & Q9 */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    Part 2: Recommendation & Future Intent
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Q8 */}
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 rounded-2xl">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                        Question 8
                      </p>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                        Would you recommend HireAssist to others? *
                      </h3>
                      <div className="space-y-2">
                        {["Yes", "No", "Maybe"].map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              recommendation === option
                                ? "bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 dark:border-brand-500 font-semibold text-brand-900 dark:text-brand-100"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name="recommendation"
                              value={option}
                              checked={recommendation === option}
                              onChange={(e) => setRecommendation(e.target.value)}
                              className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Q9 */}
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 rounded-2xl">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                        Question 9
                      </p>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                        How likely are you to use HireAssist for future job searches? *
                      </h3>
                      <div className="space-y-2">
                        {["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"].map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                              futureUsage === option
                                ? "bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 dark:border-brand-500 font-semibold text-brand-900 dark:text-brand-100"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name="futureUsage"
                              value={option}
                              checked={futureUsage === option}
                              onChange={(e) => setFutureUsage(e.target.value)}
                              className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-xs sm:text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Q10 */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    Part 3: Suggestions & Feedback
                  </h2>
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Additional Suggestions
                      </label>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">Optional</span>
                    </div>
                    <textarea
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      rows={4}
                      placeholder="Please share your suggestions, improvements, or issues you experienced while using HireAssist."
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {/* Error Box */}
                {error && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-brand-600 via-brand-700 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting Evaluation...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
