"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recordFormSchema,
  type RecordFormValues,
} from "@/lib/validation/schemas";
import { RECORD_STATUSES } from "@/lib/security/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createRecordAction,
  updateRecordAction,
} from "@/features/records/actions";
import type { RegistryRecord } from "@/types";

interface RecordFormProps {
  record?: RegistryRecord;
  mode: "create" | "edit";
}

const defaultValues: RecordFormValues = {
  control_number: "",
  record_name: "",
  organization: "",
  record_type: "",
  category: "",
  status: "draft",
  issue_date: "",
  expiration_date: "",
  verification_status: "",
  description: "",
  country: "",
  region: "",
  reference_number: "",
  contact_information: "",
  notes: "",
};

function recordToFormValues(record: RegistryRecord): RecordFormValues {
  return {
    control_number: record.control_number,
    record_name: record.record_name ?? "",
    organization: record.organization ?? "",
    record_type: record.record_type ?? "",
    category: record.category ?? "",
    status: record.status,
    issue_date: record.issue_date ?? "",
    expiration_date: record.expiration_date ?? "",
    verification_status: record.verification_status ?? "",
    description: record.description ?? "",
    country: record.country ?? "",
    region: record.region ?? "",
    reference_number: record.reference_number ?? "",
    contact_information: record.contact_information ?? "",
    notes: record.notes ?? "",
  };
}

export function RecordForm({ record, mode }: RecordFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: record ? recordToFormValues(record) : defaultValues,
  });

  const status = watch("status");

  const onSubmit = async (values: RecordFormValues) => {
    if (mode === "create") {
      const result = await createRecordAction(values);
      if (!result.success) {
        toast.error(result.error ?? "Failed to create record");
        return;
      }
      toast.success("Record created");
      router.push(`/admin/records/${result.data?.id}`);
      return;
    }

    if (!record) return;
    const result = await updateRecordAction(
      record.id,
      values,
      record.status,
    );
    if (!result.success) {
      toast.error(result.error ?? "Failed to update record");
      return;
    }
    toast.success("Record updated");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="control_number">Control Number *</Label>
          <Input id="control_number" {...register("control_number")} />
          {errors.control_number && (
            <p className="text-sm text-destructive">
              {errors.control_number.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="record_name">Record Name *</Label>
          <Input id="record_name" {...register("record_name")} />
          {errors.record_name && (
            <p className="text-sm text-destructive">
              {errors.record_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input id="organization" {...register("organization")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="record_type">Record Type</Label>
          <Input id="record_type" {...register("record_type")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(v) =>
              setValue("status", v as RecordFormValues["status"])
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {RECORD_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input id="issue_date" type="date" {...register("issue_date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiration_date">Expiration Date</Label>
          <Input
            id="expiration_date"
            type="date"
            {...register("expiration_date")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="verification_status">Verification Status</Label>
          <Input
            id="verification_status"
            {...register("verification_status")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input id="region" {...register("region")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference_number">Reference Number</Label>
          <Input id="reference_number" {...register("reference_number")} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact_information">Contact Information</Label>
          <Input
            id="contact_information"
            {...register("contact_information")}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes (internal)</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? "Create Record" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/records")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
