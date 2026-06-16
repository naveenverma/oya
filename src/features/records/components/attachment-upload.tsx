"use client";

import { useRef, useState } from "react";
import { uploadAttachmentAction } from "@/features/records/actions";
import { validateAttachmentFile } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";

interface AttachmentUploadProps {
  recordId: string;
  slot: 1 | 2 | 3;
  currentPath?: string | null;
  previewUrl?: string | null;
}

export function AttachmentUpload({
  recordId,
  slot,
  currentPath,
  previewUrl,
}: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    const error = validateAttachmentFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAttachmentAction(recordId, slot, formData);
    setUploading(false);

    if (!result.success) {
      toast.error(result.error ?? "Upload failed");
      return;
    }

    toast.success("Attachment uploaded");
    window.location.reload();
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Label>Attachment {slot}</Label>
      {currentPath && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="truncate">{currentPath.split("/").pop()}</span>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Preview
            </a>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading…" : currentPath ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}
