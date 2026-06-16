"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/features/auth/guards";
import {
  createRecord,
  deleteRecord,
  updateRecord,
  uploadAttachment,
} from "@/features/records/services/record-service";
import {
  recordFormSchema,
  validateAttachmentFile,
  type RecordFormValues,
} from "@/lib/validation/schemas";

export type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

export async function createRecordAction(
  values: RecordFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireSuperAdmin();
    const parsed = recordFormSchema.safeParse(values);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const supabase = await createClient();
    const record = await createRecord(supabase, parsed.data, user.id);

    revalidatePath("/admin");
    revalidatePath("/admin/records");

    return { success: true, data: { id: record.id } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create record",
    };
  }
}

export async function updateRecordAction(
  id: string,
  values: RecordFormValues,
  previousStatus?: string,
): Promise<ActionResult> {
  try {
    const user = await requireSuperAdmin();
    const parsed = recordFormSchema.safeParse(values);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const supabase = await createClient();
    await updateRecord(
      supabase,
      id,
      parsed.data,
      user.id,
      previousStatus as RecordFormValues["status"] | undefined,
    );

    revalidatePath("/admin");
    revalidatePath("/admin/records");
    revalidatePath(`/admin/records/${id}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update record",
    };
  }
}

export async function deleteRecordAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireSuperAdmin();
    const supabase = await createClient();
    await deleteRecord(supabase, id, user.id);

    revalidatePath("/admin");
    revalidatePath("/admin/records");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete record",
    };
  }
}

export async function uploadAttachmentAction(
  recordId: string,
  slot: 1 | 2 | 3,
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  try {
    await requireSuperAdmin();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }

    const validationError = validateAttachmentFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();
    const path = await uploadAttachment(supabase, file, recordId, slot);

    const updatePayload =
      slot === 1
        ? { attachment_1: path }
        : slot === 2
          ? { attachment_2: path }
          : { attachment_3: path };

    await supabase.from("registry_records").update(updatePayload).eq("id", recordId);

    revalidatePath(`/admin/records/${recordId}`);

    return { success: true, data: { path } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to upload attachment",
    };
  }
}
