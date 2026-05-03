import Image from "next/image";
import { MapPin, MessageSquare, Heart } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "지도 기반 트렌드 랭킹",
    body: "실제 유저들의 검색어와 언급량을 데이터로 분석하여 지금 가장 핫한 메뉴를 실시간으로 보여드려요.",
    image: "/mockups/map-trend.png",
    alt: "지도 위에 현 위치와 트렌드 랭킹이 표시된 앱 화면",
  },
  {
    icon: MessageSquare,
    title: "솔직한 후기",
    body: "광고 없는 진짜 유저들의 목소리를 모았어요. 실패 없는 선택을 위해 보장된 곳만 골라가세요.",
    image: "/mockups/reviews.png",
    alt: "사용자 후기가 카드 목록으로 표시된 앱 화면",
  },
  {
    icon: Heart,
    title: "내 픽을 누군가 따라가요",
    body: "나만의 맛집 리스트가 누군가의 가이드가 됩니다. 내 추천이 공유되는 즐거움을 느껴보세요.",
    image: "/mockups/notification.png",
    alt: "내 픽을 누군가 따라갔다는 알림이 표시된 앱 화면",
  },
] as const;

export function Features() {
  return (
    <section
      aria-labelledby="features-title"
      className="py-20 px-6 sm:px-14 lg:px-32"
    >
      <header className="mb-16 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
          Features
        </p>
        <h2 id="features-title" className="text-2xl font-bold">
          이제 쉽게 서치하고 찾아가요
        </h2>
      </header>

      <ul className="space-y-24">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <li key={f.title} className="flex flex-col gap-8">
              <div className="relative bg-zinc-50 rounded-[40px] border-[6px] border-zinc-100 overflow-hidden shadow-sm aspect-[3/4]">
                <Image
                  src={f.image}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 393px) 100vw, 393px"
                  className="object-cover object-top"
                />
              </div>
              <div className="px-2">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Icon
                    size={20}
                    className="text-zinc-400"
                    aria-hidden="true"
                  />
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  {f.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
