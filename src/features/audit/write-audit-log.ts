import type { AuditAction } from "@/types";
import type { Json } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type DbClient = SupabaseClient<Database>;

export async function writeAuditLog(
  client: DbClient,
  params: {
    action: AuditAction;
    recordId: string | null;
    userId: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  const { error } = await client.from("audit_logs").insert({
    action: params.action,
    record_id: params.recordId,
    user_id: params.userId,
    metadata: (params.metadata ?? null) as Json | null,
  });

  if (error) {
    console.error("Failed to write audit log:", error.message);
  }
}
