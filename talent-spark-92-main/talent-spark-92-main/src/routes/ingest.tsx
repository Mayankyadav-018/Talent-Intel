import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/ingest")({
  head: () => ({
    meta: [
      { title: "Ingest Candidate — TalentIntel" },
      {
        name: "description",
        content:
          "Upload a resume, add GitHub and hackathon data to generate a verified AI talent profile.",
      },
    ],
  }),
  component: IngestPage,
});

interface Hack {
  name: string;
  rank: string;
  project: string;
  year: string;
}

function IngestPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [hacks, setHacks] = useState<Hack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | null) {
    if (!file) {
      setPdf(null);
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("PDF must be under 8MB.");
      return;
    }

    setPdf(file);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!pdf) {
      setError("Please upload a resume.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("resume", pdf);

      formData.append("full_name", name);

      formData.append("email", email);

      formData.append("github_username", github);

      const response = await fetch("http://127.0.0.1:8787/api/v1/upload-resume", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      const candidateId = result.data.candidate.id;
      console.log("Candidate ID:", candidateId);

      alert("Candidate uploaded successfully!");
      console.log("Navigating...");

      console.log("Candidate ID:", candidateId);

      window.location.href = `/candidates/${candidateId}`;

      console.log(result);

      alert("Candidate uploaded successfully!");

      navigate({
        to: "/candidates/$id",
        params: {
          id: candidateId,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mono text-xs text-accent uppercase tracking-widest">Ingestion</div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Add a candidate</h1>
        <p className="text-muted-foreground mt-2">
          Resume PDF is parsed by AI. GitHub metrics are fetched live. Everything is scored and
          embedded for semantic search.
        </p>

        <form onSubmit={submit} className="panel p-6 mt-6 space-y-4">
          <Field label="Full name *">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              className="input"
              placeholder="Ada Lovelace"
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="input"
                placeholder="ada@example.com"
              />
            </Field>
            <Field label="GitHub username">
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                maxLength={60}
                className="input"
                placeholder="torvalds"
              />
            </Field>
          </div>
          <Field label="Resume PDF">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
              className="block w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-secondary file:text-secondary-foreground file:mono file:text-xs hover:file:bg-secondary/80"
            />
            {pdf && <div className="mono text-xs text-muted-foreground mt-1">✓ {pdf.name}</div>}
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="mono text-xs uppercase tracking-widest text-muted-foreground">
                Hackathons (optional)
              </label>
              <button
                type="button"
                onClick={() => setHacks([...hacks, { name: "", rank: "", project: "", year: "" }])}
                className="text-xs text-accent hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {hacks.map((h, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <input
                    placeholder="Hackathon name"
                    value={h.name}
                    onChange={(e) => {
                      const c = [...hacks];
                      c[i].name = e.target.value;
                      setHacks(c);
                    }}
                    className="input col-span-5"
                  />
                  <input
                    placeholder="Rank"
                    value={h.rank}
                    onChange={(e) => {
                      const c = [...hacks];
                      c[i].rank = e.target.value;
                      setHacks(c);
                    }}
                    className="input col-span-2"
                  />
                  <input
                    placeholder="Project"
                    value={h.project}
                    onChange={(e) => {
                      const c = [...hacks];
                      c[i].project = e.target.value;
                      setHacks(c);
                    }}
                    className="input col-span-4"
                  />
                  <button
                    type="button"
                    onClick={() => setHacks(hacks.filter((_, j) => j !== i))}
                    className="col-span-1 text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Analyzing candidate…" : "Generate verified profile"}
          </button>
        </form>
      </div>
      <style>{`
        .input {
          width: 100%;
          background: var(--color-input);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
        }
        .input:focus { outline: 2px solid var(--color-ring); outline-offset: 1px; }
      `}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </div>
      {children}
    </label>
  );
}
