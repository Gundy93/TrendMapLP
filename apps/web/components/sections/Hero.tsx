import { WordsCycler } from "./WordsCycler";
import { HeroCTA } from "./HeroCTA";

export function Hero() {
  return (
    <header className="px-6 sm:px-14 lg:px-32 pt-16 pb-12 text-center">
      <p className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-[10px] font-bold tracking-widest uppercase border border-zinc-200 rounded-full text-zinc-400">
        <span
          aria-hidden="true"
          className="w-1 h-1 bg-zinc-400 rounded-full animate-pulse"
        />
        Coming Soon
      </p>
      <h1 className="text-[32px] font-bold leading-[1.2] tracking-tight mb-6">
        &ldquo;<WordsCycler />&rdquo;에
        <br />
        괜한 돈 써서
        <br />
        <span className="text-zinc-900 underline decoration-zinc-200 decoration-4 underline-offset-4">
          텅장되지 말아요
        </span>{" "}
        🥲
      </h1>
      <p className="text-[15px] text-zinc-500 mb-10 leading-relaxed font-medium">
        인스타, 네이버 지도를 번갈아 켜지 않아도
        <br />
        위치와 실제 후기를 한 번에 확인하세요.
      </p>
      <HeroCTA />
    </header>
  );
}
