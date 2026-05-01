"use client";

import { useActionState, useRef } from "react";
import { submitSignup, type SignupResult } from "@/actions/signup";

const initial: SignupResult | null = null;

// M1 검증용 임시 폼. M2에서 정식 폼으로 교체.
export function DevSignupTester() {
  const [state, formAction, pending] = useActionState(submitSignup, initial);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-dashed border-zinc-400 p-4 text-sm dark:border-zinc-600"
    >
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        DEV-only signup tester (M2에서 정식 폼으로 대체)
      </p>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />
      <input type="hidden" name="elapsedMs" value="2000" readOnly />

      <label className="flex flex-col gap-1">
        <span>이메일</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded border px-3 py-2 dark:bg-black"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "전송 중…" : "테스트 신청"}
      </button>

      {state?.ok && (
        <p className="text-green-600">
          {state.alreadyRegistered
            ? "이미 등록된 이메일입니다."
            : "신청이 저장되었습니다."}
        </p>
      )}
      {state && !state.ok && (
        <p className="text-red-600">실패: {state.message}</p>
      )}
    </form>
  );
}
