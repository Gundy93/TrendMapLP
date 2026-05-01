# Runbook

운영·배포·시크릿 회전 절차. 단일 1인 운영 전제.

---

## 1. Vercel 프로젝트 셋업 (M0 1회)

1. <https://vercel.com>에서 GitHub 계정으로 로그인.
2. **Add New → Project** → `Gundy93/TrendMapLP` 선택 → **Import**.
3. **Framework Preset**: Next.js (자동 감지).
4. **Root Directory**: `apps/web`.
5. **Install Command**: `pnpm install --frozen-lockfile` (자동).
6. **Build Command**: 자동 (turbo가 처리).
7. **Environment Variables** — 아래 §3 참조.
8. **Deploy**.

도메인은 자동 `*.vercel.app`로 시작. 커스텀 도메인은 확보 후 연결.

## 2. Supabase 프로젝트 셋업 (M0 1회)

1. <https://supabase.com> 로그인 → **New project**.
2. Region: `ap-northeast-2`(Seoul) 또는 `ap-northeast-1`(Tokyo).
3. DB password는 1Password 등 비밀 매니저에 보관.
4. 생성 완료 후 **Project Settings → API**에서 다음 4개 키 복사:
   - `Project URL` → `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**절대 클라이언트 노출 금지**)
5. M1 시작 시 `packages/db/migrations/0001_init.sql`을 SQL editor에서 실행.

## 3. 환경변수 등록

Vercel Project → **Settings → Environment Variables**에서 다음 키를 **production / preview / development** 3환경 모두 등록.

| Key | 환경 | 비고 |
|---|---|---|
| `SUPABASE_URL` | all | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | all | 서버 only (Server Action에서만 사용) |
| `NEXT_PUBLIC_SUPABASE_URL` | all | 클라이언트 노출 OK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | all | 클라이언트 노출 OK |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | all | M1에서 발급 |
| `TURNSTILE_SECRET_KEY` | all | M1, 서버 only |
| `UPSTASH_REDIS_REST_URL` | all | M1 |
| `UPSTASH_REDIS_REST_TOKEN` | all | M1, 서버 only |

**preview와 production은 분리된 키 사용** (사고 시 회전 범위 축소).

로컬 개발은 `.env.local` 파일(이미 `.gitignore`)에 동일 키 작성.

## 4. 시크릿 회전 절차 (사고 시)

1. Supabase Dashboard → **Project Settings → API → Reset service role key**.
2. 새 키를 Vercel Environment Variables의 `SUPABASE_SERVICE_ROLE_KEY`(production/preview/development)에 즉시 반영.
3. Vercel에서 **Redeploy**(production만으로 충분).
4. (퍼블릭 저장소 사고면) `git log`/PR diff에서 노출 시점 확인 후 `git filter-repo` 등으로 히스토리 정리는 보통 무효 — **키 회전이 1순위**.
5. Turnstile/Upstash도 동일 절차.

## 5. 마이그레이션 절차 (M1까지 수동)

1. `packages/db/migrations/000N_*.sql` 추가 PR 머지.
2. Supabase Dashboard → SQL editor → 파일 내용 붙여 실행.
3. 실행 결과를 PR 코멘트에 캡처 첨부.
4. 자동화는 PMF 검증 후 `supabase` CLI + GitHub Actions로 도입.

## 6. 롤백

- 코드: Vercel Dashboard → **Deployments → 이전 빌드 → Promote to Production**.
- DB: 마이그레이션은 idempotent + 역마이그레이션 SQL 동봉 권장.

## 7. on-call

- 1인 운영. 알림 채널은 M4에서 결정 (Sentry → Discord/Telegram webhook 후보).
