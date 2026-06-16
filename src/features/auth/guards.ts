import { createClient } from "@/lib/supabase/server";
import { SUPER_ADMIN_ROLE } from "@/lib/security/constants";
import type { User } from "@supabase/supabase-js";

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function isSuperAdmin(user: User): boolean {
  const role = user.app_metadata?.role;
  return role === SUPER_ADMIN_ROLE;
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireSuperAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthError("Authentication required", "UNAUTHORIZED");
  }
  if (!isSuperAdmin(user)) {
    throw new AuthError("Super admin access required", "FORBIDDEN");
  }
  return user;
}
