import "server-only";
import { cookies, headers } from "next/headers";
import type { DeviceType, UTM } from "@trendmaplp/validation";

const VISITOR_COOKIE = "tmlp_vid";
const VISITOR_TTL_SECONDS = 60 * 60 * 24 * 365;

export async function getOrCreateVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  jar.set(VISITOR_COOKIE, id, {
    maxAge: VISITOR_TTL_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return id;
}

export function detectDeviceType(userAgent: string | null | undefined): DeviceType {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(ua)) return "mobile";
  return "desktop";
}

export function parseUtmFromUrl(href: string | undefined | null): UTM {
  if (!href) return {};
  try {
    const url = new URL(href);
    const get = (k: string) => url.searchParams.get(k) ?? undefined;
    return {
      source: get("utm_source"),
      medium: get("utm_medium"),
      campaign: get("utm_campaign"),
      content: get("utm_content"),
    };
  } catch {
    return {};
  }
}

export async function getRequestContext() {
  const h = await headers();
  return {
    userAgent: h.get("user-agent") ?? undefined,
    referrer: h.get("referer") ?? undefined,
    ip:
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      "unknown",
  };
}
