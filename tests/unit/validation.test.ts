import { describe, it, expect } from "vitest";
import {
  normalizeControlNumber,
  isValidControlNumberFormat,
} from "@/lib/security/sanitize";
import { controlNumberSchema } from "@/lib/validation/schemas";
import { toPublicRecord } from "@/features/verification/verify-service";
import type { RegistryRecord } from "@/types";

describe("normalizeControlNumber", () => {
  it("trims and uppercases", () => {
    expect(normalizeControlNumber("  abc-123  ")).toBe("ABC-123");
  });
});

describe("isValidControlNumberFormat", () => {
  it("accepts valid formats", () => {
    expect(isValidControlNumberFormat("REG-2024-001")).toBe(true);
    expect(isValidControlNumberFormat("A1_B2/C3")).toBe(true);
  });

  it("rejects invalid formats", () => {
    expect(isValidControlNumberFormat("")).toBe(false);
    expect(isValidControlNumberFormat("invalid spaces")).toBe(false);
    expect(isValidControlNumberFormat("-starts-with-dash")).toBe(false);
  });
});

describe("controlNumberSchema", () => {
  it("normalizes on parse", () => {
    const result = controlNumberSchema.safeParse("  test-001  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("TEST-001");
    }
  });
});

describe("toPublicRecord", () => {
  const baseRecord: RegistryRecord = {
    id: "uuid-should-not-appear",
    control_number: "TEST-001",
    record_name: "Test Record",
    organization: "Org",
    record_type: "License",
    category: "A",
    status: "approved",
    issue_date: "2024-01-01",
    expiration_date: "2025-01-01",
    verification_status: "verified",
    description: "Desc",
    country: "US",
    region: "CA",
    reference_number: "REF-SECRET",
    contact_information: "secret@example.com",
    notes: "internal notes",
    attachment_1: null,
    attachment_2: null,
    attachment_3: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: "user-id",
  };

  it("strips sensitive fields from public view", () => {
    const publicRecord = toPublicRecord(baseRecord, []);
    expect(publicRecord).not.toHaveProperty("id");
    expect(publicRecord).not.toHaveProperty("notes");
    expect(publicRecord).not.toHaveProperty("reference_number");
    expect(publicRecord).not.toHaveProperty("contact_information");
    expect(publicRecord.record_name).toBe("Test Record");
  });
});
