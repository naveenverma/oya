import { describe, it, expect } from "vitest";
import { isProductionRateLimit } from "@/lib/rate-limit";

describe("isProductionRateLimit", () => {
  it("returns false in development without upstash", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    expect(isProductionRateLimit()).toBe(false);
    process.env.NODE_ENV = originalEnv;
  });

  it("returns true in production with upstash configured", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
    expect(isProductionRateLimit()).toBe(true);
    process.env.NODE_ENV = originalEnv;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });
});
