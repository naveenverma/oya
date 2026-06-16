import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getRecordById,
  getSignedAttachmentUrl,
} from "@/features/records/services/record-service";
import { RecordForm } from "@/features/records/components/record-form";
import { AttachmentUpload } from "@/features/records/components/attachment-upload";
import { DeleteRecordButton } from "@/features/records/components/delete-record-button";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const record = await getRecordById(supabase, id);
  return {
    title: record?.record_name ?? "Edit Record",
  };
}

export default async function EditRecordPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const record = await getRecordById(supabase, id);

  if (!record) {
    notFound();
  }

  const attachmentUrls = await Promise.all([
    record.attachment_1
      ? getSignedAttachmentUrl(supabase, record.attachment_1)
      : null,
    record.attachment_2
      ? getSignedAttachmentUrl(supabase, record.attachment_2)
      : null,
    record.attachment_3
      ? getSignedAttachmentUrl(supabase, record.attachment_3)
      : null,
  ]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <ButtonLink href="/admin/records" variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to records
        </ButtonLink>
        <DeleteRecordButton recordId={record.id} />
      </div>
      <h1 className="text-2xl font-bold">Edit Record</h1>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {record.control_number}
      </p>

      <div className="mt-8 max-w-4xl space-y-8">
        <RecordForm mode="edit" record={record} />

        <div>
          <h2 className="mb-4 text-lg font-semibold">Attachments</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <AttachmentUpload
              recordId={record.id}
              slot={1}
              currentPath={record.attachment_1}
              previewUrl={attachmentUrls[0]}
            />
            <AttachmentUpload
              recordId={record.id}
              slot={2}
              currentPath={record.attachment_2}
              previewUrl={attachmentUrls[1]}
            />
            <AttachmentUpload
              recordId={record.id}
              slot={3}
              currentPath={record.attachment_3}
              previewUrl={attachmentUrls[2]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
