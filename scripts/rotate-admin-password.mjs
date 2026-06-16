#!/usr/bin/env node
/**
 * Rotate ADMIN_EMAIL user password via Supabase Admin API.
 * Usage: NEW_ADMIN_PASSWORD='...' node scripts/rotate-admin-password.mjs
 * Or omit env to generate a random password (printed once to stdout).
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!url || !serviceKey || !adminEmail) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ADMIN_EMAIL",
  );
  process.exit(1);
}

const newPassword =
  process.env.NEW_ADMIN_PASSWORD ??
  `OyaSMI-${randomBytes(4).toString("hex")}-2026!`;

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
  console.error(`No user found for ${adminEmail}`);
  process.exit(1);
}

const { error: updateError } = await supabase.auth.admin.updateUserById(
  user.id,
  { password: newPassword },
);

if (updateError) {
  console.error("Failed to update password:", updateError.message);
  process.exit(1);
}

console.log(`Password rotated for ${adminEmail}`);
if (!process.env.NEW_ADMIN_PASSWORD) {
  console.log(`NEW_PASSWORD=${newPassword}`);
}
