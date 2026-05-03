"use server";

import { signupInputSchema } from "@trendmaplp/validation";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";
import { detectDeviceType, getOrCreateVisitorId, getRequestContext } from "@/lib/track";

const MIN_FORM_DWELL_MS = 1500;

export type SignupResult =
  | { ok: true; alreadyRegistered?: boolean }
  | {
      ok: false;
      code: "invalid" | "rate_limited" | "bot_detected" | "server_error";
      message: string;
    };

export async function submitSignup(
  _prevState: SignupResult | null,
  formData: FormData,
): Promise<SignupResult> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    website: String(formData.get("website") ?? ""),
    elapsedMs: Number(formData.get("elapsedMs") ?? 0),
    turnstileToken: (() => {
      const v = formData.get("turnstileToken");
      return v ? String(v) : undefined;
    })(),
    utm: {
      source: optionalString(formData.get("utm_source")),
      medium: optionalString(formData.get("utm_medium")),
      campaign: optionalString(formData.get("utm_campaign")),
      content: optionalString(formData.get("utm_content")),
    },
  };

  const parsed = signupInputSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }
  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    return { ok: false, code: "bot_detected", message: "잘못된 요청입니다." };
  }
  if (data.elapsedMs < MIN_FORM_DWELL_MS) {
    return { ok: false, code: "bot_detected", message: "잠시 후 다시 시도해주세요." };
  }

  const ctx = await getRequestContext();

  const rl = await checkRateLimit(`signup:${ctx.ip}`);
  if (!rl.ok) {
    return {
      ok: false,
      code: "rate_limited",
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  const ts = await verifyTurnstileToken(data.turnstileToken, ctx.ip);
  if (!ts.ok) {
    return { ok: false, code: "bot_detected", message: "인증에 실패했습니다." };
  }

  const deviceType = detectDeviceType(ctx.userAgent);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("signups").insert({
    email: data.email,
    source: data.utm?.source ?? "direct",
    utm_medium: data.utm?.medium ?? null,
    utm_campaign: data.utm?.campaign ?? null,
    utm_content: data.utm?.content ?? null,
    device_type: deviceType,
    user_agent: ctx.userAgent ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, alreadyRegistered: true };
    }
    console.error("[signup] insert failed", error);
    return {
      ok: false,
      code: "server_error",
      message: "잠시 후 다시 시도해주세요.",
    };
  }

  // funnel telemetry — best effort, 실패해도 사용자에게 노출하지 않음.
  // RFC 6761 .test TLD(예: e2e+{uuid}@trendmaplp.test)는 테스트 전용이므로
  // PMF 분석에서 제외해 v_funnel_daily.signups_count에 노이즈가 안 섞이도록 함.
  if (!data.email.endsWith(".test")) {
    try {
      const visitorId = await getOrCreateVisitorId();
      await supabase.from("page_events").insert({
        event_type: "form_submit_success",
        visitor_id: visitorId,
        utm_source: data.utm?.source ?? null,
        utm_medium: data.utm?.medium ?? null,
        utm_campaign: data.utm?.campaign ?? null,
        utm_content: data.utm?.content ?? null,
        device_type: deviceType,
      });
    } catch (err) {
      console.warn("[signup] funnel event log failed", err);
    }
  }

  return { ok: true };
}

function optionalString(v: FormDataEntryValue | null): string | undefined {
  if (v === null) return undefined;
  const s = String(v).trim();
  return s.length > 0 ? s : undefined;
}
