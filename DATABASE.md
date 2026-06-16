# Database Schema

## Tables

### registry_records

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| control_number | VARCHAR(64) | Unique (case-insensitive index) |
| record_name | VARCHAR(255) | |
| organization | VARCHAR(255) | |
| record_type | VARCHAR(100) | |
| category | VARCHAR(100) | |
| status | record_status enum | draft, pending_review, approved, archived |
| issue_date | DATE | |
| expiration_date | DATE | |
| verification_status | VARCHAR(100) | |
| description | TEXT | |
| country | VARCHAR(100) | |
| region | VARCHAR(100) | |
| reference_number | VARCHAR(100) | Admin only |
| contact_information | VARCHAR(500) | Admin only |
| notes | TEXT | Admin only |
| attachment_1..3 | TEXT | Storage paths |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated |
| created_by | UUID | FK auth.users |

### audit_logs

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| action | audit_action enum | record_created, record_updated, record_deleted, status_changed |
| record_id | UUID | Nullable after delete |
| user_id | UUID | FK auth.users |
| timestamp | TIMESTAMPTZ | |
| metadata | JSONB | Change details |

## Enums

- **record_status:** `draft`, `pending_review`, `approved`, `archived`
- **audit_action:** `record_created`, `record_updated`, `record_deleted`, `status_changed`

## Row Level Security

- **anon:** No policies — no direct table access
- **authenticated super_admin:** Full CRUD on `registry_records` and `audit_logs`
- Role check: `auth.jwt() -> 'app_metadata' ->> 'role' = 'super_admin'`

## Storage

- Bucket: `registry-attachments` (private)
- Max size: 10MB
- MIME types: PDF, PNG, JPEG, JPG
- Public access via signed URLs generated server-side

## Migrations

SQL files live in `supabase/migrations/`. Apply in order.
