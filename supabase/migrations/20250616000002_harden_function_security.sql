-- Harden functions per Supabase security advisors
ALTER FUNCTION public.is_super_admin() SET search_path = public;
ALTER FUNCTION public.update_registry_records_updated_at() SET search_path = public;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM anon;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM authenticated;
