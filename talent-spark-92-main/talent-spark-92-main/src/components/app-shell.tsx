import { Link, Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 backdrop-blur-md bg-background/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center mono text-background font-bold">
              T
            </div>
            <div>
              <div className="font-semibold tracking-tight">TalentIntel</div>
              <div className="text-[10px] mono text-muted-foreground -mt-0.5">
                AI TALENT INTELLIGENCE
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/ingest">Ingest</NavLink>
            <NavLink to="/candidates">Candidates</NavLink>
            {/*<NavLink to="/recruiter">Recruiter Copilot</NavLink>*/}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children ?? <Outlet />}</main>
      <footer className="border-t border-border/60 mt-16 py-6 text-center text-xs mono text-muted-foreground">
        TALENTINTEL / MVP DEMO
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors [&.active]:text-foreground [&.active]:bg-secondary"
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 75 ? "var(--color-chart-3)" : pct >= 50 ? "var(--color-accent)" : "var(--color-chart-4)";
  return (
    <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center mono font-bold text-xl"
      style={{
        background: `conic-gradient(${color} ${pct * 3.6}deg, var(--color-muted) 0deg)`,
      }}
    >
      <div className="absolute inset-1.5 rounded-full bg-card flex items-center justify-center">
        <span>{Math.round(pct)}</span>
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-secondary text-secondary-foreground",
    success: "bg-chart-3/20 text-chart-3",
    warn: "bg-chart-4/20 text-chart-4",
    danger: "bg-destructive/20 text-destructive",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] mono uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
