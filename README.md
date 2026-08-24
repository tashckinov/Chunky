# Chunky

PWA-first trainer for turning Russian thoughts into natural English chunks.

## Stack

- `apps/web`: React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router, vite-plugin-pwa
- `apps/api`: Node.js, TypeScript, Fastify, PostgreSQL
- AI evaluation runs only through the API and returns structured JSON
- Redis is intentionally absent until a real queue/cache/rate-limit use case appears

## Start locally

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:migrate
npm run dev
```

Web: `http://localhost:5173`
API health: `http://localhost:3000/health`
AdminJS: `http://localhost:3000/admin`

The default `AI_PROVIDER=mock` keeps local practice usable without API keys. Set `AI_PROVIDER=openai` or `AI_PROVIDER=anthropic` and the corresponding key/model for a real evaluator.

## AdminJS

AdminJS uses the same PostgreSQL database and runs inside the Fastify API. The first migration creates the product tables; `002_admin_sessions.sql` adds persistent administrator sessions.

- Decks and chunks: create, edit, filter, and delete.
- Users and reviews: view and filter.
- Product sessions, passkeys, schema migrations, and administrator sessions: hidden.

Admin access starts disabled. Set `ADMIN_ENABLED=true`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and an `ADMIN_COOKIE_SECRET` with at least 32 characters. Use unique production values, HTTPS, and private network access through a VPN or Tailscale.

## shadcn/ui and MCP

The checked-in `components.json` targets `apps/web`, and `.mcp.json` exposes the official shadcn registry server to compatible clients. Add more components from the repository root with:

```bash
npx shadcn@latest add dialog -c apps/web
```

Codex CLI keeps MCP configuration in the user's config rather than the repository. Add this once to `~/.codex/config.toml`, then restart Codex:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

## Deploy

- Frontend: set the project root to `apps/web` on Cloudflare Pages or Vercel; build with `npm run build`, output `dist`.
- API: build the root-context image with `docker build -f apps/api/Dockerfile .`, or run `npm run build -w @chunky/api` and `npm run start -w @chunky/api` on the VPS.
- Database: provide `DATABASE_URL` and run `npm run db:migrate` during release.

Keep AI keys only on the API host. Never expose them through `VITE_*` variables.
