import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkVerifyRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security/sanitize";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/verify") {
    const ip = getClientIp(request.headers);
    try {
      const result = await checkVerifyRateLimit(ip);
      if (!result.success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(
                Math.ceil((result.reset - Date.now()) / 1000),
              ),
              "X-RateLimit-Limit": String(result.limit),
              "X-RateLimit-Remaining": String(result.remaining),
            },
          },
        );
      }
    } catch {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Service temporarily unavailable" },
          { status: 503 },
        );
      }
    }
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/verify"],
};
