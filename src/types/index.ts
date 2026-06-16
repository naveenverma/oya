export type RecordStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "archived";

export type AuditAction =
  | "record_created"
  | "record_updated"
  | "record_deleted"
  | "status_changed";

export interface RegistryRecord {
  id: string;
  control_number: string;
  record_name: string | null;
  organization: string | null;
  record_type: string | null;
  category: string | null;
  status: RecordStatus;
  issue_date: string | null;
  expiration_date: string | null;
  verification_status: string | null;
  description: string | null;
  country: string | null;
  region: string | null;
  reference_number: string | null;
  contact_information: string | null;
  notes: string | null;
  attachment_1: string | null;
  attachment_2: string | null;
  attachment_3: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface PublicRecord {
  record_name: string | null;
  organization: string | null;
  record_type: string | null;
  category: string | null;
  status: RecordStatus;
  issue_date: string | null;
  expiration_date: string | null;
  description: string | null;
  country: string | null;
  region: string | null;
  attachments: PublicAttachment[];
}

export interface PublicAttachment {
  label: string;
  url: string;
  mimeType: string;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  record_id: string | null;
  user_id: string;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

export interface DashboardMetrics {
  total: number;
  approved: number;
  pending_review: number;
  archived: number;
  draft: number;
}

export interface PaginatedRecords {
  records: RegistryRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  code?: string;
}
