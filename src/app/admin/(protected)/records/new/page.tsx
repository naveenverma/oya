import { ButtonLink } from "@/components/ui/button-link";
import { RecordForm } from "@/features/records/components/record-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Create Record",
};

export default function NewRecordPage() {
  return (
    <div className="p-6 md:p-8">
      <ButtonLink href="/admin/records" variant="ghost" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to records
      </ButtonLink>
      <h1 className="text-2xl font-bold">Create Record</h1>
      <p className="mt-1 text-muted-foreground">
        Add a new registry record. Upload attachments after saving.
      </p>
      <div className="mt-8 max-w-4xl">
        <RecordForm mode="create" />
      </div>
    </div>
  );
}
