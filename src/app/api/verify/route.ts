import { NextResponse } from "next/server";
import { verifyQuerySchema } from "@/lib/validation/schemas";
import { verifyApprovedRecord } from "@/features/verification/verify-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = verifyQuerySchema.safeParse({
    controlNumber: searchParams.get("controlNumber") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { found: false, error: "Invalid control number" },
      { status: 404 },
    );
  }

  const record = await verifyApprovedRecord(parsed.data.controlNumber);

  if (!record) {
    return NextResponse.json(
      { found: false, error: "Record not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ found: true, record });
}
