-- M2b additive migration. Run once in Supabase SQL Editor after M2a.
-- Existing M2a rows remain valid; new submissions record consent in the API.
begin;

alter table public.recipe_submissions
  add column if not exists image_url text,
  add column if not exists image_credit text,
  add column if not exists rights_confirmed_at timestamptz;

alter table public.questions
  add column if not exists category text not null default 'meo-vat';

do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.recipe_submissions'::regclass and conname = 'recipe_submissions_image_url_length') then
    alter table public.recipe_submissions add constraint recipe_submissions_image_url_length
      check (image_url is null or char_length(image_url) <= 2048);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.recipe_submissions'::regclass and conname = 'recipe_submissions_image_credit_length') then
    alter table public.recipe_submissions add constraint recipe_submissions_image_credit_length
      check (image_credit is null or char_length(image_credit) <= 200);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.questions'::regclass and conname = 'questions_category_allowed') then
    alter table public.questions add constraint questions_category_allowed
      check (category in ('so-che', 'nem-nem', 'lua-thoi-gian', 'meo-vat'));
  end if;
end;
$$;

create index if not exists questions_visible_category_created_idx
  on public.questions (category, created_at desc) where hidden = false;

-- The M2a RPC uses one-hour buckets. Answers use fixed 10-minute buckets.
create or replace function public.consume_rate_limit_10m(p_bucket_key text)
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
  values (p_bucket_key, to_timestamp((floor(extract(epoch from now()) / 600) * 600)::double precision), 1)
  on conflict (bucket_key, bucket_start)
  do update set hits = rate_limit_buckets.hits + 1
  returning hits into result_hits;
  return result_hits;
end;
$$;

revoke all on function public.consume_rate_limit_10m(text) from public, anon, authenticated;
grant execute on function public.consume_rate_limit_10m(text) to service_role;

notify pgrst, 'reload schema';
commit;
