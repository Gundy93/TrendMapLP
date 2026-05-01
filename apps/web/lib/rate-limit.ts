import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: false,
    prefix: "tmlp:rl",
  });
  return limiter;
}

export type RateLimitResult =
  | { ok: true; skipped?: boolean; remaining?: number }
  | { ok: false; reason: "rate-limited"; reset: number };

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const rl = getLimiter();
  if (!rl) {
    console.warn("[rate-limit] Upstash not configured — skip mode");
    return { ok: true, skipped: true };
  }
  const r = await rl.limit(identifier);
  if (r.success) return { ok: true, remaining: r.remaining };
  return { ok: false, reason: "rate-limited", reset: r.reset };
}
