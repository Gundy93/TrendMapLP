-- 0001_init.sql
-- Supabase Dashboard → SQL editor에 붙여 Run.
-- idempotent (이미 있는 경우 건너뜀).

create extension if not exists citext;

-- 신청자
create table if not exists public.signups (
  id                     uuid primary key default gen_random_uuid(),
  email                  citext not null unique,
  source                 text,
  utm_medium             text,
  utm_campaign           text,
  utm_content            text,
  device_type            text,
  user_agent             text,
  welcome_email_sent_at  timestamptz,
  created_at             timestamptz not null default now()
);
create index if not exists signups_created_at_desc_idx on public.signups (created_at desc);

-- 페이지 / funnel 이벤트
create table if not exists public.page_events (
  id            bigserial primary key,
  event_type    text not null check (event_type in ('page_view','cta_click','form_submit_attempt','form_submit_success')),
  visitor_id    text,
  session_id    text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  device_type   text,
  created_at    timestamptz not null default now()
);
create index if not exists page_events_type_created_idx on public.page_events (event_type, created_at desc);
create index if not exists page_events_visitor_idx     on public.page_events (visitor_id);

-- RLS enable + 정책 미생성 → anon/authenticated 직접 접근 불가.
-- 모든 INSERT는 service_role 키로만 (Server Action / Route Handler 경유).
alter table public.signups     enable row level security;
alter table public.page_events enable row level security;

-- 일일 funnel view
create or replace view public.v_funnel_daily as
select
  date_trunc('day', created_at) as day,
  count(*) filter (where event_type='page_view')           as views,
  count(distinct visitor_id) filter (where event_type='page_view') as unique_visitors,
  count(*) filter (where event_type='cta_click')           as cta_clicks,
  count(*) filter (where event_type='form_submit_attempt') as submit_attempts,
  count(*) filter (where event_type='form_submit_success') as signups_count
from public.page_events
group by 1
order by 1 desc;
