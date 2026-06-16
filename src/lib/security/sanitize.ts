import { CONTROL_NUMBER_MAX_LENGTH, CONTROL_NUMBER_PATTERN } from "@/lib/security/constants";

export function normalizeControlNumber(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidControlNumberFormat(value: string): boolean {
  const normalized = normalizeControlNumber(value);
  if (normalized.length === 0 || normalized.length > CONTROL_NUMBER_MAX_LENGTH) {
    return false;
  }
  return CONTROL_NUMBER_PATTERN.test(normalized);
}

export function sanitizeTextInput(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}
