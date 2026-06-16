import { describe, it, expect } from "vitest";
import { AuthError, isSuperAdmin } from "@/features/auth/guards";
import type { User } from "@supabase/supabase-js";

describe("isSuperAdmin", () => {
  it("returns true when role is super_admin", () => {
    const user = {
      app_metadata: { role: "super_admin" },
    } as User;
    expect(isSuperAdmin(user)).toBe(true);
  });

  it("returns false for other roles", () => {
    const user = { app_metadata: { role: "user" } } as User;
    expect(isSuperAdmin(user)).toBe(false);
  });
});

describe("AuthError", () => {
  it("carries error code", () => {
    const err = new AuthError("Forbidden", "FORBIDDEN");
    expect(err.code).toBe("FORBIDDEN");
    expect(err.name).toBe("AuthError");
  });
});
