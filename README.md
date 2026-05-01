# TrendMapLP

트렌드맵 모바일 앱의 PMF(Product-Market Fit) 사전 검증용 랜딩 페이지 모노레포.

SNS 광고로 유입되는 모바일 사용자에게 서비스 가치를 알리고 **이메일 사전 알림 신청 / 페이지 진입자 수 / 신청자 수**를 수집한다.

## 스택

- **Next.js 15 (App Router)** + TypeScript strict + Tailwind v4
- **Supabase** (Postgres + RLS, 무료 티어)
- **Vercel** (배포 + Web Analytics)
- **pnpm 9 workspaces** + **Turborepo**
- 봇·스팸 방어: **Cloudflare Turnstile** + Upstash 기반 rate limit
- 폼 검증: **Zod** (클라이언트/서버 공유)

자세한 결정 근거: [`docs/adr/0001-stack.md`](docs/adr/0001-stack.md)

## 모노레포 구조

```
apps/
  web/                  # Next.js 랜딩 페이지
packages/
  db/                   # Supabase 마이그레이션 SQL
  validation/           # Zod 공유 스키마
  config/               # tsconfig·eslint·tailwind 공유 프리셋
docs/
  adr/                  # 결정 기록
  runbook.md            # 배포·시크릿 회전 절차
```

## 개발

```bash
# 1회: Node 22 + pnpm 활성화
nvm use            # 또는 fnm/asdf — .nvmrc 참조
corepack enable
corepack prepare pnpm@9.15.0 --activate

# 의존성 설치 + 개발 서버
pnpm install
pnpm dev           # apps/web 실행
```

자주 쓰는 스크립트:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm format
```

## 환경 변수

`.env.example` 참조. 실제 값은 Vercel Project Environment Variables 또는 로컬 `.env.local`에 둔다. 퍼블릭 저장소이므로 **service_role 키는 절대 클라이언트 번들에 노출 금지**.

회전·등록 절차: [`docs/runbook.md`](docs/runbook.md)

## 마일스톤

| | 제목 | 이슈 |
|---|---|---|
| M0 | 모노레포·인프라 부트 | [#1](https://github.com/Gundy93/TrendMapLP/issues/1) |
| M1 | 데이터·계측 (UI 무관) | [#2](https://github.com/Gundy93/TrendMapLP/issues/2) |
| M2 | UI 와이어프레임 + 폼 | [#3](https://github.com/Gundy93/TrendMapLP/issues/3) |
| M3 | 디자인 적용 + 카피 | [#4](https://github.com/Gundy93/TrendMapLP/issues/4) |
| M4 | 운영·관측 마감 | [#5](https://github.com/Gundy93/TrendMapLP/issues/5) |

## 협업 셋업 (Claude Code)

[`claude-code-template`](https://github.com/Gundy93/claude-code-template) **v0.1.0 lite** 프로필 기반.

- 에이전트: `explorer` / `implementer` / `test-writer` (`.claude/agents/`)
- 라우팅 스킬: `sub-agent-routing` (`.claude/skills/sub-agent-routing/SKILL.md`)
- 운영 가이드: [`CLAUDE.md`](CLAUDE.md)
