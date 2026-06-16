export const RECORD_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "archived",
] as const;

export const PUBLIC_RECORD_STATUS = "approved" as const;

export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const STORAGE_BUCKET = "registry-attachments";

export const VERIFY_RATE_LIMIT = {
  requests: 10,
  window: "1 m" as const,
};

export const CONTROL_NUMBER_MAX_LENGTH = 64;

export const CONTROL_NUMBER_PATTERN = /^[A-Z0-9][A-Z0-9\-_/]*$/;

export const DEFAULT_PAGE_SIZE = 20;

export const SUPER_ADMIN_ROLE = "super_admin";

export const SIGNED_URL_EXPIRY_SECONDS = 3600;
