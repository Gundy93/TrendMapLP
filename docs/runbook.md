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
| `NEXT_PUBLIC_SITE_URL` | all | OG/Twitter metadata base. 커스텀 도메인 이전 시 본 키만 갱신 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | all | M1에서 발급 |
| `TURNSTILE_SECRET_KEY` | all | M1, 서버 only |
| `UPSTASH_REDIS_REST_URL` | all | M1 |
| `UPSTASH_REDIS_REST_TOKEN` | all | M1, 서버 only |

**preview와 production은 분리된 키 사용** (사고 시 회전 범위 축소).

로컬 개발은 `.env.local` 파일(이미 `.gitignore`)에 동일 키 작성.

## 3.1 Cloudflare Turnstile 발급 (M1 진입 후 1회)

1. <https://dash.cloudflare.com> → **Turnstile** → **Add site**.
2. Site name 임의, Hostnames에 `*.vercel.app`(preview)와 production 도메인 추가.
3. **Widget Mode**: Invisible (UX 부담 최소).
4. 발급된 키 두 개를 등록:
   - `Site Key` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (클라이언트 노출 OK)
   - `Secret Key` → `TURNSTILE_SECRET_KEY` (서버 only)
5. 미등록 상태에선 `apps/web/lib/turnstile.ts`가 **개발은 skip 모드**, **production은 거부 모드**로 동작.

## 3.2 Upstash Redis 발급 (M1 진입 후 1회)

1. <https://upstash.com> → **Create Database** → 무료 티어.
2. Region: `ap-northeast-1`(Tokyo) 권장.
3. **Read-Only REST**가 아니라 일반 REST URL/Token 발급.
4. Vercel에 등록:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. 미등록 상태에선 `apps/web/lib/rate-limit.ts`가 **skip 모드**로 모든 요청을 통과시키고 경고 로그를 남김.

## 4. 시크릿 회전 절차 (사고 시)

1. Supabase Dashboard → **Project Settings → API → Reset service role key**.
2. 새 키를 Vercel Environment Variables의 `SUPABASE_SERVICE_ROLE_KEY`(production/preview/development)에 즉시 반영.
3. Vercel에서 **Redeploy**(production만으로 충분).
4. (퍼블릭 저장소 사고면) `git log`/PR diff에서 노출 시점 확인 후 `git filter-repo` 등으로 히스토리 정리는 보통 무효 — **키 회전이 1순위**.
5. Turnstile/Upstash도 동일 절차.
6. **Vercel 로그**: hobby 플랜은 retention 1일이라 사고 직후 즉시 캡처(스크린샷 또는 로그 export)해두는 게 안전. Pro 플랜이면 retention이 길어지지만 PMF 검증 단계엔 hobby로 충분.

## 5. 마이그레이션 절차 (M1까지 수동)

1. `packages/db/migrations/000N_*.sql` 추가 PR 머지.
2. Supabase Dashboard → SQL editor → 파일 내용 붙여 실행.
3. 실행 결과를 PR 코멘트에 캡처 첨부.
4. 자동화는 PMF 검증 후 `supabase` CLI + GitHub Actions로 도입.

## 6. 롤백

- 코드: Vercel Dashboard → **Deployments → 이전 빌드 → Promote to Production**.
- DB: 마이그레이션은 idempotent + 역마이그레이션 SQL 동봉 권장.

## 6.1 E2E 테스트 실행 (로컬 전용, M2)

Playwright E2E 스위트는 실제 Supabase에 INSERT하고 service role로 cleanup한다. CI는 아직 미연동(별도 ADR 후 등록 예정).

**전제**: `apps/web/.env.local`에 `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` 존재.

1. **첫 실행 시 1회**: 브라우저 다운로드.
   ```bash
   pnpm --filter @trendmaplp/web test:e2e:install
   ```
2. **실행**:
   ```bash
   pnpm --filter @trendmaplp/web test:e2e
   ```
   `playwright.config.ts`의 `webServer`가 `pnpm dev`를 자동 기동(이미 떠 있으면 재사용). 5 케이스 × 2 project(chromium/mobile) = 10건.
