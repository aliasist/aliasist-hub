import { useEffect, useState } from "react";
import { PROJECTS, SUITE_STATS, type Project, type Status } from "./data";

type StatusMap = Record<string, Status>;

export function App() {
  const [statuses, setStatuses] = useState<StatusMap>(() =>
    Object.fromEntries(PROJECTS.map((p) => [p.id, "unknown"])) as StatusMap
  );
  const [now, setNow] = useState<string>(formatTime());

  useEffect(() => {
    const t = setInterval(() => setNow(formatTime()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { statuses: StatusMap }) => {
        if (!cancelled && data?.statuses) setStatuses((s) => ({ ...s, ...data.statuses }));
      })
      .catch(() => {
        // local dev / static fallback — leave defaults from PROJECTS
        if (!cancelled) {
          setStatuses(
            Object.fromEntries(PROJECTS.map((p) => [p.id, p.status])) as StatusMap
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <Header now={now} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <SuiteStats />
        <ProjectsGrid statuses={statuses} />
        <BuildLog />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function formatTime(): string {
  const d = new Date();
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }) + " UTC";
}

function Header({ now }: { now: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-teal/10 bg-bg/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <Glyph />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-ink group-hover:text-teal transition">
              ALIASIST
            </span>
            <span className="text-[10px] font-mono text-muted tracking-[0.2em]">
              // HUB
            </span>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#apps" className="hover:text-ink transition">Apps</a>
          <a href="#log" className="hover:text-ink transition">Build log</a>
          <a href="https://aliasist.com" className="hover:text-ink transition">Portfolio</a>
          <a
            href="https://github.com/aliasist"
            className="hover:text-ink transition"
            target="_blank" rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div className="font-mono text-[11px] text-muted hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal live-dot" />
          {now}
        </div>
      </div>
    </header>
  );
}

function Glyph() {
  return (
    <svg viewBox="0 0 64 64" className="w-7 h-7 float-slow" aria-hidden>
      <defs>
        <radialGradient id="hg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#0acb9b" />
          <stop offset="100%" stopColor="#06956e" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="38" rx="22" ry="6" fill="url(#hg)" opacity="0.85" />
      <ellipse cx="32" cy="30" rx="12" ry="9" fill="#13251e" stroke="#0acb9b" strokeWidth="1.5" />
      <circle cx="26" cy="30" r="1.6" fill="#0acb9b" />
      <circle cx="32" cy="30" r="1.6" fill="#0acb9b" />
      <circle cx="38" cy="30" r="1.6" fill="#0acb9b" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="pt-16 sm:pt-24 pb-12 relative">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal/5 blur-3xl rounded-full pointer-events-none" />
      <div className="relative">
        <div className="font-mono text-[11px] tracking-[0.3em] text-teal/80 mb-4">
          // PUBLIC APP HUB
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight">
          The <span className="shimmer-text">Aliasist</span> Suite,
          <br />
          one launchpad.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
          Intelligence-driven products with a security mindset — data systems,
          live dashboards, and tooling that turns messy signals into decisions.
          Pick an app and go.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#apps"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-teal text-bg font-medium hover:bg-teal/90 transition shadow-teal"
          >
            Explore the suite
            <span aria-hidden>→</span>
          </a>
          <a
            href="https://pulse.aliasist.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-teal/30 text-ink hover:border-teal/60 hover:bg-teal/5 transition"
          >
            Open Pulse
          </a>
          <a
            href="https://aliasist.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-muted hover:text-ink transition"
          >
            Read writing →
          </a>
        </div>
      </div>
    </section>
  );
}

function SuiteStats() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
      {SUITE_STATS.map((s) => (
        <div
          key={s.label}
          className="glass rounded p-4 transition relative overflow-hidden scanline"
        >
          <div className="font-mono text-[10px] tracking-widest text-muted uppercase">
            {s.label}
          </div>
          <div className="text-xl font-semibold text-ink mt-1">{s.value}</div>
        </div>
      ))}
    </section>
  );
}

function ProjectsGrid({ statuses }: { statuses: StatusMap }) {
  const flagship = PROJECTS.filter((p) => p.category === "Flagship");
  const liveApps = PROJECTS.filter((p) => p.category === "Live App");
  const tools = PROJECTS.filter((p) => p.category === "Tool" || p.category === "Brand");

  return (
    <section id="apps" className="pb-20 scroll-mt-20">
      <SectionHeader
        eyebrow="// THE SUITE"
        title="Apps & products"
        sub="Each card is a live surface. Click through to the app."
      />

      {flagship.length > 0 && (
        <>
          <div className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase mb-3 mt-4">
            Flagship
          </div>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {flagship.map((p) => (
              <FeatureCard key={p.id} p={p} status={statuses[p.id] ?? p.status} />
            ))}
          </div>
        </>
      )}

      <div className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase mb-3">
        Live apps
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {liveApps.map((p) => (
          <ProjectCard key={p.id} p={p} status={statuses[p.id] ?? p.status} />
        ))}
      </div>

      <div className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase mb-3">
        Tools & brand
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((p) => (
          <ProjectCard key={p.id} p={p} status={statuses[p.id] ?? p.status} />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-8">
      <div className="font-mono text-[11px] tracking-[0.3em] text-teal/80 mb-3">
        {eyebrow}
      </div>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-2 text-muted">{sub}</p>
      <div className="mt-4 h-px grid-line" />
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    live: { dot: "bg-teal", label: "LIVE", text: "text-teal" },
    beta: { dot: "bg-cyan", label: "BETA", text: "text-cyan" },
    soon: { dot: "bg-muted", label: "SOON", text: "text-muted" },
    unknown: { dot: "bg-muted/50", label: "....", text: "text-muted" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "live" ? "live-dot" : ""}`} />
      {cfg.label}
    </span>
  );
}

function FeatureCard({ p, status }: { p: Project; status: Status }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="glass rounded p-6 sm:p-8 relative overflow-hidden block group scanline"
    >
      <div
        aria-hidden
        className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-20 group-hover:opacity-40 blur-2xl transition"
        style={{ background: p.accent }}
      />
      <div className="relative grid sm:grid-cols-[auto_1fr_auto] gap-6 items-center">
        <div className="text-6xl font-mono leading-none" style={{ color: p.accent }}>
          {p.glyph}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
            <StatusBadge status={status} />
            <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
              · {p.category}
            </span>
          </div>
          <div className="font-mono text-xs text-teal mb-2">{p.tagline}</div>
          <p className="text-muted leading-relaxed">{p.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.highlights.map((h) => (
              <span
                key={h}
                className="text-[11px] font-mono text-muted px-2 py-0.5 rounded border border-teal/15 bg-teal/5"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <div className="font-mono text-[10px] text-muted">{hostname(p.url)}</div>
          <div className="text-teal text-2xl group-hover:translate-x-1 transition">→</div>
        </div>
      </div>
    </a>
  );
}

function ProjectCard({ p, status }: { p: Project; status: Status }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="glass rounded p-5 relative overflow-hidden block group scanline"
    >
      <div
        aria-hidden
        className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-15 group-hover:opacity-30 blur-2xl transition"
        style={{ background: p.accent }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl font-mono leading-none" style={{ color: p.accent }}>
            {p.glyph}
          </div>
          <StatusBadge status={status} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-ink">{p.name}</h3>
        <div className="font-mono text-xs text-teal mb-2">{p.tagline}</div>
        <p className="text-sm text-muted leading-relaxed line-clamp-3 min-h-[3.75rem]">
          {p.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-mono text-[10px] text-muted">{hostname(p.url)}</div>
          <div className="text-teal group-hover:translate-x-1 transition text-sm">
            open →
          </div>
        </div>
      </div>
    </a>
  );
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function BuildLog() {
  const items = [
    {
      date: "Apr 28, 2026",
      title: "Aliasist Hub launched",
      body: "Public launchpad consolidating Pulse, DataSist, SpaceSist, EcoSist, and Files Abductor into a single entry point.",
    },
    {
      date: "Apr 03, 2026",
      title: "PulseSist competition build",
      body: "Pitch builder shipped for the Perplexity Stock Pitch Competition with full DCF, sentiment, and earnings radar.",
    },
    {
      date: "Mar 2026",
      title: "DataSist signals layer",
      body: "Grid + utility risk signal layer added to the data center facility map.",
    },
  ];
  return (
    <section id="log" className="pb-20 scroll-mt-20">
      <SectionHeader
        eyebrow="// BUILD LOG"
        title="Recent shipments"
        sub="What rolled out across the suite, freshest first."
      />
      <div className="grid gap-3">
        {items.map((it) => (
          <article
            key={it.title}
            className="glass rounded p-5 grid sm:grid-cols-[140px_1fr] gap-3"
          >
            <div className="font-mono text-xs text-teal tracking-wider">{it.date}</div>
            <div>
              <h3 className="text-ink font-semibold">{it.title}</h3>
              <p className="text-muted text-sm mt-1">{it.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="pb-20">
      <div className="glass rounded p-8 sm:p-12 relative overflow-hidden scanline">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-teal/15 blur-3xl"
        />
        <div className="relative grid sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="font-mono text-[11px] tracking-[0.3em] text-teal/80 mb-3">
              // GET INVOLVED
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Want a tour, a pitch, or a build log?
            </h2>
            <p className="text-muted mt-2 max-w-2xl">
              Drop a note for product collaboration, deployments, or hub-related work.
              Everything here is built solo and shipping in the open.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:dev@aliasist.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-teal text-bg font-medium hover:bg-teal/90 transition shadow-teal"
            >
              dev@aliasist.com
            </a>
            <a
              href="https://github.com/aliasist"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-teal/30 hover:border-teal/60 hover:bg-teal/5 transition"
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-teal/10 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Glyph />
            <span className="font-semibold tracking-wide">ALIASIST HUB</span>
          </div>
          <p className="text-muted text-xs leading-relaxed">
            Public launchpad for the Aliasist Suite. Built on Cloudflare Workers, deployed worldwide, edge-first.
          </p>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-3">
            Suite
          </div>
          <ul className="space-y-2 text-muted">
            {PROJECTS.slice(0, 4).map((p) => (
              <li key={p.id}>
                <a href={p.url} className="hover:text-ink transition">
                  {p.name} <span className="text-teal/50">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-3">
            Channels
          </div>
          <ul className="space-y-2 text-muted">
            <li><a href="https://aliasist.com" className="hover:text-ink transition">Portfolio · aliasist.com</a></li>
            <li><a href="https://github.com/aliasist" className="hover:text-ink transition">GitHub · @aliasist</a></li>
            <li><a href="mailto:dev@aliasist.com" className="hover:text-ink transition">dev@aliasist.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-teal/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between font-mono text-[10px] text-muted">
          <span>© {new Date().getFullYear()} ALIASIST</span>
          <span>EDGE / CLOUDFLARE / OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}
