-- 주간 PMF funnel · conversion%
--
-- 실행: 매주 월요일 Supabase Studio → SQL editor에 붙여넣고 Run.
-- 결과를 PR 코멘트나 메모 도구에 캡처해 추세를 추적한다.
-- 자세한 점검 절차는 `docs/runbook.md` §7 참조.

select
  to_char(day at time zone 'Asia/Seoul', 'YYYY-MM-DD') as day,
  views,
  unique_visitors,
  cta_clicks,
  signups_count,
  case
    when unique_visitors > 0
      then round(100.0 * signups_count / unique_visitors, 2)
  end as conversion_pct
from public.v_funnel_daily
where day >= (now() at time zone 'Asia/Seoul')::date - interval '6 days'
order by day desc;
