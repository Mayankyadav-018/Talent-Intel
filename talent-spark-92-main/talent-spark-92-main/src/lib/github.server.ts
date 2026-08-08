// Fetch public GitHub metrics for a user (unauthenticated; 60 req/hr per IP).
export interface GitHubMetrics {
  username: string;
  profile: {
    name?: string | null;
    bio?: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    avatar_url?: string;
  };
  totals: {
    stars: number;
    forks: number;
    repos_analyzed: number;
    languages: Record<string, number>;
    top_repos: Array<{
      name: string;
      description: string | null;
      stars: number;
      forks: number;
      language: string | null;
      url: string;
      updated_at: string;
    }>;
  };
  error?: string;
}

export async function fetchGithubMetrics(username: string): Promise<GitHubMetrics> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lovable-talent-intel",
  };
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      return {
        username,
        profile: { public_repos: 0, followers: 0, following: 0, created_at: "" },
        totals: { stars: 0, forks: 0, repos_analyzed: 0, languages: {}, top_repos: [] },
        error: `GitHub returned ${userRes.status}`,
      };
    }
    const user = await userRes.json();
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers },
    );
    const repos: any[] = reposRes.ok ? await reposRes.json() : [];
    let stars = 0;
    let forks = 0;
    const languages: Record<string, number> = {};
    for (const r of repos) {
      stars += r.stargazers_count || 0;
      forks += r.forks_count || 0;
      if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
    }
    const top_repos = [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language,
        url: r.html_url,
        updated_at: r.updated_at,
      }));
    return {
      username,
      profile: {
        name: user.name,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at,
        avatar_url: user.avatar_url,
      },
      totals: {
        stars,
        forks,
        repos_analyzed: repos.length,
        languages,
        top_repos,
      },
    };
  } catch (e: any) {
    return {
      username,
      profile: { public_repos: 0, followers: 0, following: 0, created_at: "" },
      totals: { stars: 0, forks: 0, repos_analyzed: 0, languages: {}, top_repos: [] },
      error: e?.message || "fetch failed",
    };
  }
}
