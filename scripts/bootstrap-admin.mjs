#!/usr/bin/env node
/**
 * Bootstrap super_admin role for ADMIN_EMAIL user.
 * Usage: node scripts/bootstrap-admin.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!url || !serviceKey || !adminEmail) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ADMIN_EMAIL",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.listUsers();

if (error) {
  console.error("Failed to list users:", error.message);
  process.exit(1);
}

const user = data.users.find(
  (u) => u.email?.toLowerCase() === adminEmail.toLowerCase(),
);

if (!user) {
  console.error(
    `No user found for ${adminEmail}. Invite the user in Supabase Auth first.`,
  );
  process.exit(1);
}

const { error: updateError } = await supabase.auth.admin.updateUserById(
  user.id,
  { app_metadata: { ...user.app_metadata, role: "super_admin" } },
);

if (updateError) {
  console.error("Failed to update user:", updateError.message);
  process.exit(1);
}

console.log(`Super admin role granted to ${adminEmail}`);
