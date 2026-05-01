import { NextResponse } from "next/server";
import { eventInputSchema } from "@trendmaplp/validation";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }

  const parsed = eventInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("page_events").insert({
    event_type: data.eventType,
    visitor_id: data.visitorId,
    session_id: data.sessionId ?? null,
    referrer: data.referrer ?? null,
    utm_source: data.utm?.source ?? null,
    utm_medium: data.utm?.medium ?? null,
    utm_campaign: data.utm?.campaign ?? null,
    utm_content: data.utm?.content ?? null,
    device_type: data.deviceType ?? null,
  });

  if (error) {
    console.error("[/api/event] insert failed", error);
    return NextResponse.json({ ok: false, code: "server_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
