import type { PublicRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, ExternalLink } from "lucide-react";

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMMM d, yyyy");
  } catch {
    return value;
  }
}

export function VerificationResult({ record }: { record: PublicRecord }) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">
              {record.record_name ?? "Registry Record"}
            </CardTitle>
            <CardDescription className="mt-1">
              {record.organization ?? "—"}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">
            {record.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Type</dt>
            <dd className="mt-1">{record.record_type ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Category
            </dt>
            <dd className="mt-1">{record.category ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Issue Date
            </dt>
            <dd className="mt-1">{formatDate(record.issue_date)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Expiration Date
            </dt>
            <dd className="mt-1">{formatDate(record.expiration_date)}</dd>
          </div>
          {record.country && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Country
              </dt>
              <dd className="mt-1">{record.country}</dd>
            </div>
          )}
          {record.region && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Region
              </dt>
              <dd className="mt-1">{record.region}</dd>
            </div>
          )}
        </dl>

        {record.description && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="mt-1 text-sm leading-relaxed">{record.description}</p>
          </div>
        )}

        {record.attachments.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Attachments
            </h3>
            <ul className="space-y-2">
              {record.attachments.map((attachment) => (
                <li key={attachment.label}>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    {attachment.label}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
