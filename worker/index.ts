/**
 * Aliasist Hub — Cloudflare Worker
 *
 * Serves the built Vite static site (via [assets] binding) and exposes
 * a small /api surface that pings each Sist app for live health.
 */

interface Env {
  ASSETS: Fetcher;
}

type Status = "live" | "beta" | "soon" | "unknown";

const TARGETS: Record<string, string> = {
  datasist: "https://datasist.aliasist.com",
  pulsesist: "https://pulse.aliasist.com",
  spacesist: "https://space.aliasist.com",
  ecosist: "https://ecosist.aliasist.com",
  abductor: "https://aliasist.tech",
  portfolio: "https://aliasist.com",
};

// Module-scope cache lives for the duration of an isolate (~minutes), keeps
// us well below upstream rate limits without needing KV.
let cache: { at: number; statuses: Record<string, Status> } | null = null;
const TTL_MS = 60_000;

async function probe(url: string): Promise<Status> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5_000);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      cf: { cacheTtl: 30, cacheEverything: true },
    });
    clearTimeout(timer);
    return res.ok ? "live" : "soon";
  } catch {
    return "unknown";
  }
}

async function getStatuses(): Promise<Record<string, Status>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.statuses;
  const entries = await Promise.all(
    Object.entries(TARGETS).map(async ([id, url]) => [id, await probe(url)] as const)
  );
  const statuses = Object.fromEntries(entries) as Record<string, Status>;
  cache = { at: Date.now(), statuses };
  return statuses;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/status") {
      const statuses = await getStatuses();
      return Response.json(
        { statuses, cachedFor: TTL_MS / 1000 },
        { headers: { "cache-control": "public, max-age=30" } }
      );
    }

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "aliasist-hub",
        time: new Date().toISOString(),
      });
    }

    // Everything else: serve the static SPA.
    return env.ASSETS.fetch(request);
  },
};
