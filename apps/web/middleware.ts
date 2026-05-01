import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

// 정적 prerender / 자산은 통과시키고, 이벤트 수집 엔드포인트만 보호.
// Server Action 자체는 actions/signup.ts 내부에서 2차 rate-limit 호출.
export const config = {
  matcher: ["/api/event"],
};

export async function middleware(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const r = await checkRateLimit(`event:${ip}`);
  if (!r.ok) {
    const retryAfter = Math.max(1, Math.ceil((r.reset - Date.now()) / 1000));
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "retry-after": String(retryAfter) },
    });
  }
  return NextResponse.next();
}
