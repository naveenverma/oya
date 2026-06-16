# Vercel project: oya

| Field | Value |
|-------|-------|
| **Project name** | oya |
| **Project ID** | `prj_R7Of8n5lgC3TZrD9HT9CXOkJMtTX` |
| **Team** | Naveen Verma's projects |
| **Team ID** | `team_uGKDBk7LvyVB8QKOJaONUdmV` |
| **Team slug** | `naveen-vermas-projects-c6ddebdc` |
| **Framework** | Next.js |
| **Git repo** | [naveenverma/oya](https://github.com/naveenverma/oya) (branch: `main`) |
| **Dashboard** | https://vercel.com/naveen-vermas-projects-c6ddebdc/oya |

## Live URLs

| URL | Purpose |
|-----|---------|
| https://oya-gold.vercel.app | Production alias |
| https://oya-naveen-vermas-projects-c6ddebdc.vercel.app | Default production |
| https://oya-git-main-naveen-vermas-projects-c6ddebdc.vercel.app | Git branch alias |
| https://oya.securemineidentity.com | Custom domain (add in Vercel → Domains) |

## MCP usage

When using the Vercel MCP in Cursor:

```
teamId: team_uGKDBk7LvyVB8QKOJaONUdmV
projectId: oya   (or prj_R7Of8n5lgC3TZrD9HT9CXOkJMtTX)
```

## Required environment variables (Production)

Set in [Vercel → oya → Settings → Environment Variables](https://vercel.com/naveen-vermas-projects-c6ddebdc/oya/settings/environment-variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qsmdibxjzifcpyqnueuo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase → Settings → API (secret) |
| `ADMIN_EMAIL` | `hello@haatchmedia.com` |
| `NEXT_PUBLIC_APP_URL` | `https://oya.securemineidentity.com` |
| `UPSTASH_REDIS_REST_URL` | From Upstash (production rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash |

After adding env vars, **redeploy** (Deployments → ⋯ → Redeploy).

## Local link

`.vercel/project.json` links this workspace to the Vercel project (gitignored).

## Related

- Supabase: [docs/supabase-project.md](./supabase-project.md)
- Keys guide: [KEYS.md](../KEYS.md)
