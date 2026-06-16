# Admin Guide

## Signing in

1. Go to `/admin/login`
2. Use the email provisioned as Super Admin (`ADMIN_EMAIL`)
3. After login, you are redirected to the dashboard

## Dashboard

View metrics: total records, approved, pending review, and archived.

## Creating a record

1. Navigate to **Records → New Record**
2. Fill required fields: Control Number, Record Name
3. Set status (default: Draft)
4. Click **Create Record**
5. On the edit page, upload attachments (PDF, PNG, JPG — max 10MB each)

## Status workflow

| Status | Public visibility |
|--------|-------------------|
| Draft | Not visible |
| Pending Review | Not visible |
| Approved | Visible via control number verification |
| Archived | Not visible |

Only **Approved** records appear on the public verification portal.

## Editing a record

1. Open a record from the records list
2. Update fields and click **Save Changes**
3. Replace attachments using the upload controls

## Deleting a record

1. Open the record
2. Click **Delete** and confirm
3. Record and storage attachments are permanently removed
4. An audit log entry is created

## Searching and filtering

- Search by control number, record name, or organization
- Filter by status from the records list

## Audit log

All create, update, delete, and status change actions are logged in `audit_logs` with user ID and metadata.

## Password reset

Use Supabase Auth password reset from the login page, or reset via Supabase Dashboard → Authentication → Users.
