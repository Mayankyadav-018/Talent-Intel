import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentIntel — Verified AI Talent Profiles" },
      {
        name: "description",
        content:
          "Cloud-native AI talent intelligence: parse resumes, ingest GitHub signals, score candidates, and search with an AI copilot.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AppShell>
      <section className="pt-8 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 mono text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-chart-3 animate-pulse" />
          MVP · Live Demo
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
          Verified{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI talent intelligence
          </span>{" "}
          for modern recruiters
        </h1>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
          Ingest a resume + GitHub, generate a verified candidate profile with an AI Talent Score™,
          and let recruiters search in natural language.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/ingest"
            className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Ingest a candidate
          </Link>
          <Link
            to="/recruiter"
            className="px-5 py-3 rounded-md border border-border hover:bg-secondary transition"
          >
            Try recruiter copilot
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          {
            step: "01",
            title: "Data Ingestion",
            body: "Upload a resume PDF, add a GitHub handle, and optionally paste hackathon results.",
          },
          {
            step: "02",
            title: "Talent Engine",
            body: "AI extracts skills, GitHub API fetches signals, embeddings summarize the candidate.",
          },
          {
            step: "03",
            title: "Recruiter Copilot",
            body: "Natural language search over verified profiles. Ranked by AI Talent Score.",
          },
        ].map((s) => (
          <div key={s.step} className="panel p-6">
            <div className="mono text-xs text-accent">{s.step}</div>
            <div className="mt-2 font-semibold text-lg">{s.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 panel p-8">
        <h2 className="text-2xl font-semibold">Demo flow</h2>
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>
            Go to <span className="text-foreground">Ingest</span> and add a candidate (resume PDF +
            GitHub username).
          </li>
          <li>The system parses, verifies, scores, and embeds the profile.</li>
          <li>
            Open <span className="text-foreground">Candidates</span> to see ranked profiles.
          </li>
          <li>
            Head to <span className="text-foreground">Recruiter Copilot</span> and ask questions in
            plain English.
          </li>
        </ol>
      </section>
    </AppShell>
  );
}
