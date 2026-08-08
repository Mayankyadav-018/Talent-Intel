import type { GitHubMetrics } from "./github.server";

export interface ScoreBreakdown {
  coding: number;
  innovation: number;
  teamwork: number;
  total: number;
  notes: string[];
}

export interface HackathonEntry {
  name: string;
  rank?: string | number;
  project?: string;
  year?: string | number;
}

// Composite 0-100 talent score.
export function computeTalentScore(
  resume: any,
  gh: GitHubMetrics | null,
  hackathons: HackathonEntry[],
): ScoreBreakdown {
  const notes: string[] = [];
  // Coding (0-40): repo count, stars, language diversity, activity
  let coding = 0;
  if (gh && !gh.error) {
    const repos = gh.totals.repos_analyzed;
    const stars = gh.totals.stars;
    const langs = Object.keys(gh.totals.languages).length;
    coding += Math.min(15, repos * 1.5);
    coding += Math.min(15, Math.log2(stars + 1) * 3);
    coding += Math.min(10, langs * 2);
    notes.push(`GitHub: ${repos} repos, ${stars} stars, ${langs} languages.`);
  } else {
    notes.push("No verified GitHub data.");
  }

  // Innovation (0-30): hackathon count, top ranks
  let innovation = 0;
  if (hackathons?.length) {
    innovation += Math.min(15, hackathons.length * 5);
    const wins = hackathons.filter((h) => {
      const r = String(h.rank || "").toLowerCase();
      return r.includes("1") || r.includes("win") || r.includes("gold");
    }).length;
    innovation += Math.min(15, wins * 8);
    notes.push(`${hackathons.length} hackathons, ${wins} top finishes.`);
  }
  // Bonus from resume projects/skills length
  const projects = Array.isArray(resume?.projects) ? resume.projects.length : 0;
  innovation += Math.min(5, projects);

  // Teamwork (0-30): followers, forks (OSS contribution proxy), experience count
  let teamwork = 0;
  if (gh && !gh.error) {
    teamwork += Math.min(10, Math.log2(gh.profile.followers + 1) * 2.5);
    teamwork += Math.min(10, Math.log2(gh.totals.forks + 1) * 2.5);
  }
  const exp = Array.isArray(resume?.experience) ? resume.experience.length : 0;
  teamwork += Math.min(10, exp * 2.5);

  coding = Math.round(Math.min(40, coding));
  innovation = Math.round(Math.min(30, innovation));
  teamwork = Math.round(Math.min(30, teamwork));
  const total = coding + innovation + teamwork;
  return { coding, innovation, teamwork, total, notes };
}
