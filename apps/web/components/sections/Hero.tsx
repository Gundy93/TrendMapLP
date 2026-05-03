export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 py-16 text-center"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
        모바일 앱 출시 예정
      </p>
      <h1
        id="hero-title"
        className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
      >
        지금 뜨는 트렌드를 한 장의 지도로.
      </h1>
      <p className="max-w-xl text-balance text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
        TrendMap이 출시되면 가장 먼저 알려드릴게요. 이메일만 남겨주시면 됩니다.
      </p>
      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
        <a
          href="#signup"
          className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black"
        >
          사전 알림 신청
        </a>
        <a
          href="#values"
          className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-base font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          어떤 서비스인가요?
        </a>
      </div>
    </section>
  );
}
