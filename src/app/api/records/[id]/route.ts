import { NextResponse } from "next/server";
import { requireSuperAdmin, AuthError } from "@/features/auth/guards";
import { createClient } from "@/lib/supabase/server";
import {
  deleteRecord,
  updateRecord,
  getRecordById,
} from "@/features/records/services/record-service";
import { recordFormSchema } from "@/lib/validation/schemas";
import type { ApiError } from "@/types";

type RouteContext = { params: Promise<{ id: string }> };

function authStatus(err: unknown): number {
  if (err instanceof AuthError) {
    return err.code === "FORBIDDEN" ? 403 : 401;
  }
  return 500;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireSuperAdmin();
    const { id } = await context.params;
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
    const existing = await getRecordById(supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const record = await updateRecord(
      supabase,
      id,
      parsed.data,
      user.id,
      existing.status,
    );

    return NextResponse.json(record);
  } catch (err) {
    const errBody: ApiError = {
      error: err instanceof Error ? err.message : "Failed to update record",
    };
    return NextResponse.json(errBody, { status: authStatus(err) });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireSuperAdmin();
    const { id } = await context.params;
    const supabase = await createClient();

    const existing = await getRecordById(supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await deleteRecord(supabase, id, user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const errBody: ApiError = {
      error: err instanceof Error ? err.message : "Failed to delete record",
    };
    return NextResponse.json(errBody, { status: authStatus(err) });
  }
}