3. **디버깅**: `pnpm --filter @trendmaplp/web test:e2e:ui` (Playwright Inspector).
4. **수동 cleanup** (cleanup hook 실패 시):
   ```sql
   delete from signups where email like 'e2e+%@trendmaplp.test';
   ```

테스트 데이터는 `e2e+{uuid}@trendmaplp.test` 패턴이라 운영 신청자 row와 충돌하지 않는다.

## 7. on-call (1인 운영)

알림 채널은 미도입 — Vercel 로그를 주기적으로 직접 점검한다. 사고 검출이 늦은 게 비용이 되면 Sentry 도입을 후속 이슈에서 결정.

### 7.1 주간 점검 (월요일 30분)

1. **Vercel 로그**: Dashboard → 프로젝트 → Logs → 최근 24h `error` 필터.
   - 5xx, Server Action 실패, `/api/event` insert 실패, `/api/signup` 관련 에러를 체크.
   - `[signup] insert failed`, `[/api/event] insert failed`, `[turnstile]`, `[rate-limit]` 키워드 grep으로 빠르게 훑는다.
   - 에러 0건이면 OK. 1건 이상이면 메시지·context·발생 시각을 메모하고 §7.3로.
2. **주간 PMF SQL** 실행: `docs/queries/weekly_pmf.sql`을 Supabase Studio SQL editor에 붙여넣고 Run.
   - 결과 캡처 → 본인 메모 도구(Notion/notepad)에 일자별로 누적.
   - `conversion_pct` 추세를 확인. 광고 시작 후 D+7부터 의미 있는 신호.
3. **신청자 신규 카운트**:
   ```sql
   select count(*) from public.signups where created_at > now() - interval '7 days';
   ```
4. **PII row 정합성**:
   ```sql
   select count(*) from public.signups where email is null or email = '';
   ```
   결과 0이어야 함.

### 7.2 사고 분류

| 증상 | 1차 조치 |
|---|---|
| Vercel 로그에서 `[signup] insert failed` 반복 | Supabase 키 만료/회전 의심 → §4 시크릿 회전 |
| 신청은 가능하나 page_events 카운트 0 | `/api/event` route 에러 확인. 클라이언트 fetch 실패는 봇 가드 또는 rate-limit |
| 시크릿 누설 의심(GitHub commit/log) | **즉시** §4 시크릿 회전. 그 다음 누설 범위 추적 |
| 잘못된 배포 | §6 롤백 → 원인 fix PR |
| DB 정합성 문제 | 새 마이그레이션 PR (§5) — 직접 `update`/`delete`는 가능한 피하고 SQL 파일로 흔적 남기기 |

### 7.3 사고 기록

- 사고 발생 시 `docs/incidents/YYYY-MM-DD-요약.md`로 5W1H 짧게 정리(미래 운영자/본인용).
- 1주 이상 영향이 있으면 GitHub Issue로도 트래킹.

## 8. 신청자 데이터 export

마케팅 메일 송신, 사전 알림 발송, 분석 등 PII를 다룰 때.

### 8.1 Supabase Studio UI
1. Table editor → `signups` → 우상단 **Export to CSV**.
2. 다운로드된 CSV는 신뢰 가능한 위치(Mac 기본 Downloads → 비밀번호 보관소)에 저장.
3. 외부 공유 시 PII 처리방침에 동의 받은 컬럼만 포함.

### 8.2 SQL로 컬럼 선택 export (권장)
민감 정보는 줄여서 export — 필요한 컬럼만:
```sql
select email, source, utm_medium, utm_campaign, utm_content,
       device_type, created_at
from public.signups
order by created_at;
```
SQL editor 결과창의 **Download** 버튼으로 CSV 저장.

### 8.3 보관·삭제 원칙
- export 파일은 사용 직후 **삭제** 또는 암호화된 보관소(1Password Vault 등)로 이동.
- 외부 메일 서비스(Resend 등)에 업로드 후 7일 이내 원본 삭제.
- 사용자 신청 취소(이메일 수신 거부) 요청 시 `delete from signups where email = '...'` 후 export 파일에서도 해당 행 제거.
