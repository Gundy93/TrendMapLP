import "server-only";
import { env, isProduction } from "./env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; reason: string };

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isProduction) {
      console.error("[turnstile] TURNSTILE_SECRET_KEY missing in production");
      return { ok: false, reason: "turnstile-not-configured" };
    }
    console.warn("[turnstile] secret missing — skip mode (non-production)");
    return { ok: true, skipped: true };
  }
  if (!token) return { ok: false, reason: "turnstile-token-missing" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    if (!res.ok) return { ok: false, reason: `turnstile-http-${res.status}` };
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return { ok: true };
    return {
      ok: false,
      reason: `turnstile-fail-${(data["error-codes"] ?? []).join(",")}`,
    };
  } catch (err) {
    return {
      ok: false,
      reason: `turnstile-error-${(err as Error).message}`,
    };
  }
}
