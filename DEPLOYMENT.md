# Deployment Guide

**Production URL:** https://oya.securemineidentity.com

For step-by-step instructions on where to obtain every API key, see **[KEYS.md](./KEYS.md)**.

## Vercel

1. Import the repository into [Vercel](https://vercel.com)
2. Framework preset: **Next.js**
3. Set environment variables (Production) — copy from [`.env.production.example`](.env.production.example):

| Variable | Required | Value (production) |
|----------|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | From Supabase → Settings → API (secret) |
| `ADMIN_EMAIL` | Yes | Your super admin email |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://oya.securemineidentity.com` |
| `UPSTASH_REDIS_REST_URL` | Yes | From Upstash → database → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | From Upstash → database → REST API |

4. Deploy

## Custom domain (oya.securemineidentity.com)

1. Vercel → **Project** → **Settings** → **Domains**
2. Add `oya.securemineidentity.com`
3. In your DNS provider for `securemineidentity.com`, add the CNAME/A record Vercel displays
4. Confirm SSL is active (automatic)

## Supabase

1. Run migration: [`supabase/migrations/20250616000001_initial_schema.sql`](supabase/migrations/20250616000001_initial_schema.sql)
2. **Authentication** → **URL Configuration** → Site URL: `https://oya.securemineidentity.com`
3. Create admin user in Auth, then run locally or in CI:

```bash
ADMIN_EMAIL=you@example.com npm run bootstrap-admin
```

## Upstash Redis

Required for production rate limiting on `/api/verify`. See [KEYS.md](./KEYS.md#2-upstash-redis-rate-limiting-in-production).

## Post-deploy checklist

- [ ] https://oya.securemineidentity.com loads
- [ ] Public verify returns 404 for invalid control numbers
- [ ] Admin login at `/admin/login`
- [ ] RLS blocks anon direct table access
- [ ] Attachments upload in admin
- [ ] Approved record visible at `/verify/[controlNumber]`
