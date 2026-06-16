# Where to Get Your API Keys

Production site: **https://oya.securemineidentity.com**

Use this guide to collect every environment variable. Set them in **Vercel** (production) and in **`.env.local`** (local dev).

---

## 1. Supabase (database, auth, file storage)

**Sign up:** [https://supabase.com](https://supabase.com)

### Create a project

1. Dashboard → **New project**
2. Choose organization, name (e.g. `oya-registry`), region, database password
3. Wait for the project to finish provisioning

### Get the keys

| Env variable | Where to find it |
|--------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project Settings** → **API** → **Project URL** (e.g. `https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project Settings** → **API** → **Project API keys** → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Project Settings** → **API** → **Project API keys** → `service_role` `secret` |

**Important:** Never put `SUPABASE_SERVICE_ROLE_KEY` in client code or commit it to git. Vercel → mark as sensitive.

### Run the database migration

1. **SQL Editor** → New query
2. Paste contents of [`supabase/migrations/20250616000001_initial_schema.sql`](supabase/migrations/20250616000001_initial_schema.sql)
3. Run

This creates `registry_records`, `audit_logs`, RLS policies, and the `registry-attachments` storage bucket.

### Configure Auth for your domain

1. **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://oya.securemineidentity.com`
3. Add **Redirect URLs** (optional for email/password, useful if you add OAuth later):
   - `https://oya.securemineidentity.com/**`
   - `http://127.0.0.1:3200/**` (local dev)

### Create the Super Admin user

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Email = value of `ADMIN_EMAIL` (your admin email)
3. Set a strong password
4. From your machine (with env vars loaded):

```bash
cd /home/naveen/www/oya
export NEXT_PUBLIC_SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
export ADMIN_EMAIL=your-admin@example.com
npm run bootstrap-admin
```

This sets `app_metadata.role = super_admin`.

---

## 2. Upstash Redis (rate limiting in production)

**Sign up:** [https://upstash.com](https://upstash.com)

### Create a database

1. Dashboard → **Create database**
2. Name: e.g. `oya-verify-ratelimit`
3. Region: choose one close to your Vercel region (e.g. US East)
4. Type: **Regional**

### Get the keys

| Env variable | Where to find it |
|--------------|------------------|
| `UPSTASH_REDIS_REST_URL` | Database page → **REST API** → `UPSTASH_REDIS_REST_URL` |
| `UPSTASH_REDIS_REST_TOKEN` | Same section → `UPSTASH_REDIS_REST_TOKEN` |

Without these in production, `/api/verify` rate limiting returns **503** (fail-closed).

Local development uses in-memory rate limiting — Upstash is optional locally.

---

## 3. Vercel (hosting)

**Sign up:** [https://vercel.com](https://vercel.com)

### Deploy the app

1. **Add New** → **Project** → Import your `oya` git repository
2. Framework: **Next.js** (auto-detected)
3. Add all environment variables from [`.env.production.example`](.env.production.example)
4. Deploy

### Custom domain

1. **Project** → **Settings** → **Domains**
2. Add: `oya.securemineidentity.com`
3. At your DNS provider (where `securemineidentity.com` is managed), add the record Vercel shows:
   - Usually **CNAME** `oya` → `cname.vercel-dns.com`
   - Or **A** record if Vercel instructs that instead
4. Wait for SSL (automatic via Vercel)

### Required Vercel env vars (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_EMAIL=your-admin@example.com
NEXT_PUBLIC_APP_URL=https://oya.securemineidentity.com
UPSTASH_REDIS_REST_URL=https://YOUR_DB.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...
```

---

## 4. Admin email (`ADMIN_EMAIL`)

This is **not** from a third-party API — it is the email address you choose for the single Super Admin.

- Use a real inbox you control
- Must match the user created in Supabase Auth
- Example: `admin@securemineidentity.com`

---

## 5. Local development (`.env.local`)

Copy the template:

```bash
cp .env.example .env.local
```

| Variable | Local value |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://127.0.0.1:3200` |
| Supabase keys | Same project as prod, or a separate **dev** Supabase project |
| Upstash | Leave empty (in-memory rate limit used locally) |

---

## Quick checklist

| Step | Done |
|------|------|
| Supabase project created | ☐ |
| Migration SQL executed | ☐ |
| Supabase Site URL = `https://oya.securemineidentity.com` | ☐ |
| Admin user created + `bootstrap-admin` run | ☐ |
| Upstash Redis created | ☐ |
| Vercel project deployed with all env vars | ☐ |
| Domain `oya.securemineidentity.com` added in Vercel + DNS | ☐ |
| Login at `/admin/login` works | ☐ |
| Public verify at `/` works | ☐ |

---

## URLs after go-live

| Page | URL |
|------|-----|
| Public home / verify | https://oya.securemineidentity.com |
| Admin login | https://oya.securemineidentity.com/admin/login |
| Verify API | https://oya.securemineidentity.com/api/verify?controlNumber=YOUR-NUMBER |
