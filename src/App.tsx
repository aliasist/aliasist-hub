import { useEffect, useState } from "react";
import { PROJECTS, SUITE_STATS, ACCENT_HEX, type Project, type Status } from "./data";

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
        if (!cancelled) {
          setStatuses(Object.fromEntries(PROJECTS.map((p) => [p.id, p.status])) as StatusMap);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <Header now={now} />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Hero />
        <SuiteStats statuses={statuses} />
        <ProjectsSection statuses={statuses} />
        <BuildLog />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function formatTime(): string {
  const d = new Date();
  return (
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC"
  );
}

/* ─── HEADER ─────────────────────────────────────────────────── */

function Header({ now }: { now: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <Glyph />
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold text-ink leading-none">
              Aliasist
            </span>
            <span className="font-display text-xl font-bold leading-none" style={{ color: "#c5a352" }}>
              Hub
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <a
            href="https://aliasist.com"
            target="_blank" rel="noreferrer"
            className="chip hover:border-borderBright hover:text-ink transition"
          >
            <span style={{ color: "#c5a352" }}>←</span> ALIASIST.COM
          </a>
        </nav>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-green">
            <span className="w-1.5 h-1.5 rounded-full bg-green live-dot" />
            LIVE
          </span>
          <span className="text-muted hidden sm:inline">{now}</span>
        </div>
      </div>
    </header>
  );
}

function Glyph() {
  return (
    <svg viewBox="0 0 80 80" className="w-9 h-9 float-slow" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="#c5a352" strokeWidth="1" opacity="0.3" />
      <circle cx="40" cy="40" r="24" stroke="#4a8fd4" strokeWidth="1" opacity="0.4" />
      <ellipse cx="40" cy="40" rx="38" ry="11" stroke="#f0934a" strokeWidth="1.2" opacity="0.5" transform="rotate(-25 40 40)" />
      <circle cx="40" cy="40" r="7" fill="#c5a352" opacity="0.95" />
      <circle cx="40" cy="40" r="3" fill="#fff" opacity="0.85" />
      <circle cx="64" cy="22" r="2.2" fill="#4a8fd4" opacity="0.9" className="twinkle" />
      <circle cx="17" cy="60" r="1.8" fill="#f0934a" opacity="0.9" className="twinkle" />
      <circle cx="68" cy="58" r="1.5" fill="#fff" opacity="0.7" className="twinkle" />
    </svg>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="pt-20 sm:pt-28 pb-14 relative">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(197,163,82,0.08), transparent 70%)" }} />
      <div className="relative">
        <div className="eyebrow mb-5">// Public App Hub</div>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight">
          The Aliasist Suite,
          <br />
          <span style={{ color: "#c5a352", fontStyle: "italic" }}>one launchpad.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
          Intelligence-driven products with a security mindset — data systems,
          live dashboards, and tooling that turns messy signals into decisions.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#apps" className="btn-primary">
            Explore the suite <span aria-hidden>→</span>
          </a>
          <a href="https://pulse.aliasist.com" target="_blank" rel="noreferrer" className="btn-ghost">
            Open Pulse
          </a>
          <a href="https://aliasist.com" target="_blank" rel="noreferrer" className="btn-ghost">
            Read writing
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS STRIP ────────────────────────────────────────────── */

function SuiteStats({ statuses }: { statuses: StatusMap }) {
  const liveCount = Object.values(statuses).filter((s) => s === "live").length || 4;
  const stats = [
    { label: "Live apps", value: String(liveCount) },
    ...SUITE_STATS.slice(1),
  ];
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20">
      {stats.map((s, i) => (
        <div key={s.label} className="card-base px-5 py-4 relative overflow-hidden">
          <div className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase mb-1.5">
            {s.label}
          </div>
          <div className="font-display text-2xl font-bold text-ink">{s.value}</div>
          {i === 0 && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-green live-dot" />
          )}
        </div>
      ))}
    </section>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────── */

function ProjectsSection({ statuses }: { statuses: StatusMap }) {
  const flagship = PROJECTS.filter((p) => p.category === "Flagship");
  const liveApps = PROJECTS.filter((p) => p.category === "Live App");
  const tools = PROJECTS.filter((p) => p.category === "Tool" || p.category === "Brand");

  return (
    <section id="apps" className="pb-24 scroll-mt-20">
      <SectionHeader
        eyebrow="// The Suite"
        title="Apps & products"
        sub="Each card is a live surface — click through to the app."
      />

      {flagship.length > 0 && (
        <>
          <CategoryLabel n="01" label="Flagship" />
          <div className="grid grid-cols-1 gap-4 mb-10">
            {flagship.map((p) => (
              <FlagshipCard key={p.id} p={p} status={statuses[p.id] ?? p.status} />
            ))}
          </div>
        </>
      )}

      <CategoryLabel n="02" label="Live applications" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {liveApps.map((p) => (
          <ProjectCard key={p.id} p={p} status={statuses[p.id] ?? p.status} />
        ))}
      </div>

      <CategoryLabel n="03" label="Tools & brand" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((p) => (
          <ProjectCard key={p.id} p={p} status={statuses[p.id] ?? p.status} />
        ))}
      </div>
    </section>
  );
}

function CategoryLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-[11px] text-accent">{n}</span>
      <span className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
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
    <div className="mb-10">
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-2 text-muted text-lg">{sub}</p>
      <div className="section-divider mt-6" />
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    live: { dot: "bg-green", label: "LIVE", text: "text-green" },
    beta: { dot: "bg-blue", label: "BETA", text: "text-blue" },
    soon: { dot: "bg-orange", label: "SOON", text: "text-orange" },
    unknown: { dot: "bg-muted", label: "····", text: "text-muted" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "live" ? "live-dot" : ""}`} />
      {cfg.label}
    </span>
  );
}

function FlagshipCard({ p, status }: { p: Project; status: Status }) {
  const hex = ACCENT_HEX[p.accent];
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="card-base card-link p-7 sm:p-9 relative overflow-hidden block group"
      style={{ borderLeft: `3px solid ${hex}` }}
    >
      <div
        aria-hidden
        className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-15 group-hover:opacity-25 blur-3xl transition"
        style={{ background: hex }}
      />
      <div className="relative grid sm:grid-cols-[auto_1fr_auto] gap-6 items-center">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center font-mono text-3xl border"
          style={{
            color: hex,
            borderColor: `${hex}40`,
            background: `${hex}0d`,
          }}
        >
          {p.glyph}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-display text-3xl font-bold tracking-tight">{p.name}</h3>
            <StatusBadge status={status} />
            <span className="chip">{p.category}</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: hex }}>
            {p.tagline}
          </div>
          <p className="text-muted leading-relaxed text-[15px]">{p.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.highlights.map((h) => (
              <span key={h} className="chip">
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-3">
          <div className="font-mono text-[10px] text-muted">{hostname(p.url)}</div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl group-hover:translate-x-1 transition"
            style={{ background: `${hex}1a`, color: hex }}
          >
            →
          </div>
        </div>
      </div>
    </a>
  );
}

function ProjectCard({ p, status }: { p: Project; status: Status }) {
  const hex = ACCENT_HEX[p.accent];
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="card-base card-link p-6 relative overflow-hidden block group"
      style={{ borderLeft: `3px solid ${hex}` }}
    >
      <div
        aria-hidden
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10 group-hover:opacity-20 blur-3xl transition"
        style={{ background: hex }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-md flex items-center justify-center font-mono text-2xl border"
            style={{
              color: hex,
              borderColor: `${hex}40`,
              background: `${hex}0d`,
            }}
          >
            {p.glyph}
          </div>
          <StatusBadge status={status} />
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
          {p.name}
        </h3>
        <div className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3 mt-1" style={{ color: hex }}>
          {p.tagline}
        </div>
        <p className="text-sm text-muted leading-relaxed line-clamp-3 min-h-[3.75rem]">
          {p.description}
        </p>
        <div className="section-divider my-4 opacity-50" />
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] text-muted">{hostname(p.url)}</div>
          <div
            className="font-mono text-[11px] tracking-[0.15em] flex items-center gap-1.5 group-hover:translate-x-0.5 transition"
            style={{ color: hex }}
          >
            OPEN <span>→</span>
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

/* ─── BUILD LOG ──────────────────────────────────────────────── */

function BuildLog() {
  const items = [
    {
      date: "Apr 28, 2026",
      tag: "LAUNCH",
      tagColor: "#c5a352",
      title: "Aliasist Hub launched",
      body: "Public launchpad consolidating Pulse, DataSist, SpaceSist, EcoSist, and Files Abductor into a single entry point.",
    },
    {
      date: "Apr 03, 2026",
      tag: "PULSESIST",
      tagColor: "#4ec994",
      title: "Pitch builder shipped",
      body: "Pitch builder delivered for the Perplexity Stock Pitch Competition with full DCF, sentiment gauge, and earnings radar.",
    },
    {
      date: "Mar 2026",
      tag: "DATASIST",
      tagColor: "#c5a352",
      title: "Signals layer added",
      body: "Grid + utility risk signal layer added to the data center facility map.",
    },
  ];
  return (
    <section id="log" className="pb-24 scroll-mt-20">
      <SectionHeader
        eyebrow="// Build Log"
        title="Recent shipments"
        sub="What rolled out across the suite, freshest first."
      />
      <div className="grid gap-3">
        {items.map((it) => (
          <article
            key={it.title}
            className="card-base p-6 grid sm:grid-cols-[180px_120px_1fr] gap-4 items-start"
          >
            <div className="font-mono text-xs text-muted tracking-wider">{it.date}</div>
            <div>
              <span
                className="font-mono text-[10px] tracking-[0.15em] px-2.5 py-1 rounded-md border"
                style={{
                  color: it.tagColor,
                  borderColor: `${it.tagColor}40`,
                  background: `${it.tagColor}10`,
                }}
              >
                {it.tag}
              </span>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink mb-1">{it.title}</h3>
              <p className="text-muted text-[15px] leading-relaxed">{it.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */

function CTA() {
  return (
    <section className="pb-20">
      <div className="card-base p-9 sm:p-14 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
          style={{ background: "#c5a352" }}
        />
        <div
          aria-hidden
          className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "#4a8fd4" }}
        />
        <div className="relative grid sm:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="eyebrow mb-3">// Get Involved</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Want a tour, a pitch, or a build log?
            </h2>
            <p className="text-muted mt-3 max-w-2xl text-lg leading-relaxed">
              Drop a note for product collaboration, deployments, or hub-related work.
              Everything here is built solo and shipping in the open.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:dev@aliasist.com" className="btn-primary">
              dev@aliasist.com
            </a>
            <a href="https://github.com/aliasist" target="_blank" rel="noreferrer" className="btn-ghost">
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-12 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Glyph />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-bold">Aliasist</span>
              <span className="font-display text-lg font-bold" style={{ color: "#c5a352" }}>Hub</span>
            </div>
          </div>
          <p className="text-muted text-[13px] leading-relaxed">
            Public launchpad for the Aliasist Suite. Built on Cloudflare Workers, deployed worldwide, edge-first.
          </p>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-4">
            Suite
          </div>
          <ul className="space-y-2.5 text-muted">
            {PROJECTS.slice(0, 4).map((p) => (
              <li key={p.id}>
                <a href={p.url} className="hover:text-ink transition inline-flex items-center gap-2">
                  <span style={{ color: ACCENT_HEX[p.accent] }}>{p.glyph}</span>
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-4">
            Channels
          </div>
          <ul className="space-y-2.5 text-muted">
            <li><a href="https://aliasist.com" className="hover:text-ink transition">Portfolio · aliasist.com</a></li>
            <li><a href="https://github.com/aliasist" className="hover:text-ink transition">GitHub · @aliasist</a></li>
            <li><a href="mailto:dev@aliasist.com" className="hover:text-ink transition">dev@aliasist.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-4 flex items-center justify-between font-mono text-[10px] text-muted">
          <span>© {new Date().getFullYear()} ALIASIST</span>
          <span className="hidden sm:inline">EDGE · CLOUDFLARE · OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}
