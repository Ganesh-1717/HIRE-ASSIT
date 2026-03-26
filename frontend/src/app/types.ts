export interface AnalysisResult {
  technical_skills: string[];
  soft_skills: string[];
  languages: string[];
  frameworks: string[];
  experience_years: string;
  recommended_roles: string[];
  missing_skills: string[];
}

export interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  url: string;
  searchRole: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  label: string;
}

export interface InterviewQuestion {
  question: string;
  hint: string;
}

export interface CareerInsights {
  role_description: string;
  salary: {
    candidate_estimate?: { min: number; max: number; rationale: string; };
    entry: SalaryRange;
    mid: SalaryRange;
    senior: SalaryRange;
  };
  interview_questions: {
    technical: InterviewQuestion[];
    behavioral: InterviewQuestion[];
  };
  top_companies: string[];
}
