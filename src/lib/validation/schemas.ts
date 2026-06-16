import { z } from "zod";
import {
  CONTROL_NUMBER_MAX_LENGTH,
  CONTROL_NUMBER_PATTERN,
  RECORD_STATUSES,
} from "@/lib/security/constants";
import { normalizeControlNumber } from "@/lib/security/sanitize";

export const controlNumberSchema = z
  .string()
  .min(1, "Control number is required")
  .max(CONTROL_NUMBER_MAX_LENGTH)
  .transform(normalizeControlNumber)
  .refine((val) => CONTROL_NUMBER_PATTERN.test(val), {
    message: "Invalid control number format",
  });

export const verifyQuerySchema = z.object({
  controlNumber: controlNumberSchema,
});

export const recordFormSchema = z.object({
  control_number: controlNumberSchema,
  record_name: z.string().min(1, "Record name is required").max(255),
  organization: z.string().max(255).optional().nullable(),
  record_type: z.string().max(100).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  status: z.enum(RECORD_STATUSES),
  issue_date: z.string().optional().nullable(),
  expiration_date: z.string().optional().nullable(),
  verification_status: z.string().max(100).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  reference_number: z.string().max(100).optional().nullable(),
  contact_information: z.string().max(500).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export type RecordFormValues = z.infer<typeof recordFormSchema>;

export const recordListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  status: z.enum(RECORD_STATUSES).optional(),
  record_type: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
});

export type RecordListQuery = z.infer<typeof recordListQuerySchema>;

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function validateAttachmentFile(file: File): string | null {
  const allowed = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  if (!allowed.includes(file.type)) {
    return "Only PDF, PNG, JPG, and JPEG files are allowed";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "File size must be 10MB or less";
  }
  return null;
}
