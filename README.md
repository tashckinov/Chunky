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

The default `AI_PROVIDER=mock` keeps local practice usable without API keys. Set `AI_PROVIDER=openai` or `AI_PROVIDER=anthropic` and the corresponding key/model for a real evaluator.

## shadcn/ui and MCP

The checked-in `components.json` targets `apps/web`, and `.mcp.json` exposes the official shadcn registry server to compatible clients. Add more components from the repository root with:

```bash
npx shadcn@latest add dialog -c apps/web
```

## Deploy

- Frontend: set the project root to `apps/web` on Cloudflare Pages or Vercel; build with `npm run build`, output `dist`.
- API: build the root-context image with `docker build -f apps/api/Dockerfile .`, or run `npm run build -w @chunky/api` and `npm run start -w @chunky/api` on the VPS.
- Database: provide `DATABASE_URL` and run `npm run db:migrate` during release.

Keep AI keys only on the API host. Never expose them through `VITE_*` variables.
