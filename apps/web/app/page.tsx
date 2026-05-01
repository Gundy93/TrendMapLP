import { DevSignupTester } from "@/components/DevSignupTester";

const isDev = process.env.NODE_ENV !== "production";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <section className="flex max-w-xl flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">TrendMapLP</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          사전 알림 신청 페이지 — UI 와이어프레임은 M2에서 도입됩니다.
        </p>
      </section>

      {isDev && <DevSignupTester />}
    </main>
  );
}
