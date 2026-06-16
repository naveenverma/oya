import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: vi.fn(),
}));

import { createServiceClient } from "@/lib/supabase/service";
import { verifyApprovedRecord } from "@/features/verification/verify-service";

describe("verifyApprovedRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no approved record exists", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const limit = vi.fn().mockReturnValue({ maybeSingle });
    const eqStatus = vi.fn().mockReturnValue({ limit });
    const eqControl = vi.fn().mockReturnValue({ eq: eqStatus });
    const select = vi.fn().mockReturnValue({ eq: eqControl });
    const from = vi.fn().mockReturnValue({ select });

    vi.mocked(createServiceClient).mockReturnValue({
      from,
    } as never);

    const result = await verifyApprovedRecord("TEST-001");
    expect(result).toBeNull();
    expect(eqStatus).toHaveBeenCalledWith("status", "approved");
  });
});
