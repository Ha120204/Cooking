-- M2a: run this whole file once in Supabase SQL Editor as the project owner.
-- Public writes are intentionally disabled. Route Handlers validate and write with
-- the server-only service role key. Content slugs are checked against MDX in code.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('recipe', 'weekly_menu')),
  target_slug text not null check (target_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(target_slug) <= 100),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  body text not null check (char_length(btrim(body)) between 2 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists comments_visible_target_idx on public.comments (target_type, target_slug, created_at desc) where hidden = false;

create table if not exists public.recipe_likes (
  recipe_slug text not null check (recipe_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(recipe_slug) <= 100),
  visitor_hash text not null check (visitor_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  primary key (recipe_slug, visitor_hash)
);

create table if not exists public.recipe_ratings (
  recipe_slug text not null check (recipe_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(recipe_slug) <= 100),
  visitor_hash text not null check (visitor_hash ~ '^[0-9a-f]{64}$'),
  stars smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (recipe_slug, visitor_hash)
);

create or replace view public.recipe_stats
with (security_invoker = true)
as
select slugs.recipe_slug,
       coalesce(l.like_count, 0)::bigint as like_count,
       r.avg_rating,
       coalesce(r.rating_count, 0)::bigint as rating_count
from (
  select recipe_slug from public.recipe_likes
  union
  select recipe_slug from public.recipe_ratings
) slugs
left join (
  select recipe_slug, count(*) as like_count
  from public.recipe_likes group by recipe_slug
) l using (recipe_slug)
left join (
  select recipe_slug, round(avg(stars)::numeric, 1) as avg_rating,
         count(*) as rating_count
  from public.recipe_ratings group by recipe_slug
) r using (recipe_slug);

-- M2b tables are prepared now, but have no public write endpoint until M2b.
create table if not exists public.recipe_submissions (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  title text not null check (char_length(btrim(title)) between 3 and 150),
  description text not null check (char_length(btrim(description)) between 10 and 1000),
  ingredients jsonb not null default '[]'::jsonb check (jsonb_typeof(ingredients) = 'array'),
  steps text not null check (char_length(btrim(steps)) between 10 and 10000),
  source_note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  title text not null check (char_length(btrim(title)) between 5 and 150),
  body text not null check (char_length(btrim(body)) between 10 and 3000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists questions_visible_created_idx on public.questions (created_at desc) where hidden = false;

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  body text not null check (char_length(btrim(body)) between 2 and 3000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists answers_visible_question_idx on public.answers (question_id, created_at) where hidden = false;

create table if not exists private.rate_limit_buckets (
  bucket_key text not null check (bucket_key ~ '^[0-9a-f]{64}$'),
  bucket_start timestamptz not null,
  hits integer not null default 0 check (hits >= 0),
  primary key (bucket_key, bucket_start)
);

create or replace function public.consume_rate_limit(p_bucket_key text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare result_hits integer;
begin
  if p_bucket_key is null or p_bucket_key !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid bucket key';
  end if;
  insert into private.rate_limit_buckets (bucket_key, bucket_start, hits)
  values (p_bucket_key, date_trunc('hour', now()), 1)
  on conflict (bucket_key, bucket_start)
  do update set hits = rate_limit_buckets.hits + 1
  returning hits into result_hits;
  return result_hits;
end;
$$;

alter table public.comments enable row level security;
alter table public.recipe_likes enable row level security;
alter table public.recipe_ratings enable row level security;
alter table public.recipe_submissions enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table private.rate_limit_buckets enable row level security;

revoke all on public.comments, public.recipe_likes, public.recipe_ratings,
  public.recipe_submissions, public.questions, public.answers from public, anon, authenticated;
revoke all on public.recipe_stats from public, anon, authenticated;
revoke all on private.rate_limit_buckets from public, anon, authenticated;
revoke all on function public.consume_rate_limit(text) from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.comments, public.questions, public.answers to anon, authenticated;
grant select, insert, update, delete on public.comments, public.recipe_likes,
  public.recipe_ratings, public.recipe_submissions, public.questions, public.answers to service_role;
grant select on public.recipe_stats to service_role;
grant usage on schema private to service_role;
grant select, insert, update, delete on private.rate_limit_buckets to service_role;
grant execute on function public.consume_rate_limit(text) to service_role;

drop policy if exists comments_visible_read on public.comments;
create policy comments_visible_read on public.comments for select to anon, authenticated using (hidden = false);
drop policy if exists questions_visible_read on public.questions;
create policy questions_visible_read on public.questions for select to anon, authenticated using (hidden = false);
drop policy if exists answers_visible_read on public.answers;
create policy answers_visible_read on public.answers for select to anon, authenticated
  using (hidden = false and exists (
    select 1 from public.questions q where q.id = question_id and q.hidden = false
  ));

commit;

-- pg_cron is a Supabase extension. Keep this block outside the transaction so
-- its availability does not roll back the schema above on projects without it.
create extension if not exists pg_cron;
select cron.schedule(
  'cleanup-rate-limit-buckets',
  '17 2 * * *',
  $$delete from private.rate_limit_buckets where bucket_start < now() - interval '48 hours'$$
);
