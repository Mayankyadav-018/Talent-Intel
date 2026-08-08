export interface Candidate {
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  github_username?: string;
  resume_url?: string;
  ppt_url?: string;

  summary?: string;

  ai_talent_score?: number;
  score_breakdown?: {
    coding: number;
    innovation: number;
    teamwork: number;
  };
}