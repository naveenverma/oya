import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { VERIFY_RATE_LIMIT } from "@/lib/security/constants";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
}

class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = 60_000;
    const entry = this.hits.get(identifier);

    if (!entry || entry.resetAt <= now) {
      this.hits.set(identifier, { count: 1, resetAt: now + windowMs });
      return {
        success: true,
        limit: VERIFY_RATE_LIMIT.requests,
        remaining: VERIFY_RATE_LIMIT.requests - 1,
        reset: now + windowMs,
      };
    }

    if (entry.count >= VERIFY_RATE_LIMIT.requests) {
      return {
        success: false,
        limit: VERIFY_RATE_LIMIT.requests,
        remaining: 0,
        reset: entry.resetAt,
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit: VERIFY_RATE_LIMIT.requests,
      remaining: VERIFY_RATE_LIMIT.requests - entry.count,
      reset: entry.resetAt,
    };
  }
}

let memoryLimiter: MemoryRateLimiter | null = null;
let upstashLimiter: Ratelimit | null = null;

function getUpstashLimiter(): Ratelimit {
  if (!upstashLimiter) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("Upstash Redis is required in production for rate limiting");
    }
    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(
        VERIFY_RATE_LIMIT.requests,
        VERIFY_RATE_LIMIT.window,
      ),
      prefix: "oya:verify",
    });
  }
  return upstashLimiter;
}

function getMemoryLimiter(): MemoryRateLimiter {
  if (!memoryLimiter) {
    memoryLimiter = new MemoryRateLimiter();
  }
  return memoryLimiter;
}

export function isProductionRateLimit(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

export async function checkVerifyRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  if (isProductionRateLimit()) {
    const result = await getUpstashLimiter().limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  return getMemoryLimiter().limit(identifier);
}
