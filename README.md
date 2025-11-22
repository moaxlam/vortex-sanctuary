# AgriSure – Production‑ready Insurance Platform

AgriSure is a modern, type‑safe web app that delivers agriculture‑focused insurance with real‑time weather analytics and an AI assistant. It’s built on React 18 + Vite with an Express 5 backend and is ready to deploy to Netlify or Vercel.

## Tech Stack

- React 18 (SPA) + React Router 6
- TypeScript end‑to‑end
- TailwindCSS 3 + Radix UI primitives
- Vite 7 (dev/build)
- Express 5 (single server for API in dev, serverless adapters for prod)
- TanStack Query, Recharts
- Vitest for tests

## App Features

- Responsive layout with global header/footer and mobile nav
- Home with hero, partners, products, how‑it‑works, impact, CTA, and a compact local weather widget
- Weather page: geolocation fallback (New Delhi), search (Open‑Meteo geocoding), current/hourly/daily forecasts, sunrise/sunset, 6‑month climatology, charts (Recharts), loading and error states
- Assistant page: local chat with history, Gemini API via POST /api/chat/gemini, model fallback, Speech‑to‑Text input, Text‑to‑Speech playback
- Floating chat widget with scripted replies (local persistence)
- Products, Solutions, Partners (lead form with local storage), Resources (searchable articles), Quote (interactive calculator using weather‑aware risk factor)

## Monorepo Structure

```
client/                     # React SPA
  components/               # Reusable UI (shadcn-style) and app components
  pages/                    # Route components (Index, Weather, Assistant, ...)
  lib/                      # Utilities (cn, currency formatter)
server/                     # Express API (used in dev and serverless in prod)
  routes/                   # Route handlers (weather, climate, chat, demo)
shared/                     # Types shared by client/server
netlify/functions/api.ts    # Netlify serverless entry wrapping Express
api/[...path].ts            # Vercel serverless entry wrapping Express
```

## Environment Variables

Set these in your hosting provider dashboard (do not commit .env):

- GEMINI_API_KEY: Google Generative Language API key
- PING_MESSAGE: Custom message for GET /api/ping

## Scripts (pnpm)

- pnpm dev – start Vite dev server with Express middleware on port 8080
- pnpm build – build client and server bundles
- pnpm start – run production Express bundle (dist/server/node-build.mjs)
- pnpm test – run Vitest tests
- pnpm typecheck – TypeScript type checking

## Development

1. Install deps: pnpm i
2. Run dev server: pnpm dev
3. Open http://localhost:8080

Vite serves the SPA and proxies the Express app as middleware in development (see vite.config.ts -> expressPlugin()).

## API Overview (Express)

All routes use JSON and CORS is enabled.

- GET /api/ping → { message: PING_MESSAGE }
- GET /api/demo → sample JSON (shared type DemoResponse)
- POST /api/chat/gemini → { prompt, system? } → { model, text } (forwards to Gemini with User‑Agent)
- GET /api/weather → proxy to Open‑Meteo forecast or geocoding when ?search= name; adds custom User‑Agent
- GET /api/climate → proxy to Open‑Meteo climate API; adds custom User‑Agent

Shared contracts live in shared/api.ts.

## Frontend Routes

- / – Home (hero, products, steps, metrics, CTA, weather widget)
- /weather – Full weather analytics (current/hourly/daily, sunrise/sunset, climatology, charts)
- /assistant – AI assistant with voice I/O and local history
- /products – Product detail cards + tier comparison
- /solutions – Solutions (accordions)
- /partners – Partner lead form (stored locally)
- /resources – Searchable articles
- /quote – Quick quote calculator with geocoding and weather risk factor

## Styling & Theme

Design tokens are HSL CSS variables in client/global.css (emerald/amber brand). Tailwind is configured in tailwind.config.ts to read hsl(var(--token)) values. Update tokens only in HSL format to avoid color issues.

## Deployment

### Netlify

- netlify.toml configured to publish dist/spa and route /api/\* to functions
- Serverless entry: netlify/functions/api.ts wraps Express via serverless-http
- Build command: npm run build:client (client built; functions are bundled by Netlify)
- Set environment variables (GEMINI_API_KEY, PING_MESSAGE) in Site settings → Build & deploy → Environment

### Vercel

- vercel.json rewrites all SPA paths to /index.html and keeps /api/\* on serverless
- Serverless entry: api/[...path].ts wraps Express
- Set environment variables (GEMINI_API_KEY, PING_MESSAGE) in Project Settings → Environment Variables

## Security Notes

- Do not expose secrets in the client; keep keys only in hosting env vars
- API proxies set a custom User‑Agent (AgriSure/1.0) when calling third‑party services

## Troubleshooting

- Icons export error: replace any unavailable lucide-react icon with a supported one
- Weather requests failing: ensure your host allows outbound HTTPS and that /api/weather is used (not direct Open‑Meteo)
- Gemini errors: verify GEMINI_API_KEY is set and the model is available; the server falls back across preferred models automatically

## License

All rights reserved to the project owner. Update this section if you intend to open‑source the project.
