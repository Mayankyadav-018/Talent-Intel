import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AppShell, ScoreRing, Badge } from "@/components/app-shell";
import { listCandidates } from "@/lib/candidates.functions";

export const Route = createFileRoute("/candidates/")({
  head: () => ({
    meta: [
      { title: "Candidates — TalentIntel" },
      { name: "description", content: "Ranked list of verified AI talent profiles." },
    ],
  }),
  component: CandidatesPage,
});

function CandidatesPage() {
  const fetchList = useServerFn(listCandidates);
  const { data, isLoading, error } = useQuery({
  queryKey: ["candidates"],
  queryFn: async () => {
    const result = await fetchList();

    console.log("===== CANDIDATES FROM BACKEND =====");
    console.log(result);
    console.log("===================================");

    return result;
  },
});
  return (
    <AppShell>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="mono text-xs text-accent uppercase tracking-widest">Profiles</div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Ranked candidates</h1>
        </div>
        <Link to="/ingest" className="text-sm text-accent hover:underline">
          + Ingest new
        </Link>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-destructive">{(error as Error).message}</p>}
      {data && data.length === 0 && (
        <div className="panel p-12 text-center">
          <p className="text-muted-foreground">No candidates yet.</p>
          <Link
            to="/ingest"
            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Ingest your first candidate
          </Link>
        </div>
      )}
      <div className="grid gap-3">
  {data?.map((c: any) => {
    console.log("CANDIDATE:", c.full_name, {
      score: c.ai_talent_score,
      breakdown: c.score_breakdown,
    });

    return (
      <Link
        key={c.id}
        to="/candidates/$id"
        params={{ id: c.id }}
        className="panel p-5 flex items-center gap-5 hover:border-primary/60 transition"
      >
        <ScoreRing score={c.ai_talent_score ?? 0} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-lg">
              {c.full_name}
            </div>

            {c.github_username && (
              <span className="mono text-xs text-muted-foreground">
                @{c.github_username}
              </span>
            )}

            {c.verification_flags?.github_verified && (
              <Badge tone="success">GitHub verified</Badge>
            )}

            {c.verification_flags?.ai_generated_resume_flag && (
              <Badge tone="warn">
                Possible AI-written resume
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {c.summary || "No summary yet."}
          </p>

          <div className="flex gap-3 mt-2 mono text-[11px] text-muted-foreground uppercase">
            <span>
              Code {c.score_breakdown?.coding ?? 0}
            </span>
            <span>
              Innov {c.score_breakdown?.innovation ?? 0}
            </span>
            <span>
              Team {c.score_breakdown?.teamwork ?? 0}
            </span>
          </div>
        </div>
      </Link>
    );
  })}
</div>
    </AppShell>
  );
}
