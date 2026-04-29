# Aliasist Hub

Public app hub for the **Aliasist Suite** — the launchpad to PulseSist, DataSist, SpaceSist, EcoSist, and the Files Abductor tool.

**Live:** [hub.aliasist.com](https://hub.aliasist.com)

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3
- Cloudflare Worker (static assets + `/api/status` health probes)
- Deployed on Cloudflare with custom domain

## Local dev

```bash
npm install
npm run dev          # vite dev on :5173
```

## Deploy

```bash
npm run deploy       # builds and runs `wrangler deploy`
```

The Worker:
- Serves the Vite-built SPA from `./dist` via the `ASSETS` binding.
- Exposes `GET /api/status` — probes each Sist app, returns `{ statuses }`.
- Exposes `GET /api/health` — service liveness.

Status probes are cached in-isolate for 60 s.

## Adding a project

Edit `src/data.ts`. Each entry takes `id`, `name`, `tagline`, `description`,
`url`, `status`, `category`, `accent`, `glyph`, and `highlights`.

To enable live status pinging, also add the URL to the `TARGETS` map in
`worker/index.ts` using the same `id`.

## Structure

```
aliasist-hub/
├── src/
│   ├── App.tsx          # Hub UI: hero, suite stats, project grid, build log, CTA
│   ├── data.ts          # Project catalog (single source of truth)
│   ├── main.tsx
│   └── index.css        # Theme tokens + dot-grid + animations
├── worker/
│   └── index.ts         # CF Worker: static assets + status probes
├── public/
│   └── favicon.svg      # Aliasist UFO icon
├── index.html
├── tailwind.config.js   # Aliasist Pulse theme tokens
├── vite.config.ts
├── wrangler.jsonc       # Custom domain: hub.aliasist.com
└── package.json
```
