-- RLS policies call is_super_admin() for authenticated users.
-- Migration 002 revoked EXECUTE from authenticated; restore it for admin access.
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
