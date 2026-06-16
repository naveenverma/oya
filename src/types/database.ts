export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      registry_records: {
        Row: {
          id: string;
          control_number: string;
          record_name: string | null;
          organization: string | null;
          record_type: string | null;
          category: string | null;
          status: string;
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
        };
        Insert: {
          id?: string;
          control_number: string;
          record_name?: string | null;
          organization?: string | null;
          record_type?: string | null;
          category?: string | null;
          status?: string;
          issue_date?: string | null;
          expiration_date?: string | null;
          verification_status?: string | null;
          description?: string | null;
          country?: string | null;
          region?: string | null;
          reference_number?: string | null;
          contact_information?: string | null;
          notes?: string | null;
          attachment_1?: string | null;
          attachment_2?: string | null;
          attachment_3?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          control_number?: string;
          record_name?: string | null;
          organization?: string | null;
          record_type?: string | null;
          category?: string | null;
          status?: string;
          issue_date?: string | null;
          expiration_date?: string | null;
          verification_status?: string | null;
          description?: string | null;
          country?: string | null;
          region?: string | null;
          reference_number?: string | null;
          contact_information?: string | null;
          notes?: string | null;
          attachment_1?: string | null;
          attachment_2?: string | null;
          attachment_3?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          record_id: string | null;
          user_id: string;
          timestamp: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          action: string;
          record_id?: string | null;
          user_id: string;
          timestamp?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          action?: string;
          record_id?: string | null;
          user_id?: string;
          timestamp?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      record_status: "draft" | "pending_review" | "approved" | "archived";
      audit_action:
        | "record_created"
        | "record_updated"
        | "record_deleted"
        | "status_changed";
    };
    CompositeTypes: Record<string, never>;
  };
}
