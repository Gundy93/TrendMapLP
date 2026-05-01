# @trendmaplp/db

Supabase 스키마 마이그레이션과 분석 뷰의 단일 소스.

## 적용 절차 (M1까지 수동)

1. Supabase Dashboard → 대상 프로젝트 → SQL editor.
2. `migrations/` 안의 SQL 파일을 **숫자 순서대로** 실행.
3. `seed.sql`(있다면) 실행.

## 향후

- `supabase` CLI + GitHub Actions로 자동 적용 (PMF 검증 후 도입).
- 마이그레이션은 idempotent하게 작성 (`create table if not exists` 등).
