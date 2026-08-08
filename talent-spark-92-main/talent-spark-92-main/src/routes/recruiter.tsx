import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell, ScoreRing, Badge } from "@/components/app-shell";
import { searchCandidates } from "@/lib/search.functions";

export const Route = createFileRoute("/recruiter")({
  head: () => ({
    meta: [
      { title: "Recruiter Copilot — TalentIntel" },
      {
        name: "description",
        content:
          "Search verified AI talent profiles with natural language. Ranked by Talent Score.",
      },
    ],
  }),
  component: RecruiterPage,
});

const EXAMPLES = [
  "Find top ML devs from hackathons",
  "Backend engineers with strong Rust and open source contribution",
  "React frontend candidates with design sense",
  "Junior devs with active GitHub in the last year",
];

function RecruiterPage() {
  const runSearch = useServerFn(searchCandidates);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await runSearch({ data: { query: query.trim(), limit: 8 } });
      setResult(r);
    } catch (err: any) {
      setError(err?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mono text-xs text-accent uppercase tracking-widest">Copilot</div>
      <h1 className="text-3xl font-bold tracking-tight mt-1">Recruiter AI copilot</h1>
      <p className="text-muted-foreground mt-2">
        Ask in natural language. We embed your query and rank verified candidates by semantic match
        + AI Talent Score.
      </p>

      <form onSubmit={submit} className="panel p-4 mt-6">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={500}
            placeholder="e.g. Find senior full-stack engineers with hackathon wins"
            className="flex-1 bg-input border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition mono text-sm uppercase tracking-widest"
          >
            {loading ? "…" : "Search"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAMPLES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setQuery(e)}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 transition"
            >
              {e}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {result.answer && (
            <div className="panel p-5 border-l-4 border-l-accent">
              <div className="mono text-[10px] uppercase tracking-widest text-accent">Copilot</div>
              <p className="text-sm mt-1">{result.answer}</p>
            </div>
          )}
          {result.results.length === 0 && (
            <div className="panel p-8 text-center text-muted-foreground">
              No candidates match. Try ingesting some first.
            </div>
          )}
          <div className="grid gap-3">
            {result.results.map((c: any) => (
              <Link
                key={c.id}
                to="/candidates/$id"
                params={{ id: c.id }}
                className="panel p-5 flex items-center gap-5 hover:border-primary/60 transition"
              >
                <ScoreRing score={c.ai_talent_score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold">{c.full_name}</div>
                    {c.github_username && (
                      <span className="mono text-xs text-muted-foreground">
                        @{c.github_username}
                      </span>
                    )}
                    {c.verification_flags?.github_verified && (
                      <Badge tone="success">Verified</Badge>
                    )}
                    <span className="mono text-[10px] text-muted-foreground ml-auto">
                      match {(c.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {c.summary || "—"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
