"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginFormValues } from "@/lib/validation/schemas";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  values: LoginFormValues,
  redirectTo = "/admin",
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  const destination =
    redirectTo.startsWith("/admin") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/admin";

  redirect(destination);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
