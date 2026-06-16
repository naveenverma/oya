import {
  PUBLIC_RECORD_STATUS,
  SIGNED_URL_EXPIRY_SECONDS,
  STORAGE_BUCKET,
} from "@/lib/security/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { normalizeControlNumber } from "@/lib/security/sanitize";
import type { PublicAttachment, PublicRecord, RegistryRecord } from "@/types";

const ATTACHMENT_FIELDS = [
  { key: "attachment_1" as const, label: "Attachment 1" },
  { key: "attachment_2" as const, label: "Attachment 2" },
  { key: "attachment_3" as const, label: "Attachment 3" },
];

function getMimeTypeFromPath(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

export async function resolveAttachments(
  record: Pick<RegistryRecord, "attachment_1" | "attachment_2" | "attachment_3">,
): Promise<PublicAttachment[]> {
  const supabase = createServiceClient();
  const attachments: PublicAttachment[] = [];

  for (const field of ATTACHMENT_FIELDS) {
    const path = record[field.key];
    if (!path) continue;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

    if (error || !data?.signedUrl) continue;

    attachments.push({
      label: field.label,
      url: data.signedUrl,
      mimeType: getMimeTypeFromPath(path),
    });
  }

  return attachments;
}

export function toPublicRecord(
  record: RegistryRecord,
  attachments: PublicAttachment[],
): PublicRecord {
  return {
    record_name: record.record_name,
    organization: record.organization,
    record_type: record.record_type,
    category: record.category,
    status: record.status,
    issue_date: record.issue_date,
    expiration_date: record.expiration_date,
    description: record.description,
    country: record.country,
    region: record.region,
    attachments,
  };
}

export async function verifyApprovedRecord(
  controlNumber: string,
): Promise<PublicRecord | null> {
  const normalized = normalizeControlNumber(controlNumber);
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("registry_records")
    .select("*")
    .eq("control_number", normalized)
    .eq("status", PUBLIC_RECORD_STATUS)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const attachments = await resolveAttachments(data);
  return toPublicRecord(data as RegistryRecord, attachments);
}
