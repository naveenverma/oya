# Secure Registry & Verification Portal

A production-ready private registry management platform built with Next.js 15, Supabase, and Vercel.

## Features

- **Public verification** — Enter a control number to view an approved record (exact match only)
- **Super Admin portal** — Full CRUD, attachments, dashboard metrics, audit logging
- **Security** — Row Level Security, anti-enumeration, rate limiting, private file storage

## Quick Start

```bash
cp .env.example .env.local
# Fill in Supabase credentials

npm install
npm run dev
```

Open [http://127.0.0.1:3200](http://127.0.0.1:3200) locally, or **https://oya.securemineidentity.com** in production.

**Need API keys?** See **[KEYS.md](./KEYS.md)** for where to get Supabase, Upstash, and Vercel credentials.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3200 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit + integration tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run bootstrap-admin` | Grant super_admin role to ADMIN_EMAIL |

## Documentation

- [docs/vercel-project.md](docs/vercel-project.md) — **Vercel project IDs and env vars**
- [docs/supabase-project.md](docs/supabase-project.md) — Supabase project `oya`
- [KEYS.md](./KEYS.md) — **Where to get every API key**
- [INSTALL.md](./INSTALL.md) — Local setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel deployment
- [DATABASE.md](./DATABASE.md) — Schema and RLS
- [SECURITY.md](./SECURITY.md) — Security model
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) — Admin workflows
- [UAT_REPORT_TEMPLATE.md](./UAT_REPORT_TEMPLATE.md) — UAT checklist
- [docs/UAT_REPORT.md](docs/UAT_REPORT.md) — **Signed-off UAT report (production)**

## Tech Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL, Auth, Storage)
- Zod, React Hook Form
- Vitest, Playwright
