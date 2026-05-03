"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { submitSignup, type SignupResult } from "@/actions/signup";

const initial: SignupResult | null = null;

// 이메일 형식 1차 검사 — 서버는 Zod로 다시 검증한다.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const [state, formAction, pending] = useActionState(submitSignup, initial);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const elapsedRef = useRef<HTMLInputElement>(null);
  const utmRef = useRef<{
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  }>({});
  const mountedAt = useRef<number>(0);
  const emailId = useId();
  const errorId = useId();
  const statusId = useId();

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
      // URL 접근 불가 환경(SSR 안전 가드) — 무시
    }
  }, []);

  const trimmed = email.trim();
  const clientValid = useMemo(() => EMAIL_RE.test(trimmed), [trimmed]);
  const showInlineError = touched && trimmed.length > 0 && !clientValid;

  return (
    <section
      id="signup"
      aria-labelledby="signup-title"
      className="bg-zinc-50 px-6 py-20 dark:bg-zinc-950"
    >
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <header className="flex flex-col gap-3 text-center">
          <h2
            id="signup-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            출시되면 알려드릴게요
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            이메일 주소만 남겨주세요. 광고나 스팸은 보내지 않습니다.
          </p>
        </header>

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
            formAction(fd);
          }}
          noValidate
          className="flex flex-col gap-3"
        >
          {/* honeypot — 화면 밖, 스크린리더 무시 */}
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={emailId}
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showInlineError || undefined}
              aria-describedby={showInlineError ? errorId : undefined}
              className="h-12 flex-1 rounded-full border border-zinc-300 bg-white px-5 text-base outline-none placeholder:text-zinc-400 focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:border-white dark:focus-visible:ring-white"
            />
            <button
              type="submit"
              disabled={!clientValid || pending}
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-base font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black"
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  전송 중…
                </span>
              ) : (
                "사전 알림 신청"
              )}
            </button>
          </div>

          {showInlineError && (
            <p id={errorId} className="text-sm text-red-600">
              올바른 이메일 형식이 아닙니다.
            </p>
          )}

          <div
            id={statusId}
            role="status"
            aria-live="polite"
            className="min-h-[1.25rem] text-sm"
          >
            {state?.ok && state.alreadyRegistered && (
              <span className="text-zinc-600 dark:text-zinc-300">
                이미 등록된 이메일입니다. 출시되면 가장 먼저 알려드릴게요.
              </span>
            )}
            {state?.ok && !state.alreadyRegistered && (
              <span className="text-green-600">
                신청이 완료되었습니다. 출시 소식을 메일로 보내드릴게요.
              </span>
            )}
            {state && !state.ok && (
              <span className="text-red-600">{state.message}</span>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-zinc-500">
          신청 시 개인정보 처리방침 및 이메일 수신에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
