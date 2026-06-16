# Supabase project: oya

| Field | Value |
|-------|-------|
| **Name** | oya |
| **Project ID** | `qsmdibxjzifcpyqnueuo` |
| **Region** | ap-southeast-1 (Singapore) |
| **API URL** | https://qsmdibxjzifcpyqnueuo.supabase.co |
| **Dashboard** | https://supabase.com/dashboard/project/qsmdibxjzifcpyqnueuo |

## MCP usage

When using the Supabase MCP in Cursor, target project ID:

```
qsmdibxjzifcpyqnueuo
```

## Applied migrations

- `initial_schema` — `registry_records`, `audit_logs`, RLS, storage bucket `registry-attachments`

## Tables

| Table | RLS |
|-------|-----|
| `registry_records` | enabled |
| `audit_logs` | enabled |

## Local env

Copy keys into `.env.local` (see [KEYS.md](../KEYS.md)). Service role key is **not** available via MCP — get it from Dashboard → **Settings** → **API** → `service_role` secret.
