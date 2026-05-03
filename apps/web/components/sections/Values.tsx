const values = [
  {
    title: "한눈에 보는 트렌드 지도",
    body: "흩어진 SNS·뉴스·커뮤니티의 흐름을 하나의 시각화로 모아 보여줍니다.",
  },
  {
    title: "실시간 변화 감지",
    body: "급상승 키워드를 자동으로 잡아내고, 의미 있는 변곡점만 알려드립니다.",
  },
  {
    title: "내가 정한 관심 영역",
    body: "팔로우한 주제·산업만 큐레이션해 정보 과잉 없이 필요한 것만 봅니다.",
  },
];

export function Values() {
  return (
    <section
      id="values"
      aria-labelledby="values-title"
      className="px-6 py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="flex flex-col gap-3 text-center">
          <h2
            id="values-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            왜 TrendMap인가요?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            정보가 많을수록, 정리된 시야가 필요합니다.
          </p>
        </header>
        <ul className="grid gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <li
              key={v.title}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {v.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
