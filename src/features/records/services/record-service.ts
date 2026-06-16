import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  DEFAULT_PAGE_SIZE,
  SIGNED_URL_EXPIRY_SECONDS,
  STORAGE_BUCKET,
} from "@/lib/security/constants";
import { writeAuditLog } from "@/features/audit/write-audit-log";
import type {
  DashboardMetrics,
  PaginatedRecords,
  RecordStatus,
  RegistryRecord,
} from "@/types";
import type { RecordFormValues, RecordListQuery } from "@/lib/validation/schemas";

type DbClient = SupabaseClient<Database>;

function mapRecord(row: Database["public"]["Tables"]["registry_records"]["Row"]): RegistryRecord {
  return row as RegistryRecord;
}

export async function getDashboardMetrics(
  client: DbClient,
): Promise<DashboardMetrics> {
  const { data, error } = await client.from("registry_records").select("status");

  if (error) {
    throw new Error(error.message);
  }

  const counts = {
    total: 0,
    approved: 0,
    pending_review: 0,
    archived: 0,
    draft: 0,
  };

  for (const row of data ?? []) {
    counts.total += 1;
    const status = row.status as RecordStatus;
    if (status === "draft") counts.draft += 1;
    else if (status === "approved") counts.approved += 1;
    else if (status === "pending_review") counts.pending_review += 1;
    else if (status === "archived") counts.archived += 1;
  }

  return counts;
}

export async function listRecords(
  client: DbClient,
  query: RecordListQuery,
): Promise<PaginatedRecords> {
  const page = query.page;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let builder = client
    .from("registry_records")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.status) {
    builder = builder.eq("status", query.status);
  }
  if (query.record_type) {
    builder = builder.eq("record_type", query.record_type);
  }
  if (query.category) {
    builder = builder.eq("category", query.category);
  }
  if (query.search) {
    const term = `%${query.search}%`;
    builder = builder.or(
      `control_number.ilike.${term},record_name.ilike.${term},organization.ilike.${term}`,
    );
  }

  const { data, error, count } = await builder;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  return {
    records: (data ?? []).map(mapRecord),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getRecordById(
  client: DbClient,
  id: string,
): Promise<RegistryRecord | null> {
  const { data, error } = await client
    .from("registry_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRecord(data) : null;
}

export async function createRecord(
  client: DbClient,
  values: RecordFormValues,
  userId: string,
): Promise<RegistryRecord> {
  const { data, error } = await client
    .from("registry_records")
    .insert({
      ...values,
      created_by: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(client, {
    action: "record_created",
    recordId: data.id,
    userId,
    metadata: { control_number: data.control_number },
  });

  return mapRecord(data);
}

export async function updateRecord(
  client: DbClient,
  id: string,
  values: Partial<RecordFormValues>,
  userId: string,
  previousStatus?: RecordStatus,
): Promise<RegistryRecord> {
  const { data, error } = await client
    .from("registry_records")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const action =
    values.status && previousStatus && values.status !== previousStatus
      ? "status_changed"
      : "record_updated";

  await writeAuditLog(client, {
    action,
    recordId: id,
    userId,
    metadata: {
      changes: values,
      ...(action === "status_changed"
        ? { from: previousStatus, to: values.status }
        : {}),
    },
  });

  return mapRecord(data);
}

export async function deleteRecord(
  client: DbClient,
  id: string,
  userId: string,
): Promise<void> {
  const existing = await getRecordById(client, id);
  if (!existing) {
    throw new Error("Record not found");
  }

  const paths = [
    existing.attachment_1,
    existing.attachment_2,
    existing.attachment_3,
  ].filter((p): p is string => Boolean(p));

  if (paths.length > 0) {
    await client.storage.from(STORAGE_BUCKET).remove(paths);
  }

  const { error } = await client.from("registry_records").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(client, {
    action: "record_deleted",
    recordId: id,
    userId,
    metadata: { control_number: existing.control_number },
  });
}

export async function uploadAttachment(
  client: DbClient,
  file: File,
  recordId: string,
  slot: 1 | 2 | 3,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${recordId}/attachment_${slot}_${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function getSignedAttachmentUrl(
  client: DbClient,
  path: string,
): Promise<string | null> {
  const { data, error } = await client.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
