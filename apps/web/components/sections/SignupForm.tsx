"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Script from "next/script";
import { Mail, CheckCircle2 } from "lucide-react";
import { submitSignup, type SignupResult } from "@/actions/signup";

const initial: SignupResult | null = null;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    __onTurnstileSuccess?: (token: string) => void;
  }
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(submitSignup, initial);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const elapsedRef = useRef<HTMLInputElement>(null);
  const utmRef = useRef<{
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  }>({});
  const mountedAt = useRef(0);
  const emailId = useId();
  const errorId = useId();

  useEffect(() => {
    mountedAt.current = Date.now();
    try {
      const sp = new URLSearchParams(window.location.search);
      utmRef.current = {
        source: sp.get("utm_source") ?? undefined,
        medium: sp.get("utm_medium") ?? undefined,
        campaign: sp.get("utm_campaign") ?? undefined,
        content: sp.get("utm_content") ?? undefined,
      };
    } catch {
      // SSR/edge-case 가드
    }
  }, []);

  useEffect(() => {
    window.__onTurnstileSuccess = (token: string) => setTurnstileToken(token);
    return () => {
      window.__onTurnstileSuccess = undefined;
    };
  }, []);

  const trimmed = email.trim();
  const clientValid = useMemo(() => EMAIL_RE.test(trimmed), [trimmed]);
  const showInlineError = touched && trimmed.length > 0 && !clientValid;

  const success = state?.ok && !state.alreadyRegistered;
  const alreadyRegistered = state?.ok && state.alreadyRegistered;

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}
      <section
        id="signup"
        aria-labelledby="signup-title"
        className="py-24 px-6 sm:px-14 lg:px-32 text-center bg-zinc-900 text-white"
      >
        <div
          aria-hidden="true"
          className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-700"
        >
          <Mail size={24} />
        </div>
        <h2 id="signup-title" className="text-2xl font-bold mb-4 text-white">
          출시 알림 받기
        </h2>
        <p className="text-[14px] text-zinc-400 mb-10 leading-relaxed font-medium">
          얼리버드 가입자에게만 드리는
          <br />
          특별한 혜택을 놓치지 마세요!
        </p>

        <form
          action={(fd) => {
            const elapsed = mountedAt.current
              ? Date.now() - mountedAt.current
              : 0;
            if (elapsedRef.current) {
              elapsedRef.current.value = String(elapsed);
              fd.set("elapsedMs", String(elapsed));
            }
            const utm = utmRef.current;
            if (utm.source) fd.set("utm_source", utm.source);
            if (utm.medium) fd.set("utm_medium", utm.medium);
            if (utm.campaign) fd.set("utm_campaign", utm.campaign);
            if (utm.content) fd.set("utm_content", utm.content);
            if (turnstileToken) fd.set("turnstileToken", turnstileToken);
            formAction(fd);
          }}
          noValidate
          className="space-y-3"
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute h-0 w-0 opacity-0"
          />
          <input
            ref={elapsedRef}
            type="hidden"
            name="elapsedMs"
            defaultValue="0"
          />

          <label htmlFor={emailId} className="sr-only">
            이메일 주소
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showInlineError || undefined}
            aria-describedby={showInlineError ? errorId : undefined}
            className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white text-sm text-white placeholder:text-zinc-500"
          />

          {TURNSTILE_SITE_KEY && (
            <div
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="__onTurnstileSuccess"
              data-size="invisible"
            />
          )}

          <button
            type="submit"
            disabled={!clientValid || pending}
            className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold text-[15px] shadow-lg transition-all enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {pending ? "전송 중…" : "사전 신청하기"}
          </button>

          {showInlineError && (
            <p id={errorId} className="text-sm text-red-400 text-left">
              올바른 이메일 형식이 아닙니다.
            </p>
          )}
        </form>

        <div
          role="status"
          aria-live="polite"
          className="mt-6 min-h-[1.5rem] text-sm"
        >
          {success && (
            <p className="flex items-center justify-center gap-2 text-white font-bold">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>신청되었습니다. 곧 만나요!</span>
            </p>
          )}
          {alreadyRegistered && (
            <p className="text-zinc-300">
              이미 등록된 이메일입니다. 출시되면 가장 먼저 알려드릴게요.
            </p>
          )}
          {state && !state.ok && (
            <p className="text-red-400">{state.message}</p>
          )}
        </div>

        <p className="mt-8 text-[11px] text-zinc-500">
          신청 시 개인정보 처리방침 및 이메일 수신에 동의하는 것으로 간주됩니다.
        </p>
      </section>
    </>
  );
}
