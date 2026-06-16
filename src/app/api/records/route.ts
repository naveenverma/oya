import { NextResponse } from "next/server";
import { requireSuperAdmin, AuthError } from "@/features/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { createRecord } from "@/features/records/services/record-service";
import { recordFormSchema } from "@/lib/validation/schemas";
import type { ApiError } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await requireSuperAdmin();
    const body: unknown = await request.json();
    const parsed = recordFormSchema.safeParse(body);

    if (!parsed.success) {
      const err: ApiError = {
        error: parsed.error.issues[0]?.message ?? "Invalid input",
        code: "VALIDATION_ERROR",
      };
      return NextResponse.json(err, { status: 400 });
    }

    const supabase = await createClient();
    const record = await createRecord(supabase, parsed.data, user.id);

    return NextResponse.json({ id: record.id }, { status: 201 });
  } catch (err) {
    const status = err instanceof AuthError ? (err.code === "FORBIDDEN" ? 403 : 401) : 500;
    const errBody: ApiError = {
      error:
        err instanceof Error ? err.message : "Failed to create record",
    };
    return NextResponse.json(errBody, { status });
  }
}
