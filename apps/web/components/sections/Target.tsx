const items = [
  { q: "맛있다는 두쫀쿠를 샀는데", a: "밤티 두쫀쿠를 먹었어요" },
  { q: "좋은 퀄리티의 말랑이를 위해", a: "오랫동안 서치했어요" },
  { q: "알고보니 맛있는 우베케이크 파는 곳은", a: "따로 있는데 몰랐어요" },
];

export function Target() {
  return (
    <section
      aria-labelledby="target-title"
      className="py-16 bg-zinc-50 px-6 sm:px-14 lg:px-32"
    >
      <div className="mb-10">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
          Target
        </p>
        <h2 id="target-title" className="text-2xl font-bold">
          이런 분들께 강력 추천해요
        </h2>
      </div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li
            key={item.a}
            className="bg-white p-6 rounded-[24px] border border-zinc-100 flex gap-4 items-start"
          >
            <span
              aria-hidden="true"
              className="min-w-[24px] h-[24px] bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
            >
              0{i + 1}
            </span>
            <p className="text-[14px] text-zinc-600 leading-snug font-medium">
              <span className="text-zinc-300">&ldquo;{item.q}&rdquo;</span>
              <br />
              <span className="text-zinc-900">{item.a}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
