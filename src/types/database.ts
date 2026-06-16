export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"];
          id: string;
          metadata: Json | null;
          record_id: string | null;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          action: Database["public"]["Enums"]["audit_action"];
          id?: string;
          metadata?: Json | null;
          record_id?: string | null;
          timestamp?: string;
          user_id: string;
        };
        Update: {
          action?: Database["public"]["Enums"]["audit_action"];
          id?: string;
          metadata?: Json | null;
          record_id?: string | null;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_record_id_fkey";
            columns: ["record_id"];
            isOneToOne: false;
            referencedRelation: "registry_records";
            referencedColumns: ["id"];
          },
        ];
      };
      registry_records: {
        Row: {
          attachment_1: string | null;
          attachment_2: string | null;
          attachment_3: string | null;
          category: string | null;
          contact_information: string | null;
          control_number: string;
          country: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          expiration_date: string | null;
          id: string;
          issue_date: string | null;
          notes: string | null;
          organization: string | null;
          record_name: string | null;
          record_type: string | null;
          reference_number: string | null;
          region: string | null;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          verification_status: string | null;
        };
        Insert: {
          attachment_1?: string | null;
          attachment_2?: string | null;
          attachment_3?: string | null;
          category?: string | null;
          contact_information?: string | null;
          control_number: string;
          country?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          expiration_date?: string | null;
          id?: string;
          issue_date?: string | null;
          notes?: string | null;
          organization?: string | null;
          record_name?: string | null;
          record_type?: string | null;
          reference_number?: string | null;
          region?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          verification_status?: string | null;
        };
        Update: {
          attachment_1?: string | null;
          attachment_2?: string | null;
          attachment_3?: string | null;
          category?: string | null;
          contact_information?: string | null;
          control_number?: string;
          country?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          expiration_date?: string | null;
          id?: string;
          issue_date?: string | null;
          notes?: string | null;
          organization?: string | null;
          record_name?: string | null;
          record_type?: string | null;
          reference_number?: string | null;
          region?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          verification_status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      audit_action:
        | "record_created"
        | "record_updated"
        | "record_deleted"
        | "status_changed";
      record_status: "draft" | "pending_review" | "approved" | "archived";
    };
    CompositeTypes: Record<string, never>;
  };
};
