"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteRecordAction } from "@/features/records/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteRecordButton({ recordId }: { recordId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteRecordAction(recordId);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete");
      return;
    }

    toast.success("Record deleted");
    router.push("/admin/records");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The record and its attachments will
            be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
