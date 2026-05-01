# ADR-0001: 기술 스택 — Next.js 15 + Supabase + Vercel + pnpm/Turborepo

- **Status**: Accepted
- **Date**: 2026-05-02
- **Decider(s)**: Gundy

## 1. 의사결정 요약

랜딩 페이지 + PMF 계측 + 향후 admin 확장 가능성을 모두 만족하는 무료 티어 스택으로 **Next.js 15 (App Router) + Tailwind v4 + Supabase + Vercel + pnpm + Turborepo**를 채택한다.

## 2. 옵션 비교

### Option A: Astro + React Islands + Supabase + Vercel
- 장점: 완전 정적 + Islands hydration → 모바일 LCP 최강.
- 단점: 폼 제출 서버 로직은 Astro endpoint/Edge Function 필요. admin 등 향후 React 풀 활용 확장 시 마이그레이션 비용.
- 비용·복잡도: 무료. 학습 비용 약간 있음.

### Option B: Next.js 15 (App Router) + Supabase + Vercel  ← 선택
- 장점: Vercel 1급 시민, Server Actions로 폼 서버 처리 깔끔(서비스 키 노출 0), `force-static`로 랜딩 prerender 가능, admin/A/B 변형/메일 송신 등 확장 자연스러움, React 생태계 풀 활용.
- 단점: Astro 대비 클라이언트 번들 약간 무거움(랜딩 페이지에서는 hydration 최소화로 관리 가능).
- 비용·복잡도: 무료. 가장 표준적인 경로.

### Option C: SvelteKit + Supabase + Vercel
- 장점: 번들 가볍고 빠름.
- 단점: 사용자 React 선호와 충돌. 향후 협업·라이브러리 풀 좁음.
- 비용·복잡도: 무료. 학습·생태계 비용 큼.

## 3. 선택 근거

**선택: Option B (Next.js 15)**

근거:
- **사용자 명시 React 선호**, 향후 admin/메일 송신/A/B 변형 가능성 → React + App Router의 확장성이 결정적.
- **퍼블릭 저장소 + 시크릿 노출 위험**이 1순위 제약 → Server Action 한 곳에서 service role을 사용하므로 클라이언트 번들에 키 누설될 표면이 0.
- **Vercel 무료 hobby + Web Analytics 무료** → 비용 제약 충족.
- LCP 페널티는 정적 prerender + 최소 hydration으로 실측 90+ 가능. 실측 부족 시 랜딩만 Astro로 분리하는 옵션을 보존.

부속 결정:
- **패키지 매니저**: pnpm 9.x (디스크 효율, workspaces 표준).
- **모노레포 도구**: Turborepo (Vercel 메인테이너, 학습 곡선 낮음).
- **스타일**: Tailwind v4 (와이어프레임 양산 적합).
- **폼 검증**: Zod (클라이언트/서버 동일 스키마). RHF는 필드 늘어나면 도입.
- **분석**: Vercel Web Analytics(진입자) + Supabase 직접 카운트(신청자) 하이브리드.

## 4. 위험·전제

**위험**:
- Vercel/Supabase 무료 티어 한도 초과 시 비용 발생. 일 트래픽 1k~10k 가정 내에서는 안전.
- Server Actions는 POST 요청 전용이라 GET 캐싱 전략 별도. 랜딩은 정적 prerender로 회피.
- Tailwind v4는 정식 출시 직후 단계. minor 패치 호환성 주의.

**전제**:
- 이메일 외 추가 PII(이름·전화)는 수집하지 않음.
- 트래픽 규모 일 1k~10k.
- 초기 도메인은 `*.vercel.app` 사용 가능.

**전제 깨짐 신호**:
- Supabase egress가 무료 한도(2GB/mo)에 근접 → row 누적 차원에서 `page_events` retention 정책 도입.
- LCP가 모바일 실측에서 2.5s 초과 지속 → 랜딩만 Astro 분리 검토.
- 협업자가 2명 이상 → standard 프로필 승격 검토(`docs/profile-selection.md`).

## 5. 후속 액션

- [x] M0 — 모노레포 스캐폴드 (이 ADR과 동시에 진행).
- [ ] M1 — DB 스키마 + Server Action + 봇 방어 (issue #2).
- [ ] M2 — UI 와이어프레임 (issue #3).
- [ ] M3 — 디자인 적용 (issue #4).
- [ ] M4 — 운영·관측 마감 (issue #5).
