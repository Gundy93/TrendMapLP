import { NextResponse } from "next/server";
import { eventInputSchema } from "@trendmaplp/validation";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import {
  detectDeviceType,
  getOrCreateVisitorId,
  getRequestContext,
} from "@/lib/track";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = eventInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 클라이언트는 visitorId를 보내지 않는다. 서버가 httpOnly cookie로 결정.
  const visitorId = data.visitorId ?? (await getOrCreateVisitorId());

  // deviceType도 클라가 보내지 않으면 서버 UA로 보강.
  let deviceType = data.deviceType;
  if (!deviceType) {
    const ctx = await getRequestContext();
    deviceType = detectDeviceType(ctx.userAgent);
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("page_events").insert({
    event_type: data.eventType,
    visitor_id: visitorId,
    session_id: data.sessionId ?? null,
    referrer: data.referrer ?? null,
    utm_source: data.utm?.source ?? null,
    utm_medium: data.utm?.medium ?? null,
    utm_campaign: data.utm?.campaign ?? null,
    utm_content: data.utm?.content ?? null,
    device_type: deviceType ?? null,
  });

  if (error) {
    console.error("[/api/event] insert failed", error);
    return NextResponse.json(
      { ok: false, code: "server_error" },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
