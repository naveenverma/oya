# Installation Guide

## Prerequisites

- Node.js 20+
- npm
- Supabase account
- Upstash Redis (production rate limiting)

## 1. Clone and install

```bash
cd /home/naveen/www/oya
npm install
```

## 2. Create Supabase project

**This repo uses the existing project `oya`:**

| Field | Value |
|-------|-------|
| Project ID | `qsmdibxjzifcpyqnueuo` |
| API URL | https://qsmdibxjzifcpyqnueuo.supabase.co |
| Dashboard | https://supabase.com/dashboard/project/qsmdibxjzifcpyqnueuo |

See [docs/supabase-project.md](docs/supabase-project.md) for MCP details.

If setting up from scratch elsewhere:

1. Create a new project at [supabase.com](https://supabase.com)
2. Note the project URL and anon key
3. Copy the service role key (Settings → API) — **never expose client-side**

## 3. Run migrations

Apply the SQL in `supabase/migrations/20250616000001_initial_schema.sql` via:

- Supabase Dashboard → SQL Editor, or
- Supabase CLI: `supabase db push`

## 4. Configure environment

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `ADMIN_EMAIL` | Super admin email |
| `NEXT_PUBLIC_APP_URL` | `http://127.0.0.1:3200` locally |
| `UPSTASH_REDIS_REST_URL` | Upstash URL (production) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token (production) |

## 5. Bootstrap Super Admin

1. In Supabase Auth, invite or create a user with `ADMIN_EMAIL`
2. Run:

```bash
npm run bootstrap-admin
```

This sets `app_metadata.role = super_admin` on the matching user.

## 6. Start development server

```bash
npm run dev
```

- Public portal: http://127.0.0.1:3200
- Admin login: http://127.0.0.1:3200/admin/login

## 7. Run tests

```bash
npm run test
npm run test:e2e
```

For full E2E admin tests, set `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` in `.env.local`.
