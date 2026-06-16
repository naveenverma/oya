# Security Model

## Threat model

| Threat | Mitigation |
|--------|------------|
| Record enumeration | Exact-match verify only; uniform 404 for invalid/non-approved |
| Unauthorized admin access | Middleware + `requireSuperAdmin()` + RLS |
| Direct DB access | RLS denies anon; public reads via service role API only |
| Brute-force verification | 10 requests/minute/IP (Upstash in production) |
| XSS | React escaping; Zod input validation |
| SQL injection | Parameterized Supabase queries |
| CSRF | SameSite cookies; Server Actions |
| Attachment leakage | Private bucket; short-lived signed URLs |

## Public verification

- `GET /api/verify` and `/verify/[controlNumber]` only return **approved** records
- No database IDs, counts, or partial matches exposed
- Invalid format returns 404 (page) or uniform JSON error (API)

## Admin authentication

- Supabase Auth with email/password
- Role stored in `app_metadata.role = super_admin`
- Bootstrap via `scripts/bootstrap-admin.mjs` + `ADMIN_EMAIL`

## Rate limiting

- **Development:** In-memory limiter
- **Production:** Upstash Redis (`@upstash/ratelimit`)
- Fails closed (503) in production if Upstash is not configured

## Secrets

- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never `NEXT_PUBLIC_*`
- Store secrets in Vercel environment variables, not in source control

## Timing attacks

Verification responses use a consistent shape regardless of whether the control number exists or the record is non-approved. Optional constant-time delay can be added in `verify-service.ts` for high-threat deployments.
