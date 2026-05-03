// 클라이언트 전용 PMF 트래킹 헬퍼.
// 자동화(Playwright/Selenium 등)는 navigator.webdriver/UA로 감지해 즉시 skip → page_events에 노이즈가 섞이지 않음.
// fire-and-forget: 실패는 무시(PMF 측정은 보조 신호이며 사용자 경험에 영향 X).

const BOT_UA_RE = /HeadlessChrome|PhantomJS|Selenium|webdriver/i;

function isAutomation(): boolean {
  if (typeof navigator === "undefined") return false;
  if (navigator.webdriver) return true;
  if (BOT_UA_RE.test(navigator.userAgent)) return true;
  return false;
}

function readUtm() {
  if (typeof window === "undefined") return undefined;
  try {
    const sp = new URLSearchParams(window.location.search);
    const utm = {
      source: sp.get("utm_source") ?? undefined,
      medium: sp.get("utm_medium") ?? undefined,
      campaign: sp.get("utm_campaign") ?? undefined,
      content: sp.get("utm_content") ?? undefined,
    };
    return utm.source || utm.medium || utm.campaign || utm.content
      ? utm
      : undefined;
  } catch {
    return undefined;
  }
}

export type TrackableEvent = "page_view" | "cta_click";

export function trackEvent(eventType: TrackableEvent): void {
  if (typeof window === "undefined") return;
  if (isAutomation()) return;

  const body = JSON.stringify({
    eventType,
    referrer: document.referrer || undefined,
    utm: readUtm(),
  });

  void fetch("/api/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // PMF 측정은 보조 — 네트워크 실패해도 사용자에게 노출하지 않음
  });
}
