export function Demo() {
  return (
    <section
      id="demo"
      aria-labelledby="demo-title"
      className="bg-zinc-50 px-6 py-20 dark:bg-zinc-950"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center">
          <h2
            id="demo-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            이렇게 보입니다
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            출시 전이라 디자인 시안은 곧 업데이트됩니다.
          </p>
        </header>
        <div
          role="img"
          aria-label="앱 화면 미리보기 자리표시자"
          className="relative mx-auto flex aspect-[9/16] w-full max-w-xs items-center justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800"
        >
          <span className="text-sm uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            preview placeholder
          </span>
        </div>
      </div>
    </section>
  );
}
