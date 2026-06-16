-- Bootstrap script: set super_admin role for ADMIN_EMAIL user
-- Run via Supabase SQL editor after inviting the admin user

-- Example (replace email):
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "super_admin"}'::jsonb
-- WHERE email = 'admin@example.com';
