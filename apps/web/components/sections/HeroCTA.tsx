"use client";

import { trackEvent } from "@/lib/track-client";

export function HeroCTA() {
  return (
    <a
      href="#signup"
      onClick={() => trackEvent("cta_click")}
      className="inline-flex w-full items-center justify-center py-4 bg-zinc-900 text-white rounded-2xl font-bold text-[15px] hover:bg-zinc-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
    >
      사전 알림 신청하기
    </a>
  );
}
