"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { controlNumberSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const formSchema = z.object({ controlNumber: controlNumberSchema });
type FormValues = z.infer<typeof formSchema>;

export function VerificationForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    router.push(`/verify/${encodeURIComponent(data.controlNumber)}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4 sm:flex-row"
      aria-label="Verify registry record"
    >
      <div className="flex-1 space-y-2">
        <Label htmlFor="controlNumber" className="sr-only">
          Control Number
        </Label>
        <Input
          id="controlNumber"
          placeholder="Enter Control Number"
          autoComplete="off"
          aria-invalid={Boolean(errors.controlNumber)}
          aria-describedby={
            errors.controlNumber ? "controlNumber-error" : undefined
          }
          {...register("controlNumber")}
        />
        {errors.controlNumber && (
          <p
            id="controlNumber-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.controlNumber.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
        <Search className="mr-2 h-4 w-4" aria-hidden />
        Verify
      </Button>
    </form>
  );
}
