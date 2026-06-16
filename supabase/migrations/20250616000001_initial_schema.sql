-- Secure Registry & Verification Portal
-- Migration 001: enums and registry_records table

CREATE TYPE record_status AS ENUM (
  'draft',
  'pending_review',
  'approved',
  'archived'
);

CREATE TYPE audit_action AS ENUM (
  'record_created',
  'record_updated',
  'record_deleted',
  'status_changed'
);

CREATE TABLE registry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_number VARCHAR(64) NOT NULL,
  record_name VARCHAR(255),
  organization VARCHAR(255),
  record_type VARCHAR(100),
  category VARCHAR(100),
  status record_status NOT NULL DEFAULT 'draft',
  issue_date DATE,
  expiration_date DATE,
  verification_status VARCHAR(100),
  description TEXT,
  country VARCHAR(100),
  region VARCHAR(100),
  reference_number VARCHAR(100),
  contact_information VARCHAR(500),
  notes TEXT,
  attachment_1 TEXT,
  attachment_2 TEXT,
  attachment_3 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX registry_records_control_number_unique
  ON registry_records (LOWER(control_number));

CREATE INDEX registry_records_status_idx ON registry_records (status);
CREATE INDEX registry_records_created_at_idx ON registry_records (created_at DESC);

CREATE OR REPLACE FUNCTION update_registry_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registry_records_updated_at
  BEFORE UPDATE ON registry_records
  FOR EACH ROW
  EXECUTE FUNCTION update_registry_records_updated_at();

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action audit_action NOT NULL,
  record_id UUID REFERENCES registry_records(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX audit_logs_record_id_idx ON audit_logs (record_id);
CREATE INDEX audit_logs_user_id_idx ON audit_logs (user_id);
CREATE INDEX audit_logs_timestamp_idx ON audit_logs (timestamp DESC);

-- Helper: check super_admin role from JWT app_metadata
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    FALSE
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

ALTER TABLE registry_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- No anon policies — public access via service role API only

CREATE POLICY registry_records_super_admin_select
  ON registry_records FOR SELECT
  TO authenticated
  USING (is_super_admin());

CREATE POLICY registry_records_super_admin_insert
  ON registry_records FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

CREATE POLICY registry_records_super_admin_update
  ON registry_records FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY registry_records_super_admin_delete
  ON registry_records FOR DELETE
  TO authenticated
  USING (is_super_admin());

CREATE POLICY audit_logs_super_admin_select
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_super_admin());

CREATE POLICY audit_logs_super_admin_insert
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'registry-attachments',
  'registry-attachments',
  FALSE,
  10485760,
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY storage_super_admin_insert
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'registry-attachments' AND is_super_admin()
  );

CREATE POLICY storage_super_admin_update
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'registry-attachments' AND is_super_admin())
  WITH CHECK (bucket_id = 'registry-attachments' AND is_super_admin());

CREATE POLICY storage_super_admin_delete
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'registry-attachments' AND is_super_admin());

CREATE POLICY storage_super_admin_select
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'registry-attachments' AND is_super_admin());
