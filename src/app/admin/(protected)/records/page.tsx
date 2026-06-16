import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { listRecords } from "@/features/records/services/record-service";
import { recordListQuerySchema } from "@/lib/validation/schemas";
import { RecordsFilters } from "@/features/records/components/records-filters";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export const metadata = {
  title: "Records",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "approved":
      return "default";
    case "pending_review":
      return "secondary";
    case "archived":
      return "outline";
    default:
      return "outline";
  }
}

async function RecordsTable({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const parsed = recordListQuerySchema.safeParse({
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    search: searchParams.search,
    status: searchParams.status,
    record_type: searchParams.record_type,
    category: searchParams.category,
  });

  const query = parsed.success
    ? parsed.data
    : recordListQuerySchema.parse({});

  const supabase = await createClient();
  const { records, total, page, totalPages } = await listRecords(
    supabase,
    query,
  );

  if (records.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No records found.</p>
        <ButtonLink href="/admin/records/new" className="mt-4">
          Create your first record
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Control Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <Link
                  href={`/admin/records/${record.id}`}
                  className="font-mono text-sm hover:underline"
                >
                  {record.control_number}
                </Link>
              </TableCell>
              <TableCell>{record.record_name ?? "—"}</TableCell>
              <TableCell>{record.organization ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(record.status)} className="capitalize">
                  {record.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(record.updated_at), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing page {page} of {totalPages} ({total} total)
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <ButtonLink
              variant="outline"
              size="sm"
              href={`/admin/records?${new URLSearchParams({
                ...Object.fromEntries(
                  Object.entries(searchParams).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? v[0] : (v ?? ""),
                  ]),
                ),
                page: String(page - 1),
              }).toString()}`}
            >
              Previous
            </ButtonLink>
          )}
          {page < totalPages && (
            <ButtonLink
              variant="outline"
              size="sm"
              href={`/admin/records?${new URLSearchParams({
                ...Object.fromEntries(
                  Object.entries(searchParams).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? v[0] : (v ?? ""),
                  ]),
                ),
                page: String(page + 1),
              }).toString()}`}
            >
              Next
            </ButtonLink>
          )}
        </div>
      </div>
    </>
  );
}

function TableSkeleton() {
  return <Skeleton className="h-64 w-full" />;
}

export default async function RecordsListPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Records</h1>
          <p className="mt-1 text-muted-foreground">
            Manage registry records
          </p>
        </div>
        <ButtonLink href="/admin/records/new">
          <Plus className="mr-2 h-4 w-4" />
          New Record
        </ButtonLink>
      </div>

      <div className="mt-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <RecordsFilters />
        </Suspense>
      </div>

      <div className="mt-6">
        <Suspense fallback={<TableSkeleton />}>
          <RecordsTable searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}
