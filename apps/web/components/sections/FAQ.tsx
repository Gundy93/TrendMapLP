const items = [
  {
    q: "출시는 언제인가요?",
    a: "정확한 출시일은 아직 미정이며, 사전 알림 신청자에게 가장 먼저 안내드립니다.",
  },
  {
    q: "어떤 정보가 수집되나요?",
    a: "이메일 주소와 유입 경로(UTM)·기기 종류만 저장하며, 추가 개인정보는 받지 않습니다.",
  },
  {
    q: "신청을 취소하고 싶어요.",
    a: "출시 알림 메일 하단의 안내 링크에서 1회 클릭으로 해지할 수 있습니다.",
  },
  {
    q: "안내 메일은 언제 도착하나요?",
    a: "사전 알림 신청은 즉시 접수되며, 출시 직전과 출시 당일 두 차례 안내 메일이 발송될 예정입니다.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="px-6 py-20"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center">
          <h2
            id="faq-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            자주 묻는 질문
          </h2>
        </header>
        <ul className="flex flex-col gap-3">
          {items.map((it) => (
            <li
              key={it.q}
              className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black [&::-webkit-details-marker]:hidden">
                  <span>{it.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-zinc-400 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {it.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
