import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell, ScoreRing, Badge } from "@/components/app-shell";
import { getCandidate, updateCandidate, deleteCandidate } from "@/lib/candidates.functions";

export const Route = createFileRoute("/candidates/$id")({
  head: () => ({
    meta: [
      { title: "Candidate Profile — TalentIntel" },
      {
        name: "description",
        content: "Verified AI talent profile with GitHub, hackathon, and resume signals.",
      },
    ],
  }),
  component: CandidateDetail,
});

function CandidateDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchOne = useServerFn(getCandidate);
  const updateFn = useServerFn(updateCandidate);
  const deleteFn = useServerFn(deleteCandidate);

  const { data, isLoading } = useQuery({
  queryKey: ["candidate", id],
  queryFn: async () => {
    console.log("Calling getCandidate with", id);

    const result = await fetchOne({
      data: { id },
    });

    console.log("Returned:", result);

    return result;
  },
});
  const c = data as any;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    github_username: "",
    summary: "",
  });

  useEffect(() => {
    if (c) {
      setForm({
        name: c.full_name ?? "",
        email: c.email ?? "",
        github_username: c.github_username ?? "",
        summary: c.summary ?? "",
      });
    }
  }, [c]);

  if (isLoading)
    return (
      <AppShell>
        <p className="text-muted-foreground">Loading…</p>
      </AppShell>
    );
  if (!c)
    return (
      <AppShell>
        <p>Not found.</p>
      </AppShell>
    );

  const gh = c.github_metrics || {};
  const flags = c.verification_flags || {};
  const bd = c.score_breakdown || {};
  const resume = c.resume_url;

  const save = async () => {
    setSaving(true);
    try {
      await updateFn({ data: { id, ...form } });
      await qc.invalidateQueries({ queryKey: ["candidate", id] });
      await qc.invalidateQueries({ queryKey: ["candidates"] });
      setEditing(false);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteFn({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["candidates"] });
      navigate({ to: "/candidates" });
    } catch (e) {
      alert((e as Error).message);
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <Link to="/candidates" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to candidates
        </Link>
        <div className="flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm px-3 py-1.5 border border-border rounded hover:bg-secondary"
            >
              Edit
            </button>
          )}
          <button
            onClick={remove}
            disabled={deleting}
            className="text-sm px-3 py-1.5 border border-destructive/40 text-destructive rounded hover:bg-destructive/10 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className="panel p-8 mt-4">
        <div className="flex items-start gap-6">
          <ScoreRing score={c.ai_talent_score} />
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <input
                  className="w-full bg-background border border-border rounded px-3 py-2 text-lg font-semibold"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                />
                <div className="grid sm:grid-cols-2 gap-2">
                  <input
                    className="bg-background border border-border rounded px-3 py-2 text-sm"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                  />
                  <input
                    className="bg-background border border-border rounded px-3 py-2 text-sm mono"
                    value={form.github_username}
                    onChange={(e) => setForm({ ...form, github_username: e.target.value })}
                    placeholder="github handle"
                  />
                </div>
                <textarea
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm min-h-[100px]"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Recruiter-facing summary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-border rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight">{c.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                  {c.email && <span>{c.email}</span>}
                  {c.github_username && (
                    <a
                      href={`https://github.com/${c.github_username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mono text-accent hover:underline"
                    >
                      @{c.github_username}
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {flags.github_verified && <Badge tone="success">GitHub verified</Badge>}
                  {flags.resume_provided && <Badge tone="success">Resume parsed</Badge>}
                  {flags.ai_generated_resume_flag && (
                    <Badge tone="warn">
                      AI-written resume ({flags.ai_generated_resume_likelihood}%)
                    </Badge>
                  )}
                  {flags.hackathons_provided && <Badge>Hackathon data</Badge>}
                </div>
                {c.summary && <p className="mt-4 text-foreground/90">{c.summary}</p>}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <ScoreCard label="Coding" value={bd.coding ?? 0} max={40} />
          <ScoreCard label="Innovation" value={bd.innovation ?? 0} max={30} />
          <ScoreCard label="Teamwork" value={bd.teamwork ?? 0} max={30} />
        </div>
        {bd.notes && (
          <ul className="mt-4 text-xs mono text-muted-foreground space-y-1">
            {bd.notes.map((n: string, i: number) => (
              <li key={i}>› {n}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Section title="GitHub signals">
          {gh?.error ? (
            <p className="text-muted-foreground text-sm">Could not fetch GitHub: {gh.error}</p>
          ) : gh?.totals ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Repos" value={gh.totals.repos_analyzed} />
                <Stat label="Stars" value={gh.totals.stars} />
                <Stat label="Followers" value={gh.profile?.followers ?? 0} />
              </div>
              <div>
                <div className="mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Languages
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(gh.totals.languages || {}).map(([l, n]) => (
                    <span key={l} className="mono text-xs px-2 py-1 bg-secondary rounded">
                      {l} · {n as any}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Top repos
                </div>
                <ul className="space-y-1.5">
                  {gh.totals.top_repos?.map((r: any) => (
                    <li key={r.name} className="text-sm flex items-center justify-between">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline truncate"
                      >
                        {r.name}
                      </a>
                      <span className="mono text-xs text-muted-foreground">
                        ★ {r.stars} · {r.language || "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No GitHub data.</p>
          )}
        </Section>

        <Section title="Resume">
  {c.resume_url ? (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          PDF
        </div>

        <div>
          <div className="font-medium">
            Resume PDF
          </div>

          <div className="text-xs text-muted-foreground">
            Uploaded resume
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={c.resume_url}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90"
        >
          View Resume
        </a>

        <a
          href={c.resume_url}
          download
          className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary"
        >
          Download PDF
        </a>
      </div>
    </div>
  ) : (
    <p className="text-muted-foreground text-sm">
      No resume provided.
    </p>
  )}
</Section>
      </div>

      {c.hackathon_data?.length > 0 && (
        <Section title="Hackathons" className="mt-4">
          <ul className="space-y-2">
            {c.hackathon_data.map((h: any, i: number) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0"
              >
                <div>
                  <div className="font-medium">{h.name}</div>
                  {h.project && <div className="text-muted-foreground text-xs">{h.project}</div>}
                </div>
                {h.rank && <Badge tone="success">Rank {h.rank}</Badge>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </AppShell>
  );
}

function ScoreCard({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="bg-muted/50 rounded-md p-3">
      <div className="mono text-[10px] uppercase text-muted-foreground tracking-widest">
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">
        {value}
        <span className="text-sm text-muted-foreground font-normal"> / {max}</span>
      </div>
      <div className="mt-2 h-1.5 bg-background rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/50 rounded-md p-3">
      <div className="text-xl font-bold mono">{value}</div>
      <div className="mono text-[10px] uppercase text-muted-foreground tracking-widest">
        {label}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel p-6 ${className}`}>
      <h2 className="text-sm mono uppercase tracking-widest text-muted-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}
