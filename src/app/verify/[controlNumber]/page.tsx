import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { VerificationResult } from "@/features/verification/components/verification-result";
import { verifyApprovedRecord } from "@/features/verification/verify-service";
import { isValidControlNumberFormat } from "@/lib/security/sanitize";
import { ButtonLink } from "@/components/ui/button-link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type PageProps = {
  params: Promise<{ controlNumber: string }>;
};

export default async function VerifyPage({ params }: PageProps) {
  const { controlNumber } = await params;
  const decoded = decodeURIComponent(controlNumber);

  if (!isValidControlNumberFormat(decoded)) {
    notFound();
  }

  const record = await verifyApprovedRecord(decoded);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 py-12">
        {record ? (
          <VerificationResult record={record} />
        ) : (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Record not found</AlertTitle>
            <AlertDescription>
              No approved record matches this control number. Please check the
              number and try again.
            </AlertDescription>
          </Alert>
        )}
        <ButtonLink href="/" variant="outline" className="mt-8">
          Back to verification
        </ButtonLink>
      </main>
    </>
  );
}
