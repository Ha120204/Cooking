-- Run in Supabase SQL Editor after the migration. The transaction is rolled back;
-- all probe rows and rate-limit increments disappear if the script succeeds.
begin;

insert into public.comments (target_type, target_slug, display_name, body, hidden)
values ('recipe', 'm2a-rls-probe', 'Kiểm thử', 'Bình luận công khai', false),
       ('recipe', 'm2a-rls-probe', 'Kiểm thử', 'Bình luận đã ẩn', true);
insert into public.questions (id, display_name, title, body, hidden)
values ('11111111-1111-4111-8111-111111111111', 'Kiểm thử', 'Câu hỏi thử', 'Nội dung câu hỏi công khai', false),
       ('22222222-2222-4222-8222-222222222222', 'Kiểm thử', 'Câu hỏi ẩn', 'Nội dung câu hỏi đã ẩn', true);
insert into public.answers (question_id, display_name, body, hidden)
values ('11111111-1111-4111-8111-111111111111', 'Kiểm thử', 'Trả lời công khai', false),
       ('11111111-1111-4111-8111-111111111111', 'Kiểm thử', 'Trả lời đã ẩn', true),
       ('22222222-2222-4222-8222-222222222222', 'Kiểm thử', 'Trả lời câu hỏi ẩn', false);
insert into public.recipe_submissions (display_name, title, description, steps)
values ('Kiểm thử', 'Món thử nghiệm', 'Mô tả công thức thử nghiệm', 'Bước một rồi bước hai.');
insert into public.recipe_likes (recipe_slug, visitor_hash)
values ('m2a-rls-probe', repeat('a', 64));
insert into public.recipe_ratings (recipe_slug, visitor_hash, stars)
values ('m2a-rls-probe', repeat('a', 64), 3),
       ('m2a-rls-probe', repeat('b', 64), 5);

do $$
begin
  if has_table_privilege('anon', 'public.recipe_likes', 'SELECT')
     or has_table_privilege('anon', 'public.recipe_ratings', 'SELECT')
     or has_table_privilege('anon', 'public.recipe_submissions', 'SELECT')
     or has_table_privilege('anon', 'public.recipe_stats', 'SELECT')
     or has_table_privilege('anon', 'public.comments', 'INSERT')
     or has_table_privilege('anon', 'public.comments', 'UPDATE')
     or has_table_privilege('anon', 'public.comments', 'DELETE')
     or has_table_privilege('anon', 'public.recipe_likes', 'INSERT')
     or has_table_privilege('anon', 'public.recipe_likes', 'DELETE')
     or has_table_privilege('anon', 'public.recipe_ratings', 'UPDATE')
     or has_table_privilege('anon', 'public.questions', 'INSERT')
     or has_table_privilege('anon', 'public.answers', 'INSERT')
     or has_function_privilege('anon', 'public.consume_rate_limit(text)', 'EXECUTE')
     or has_schema_privilege('anon', 'private', 'USAGE') then
    raise exception 'FAIL: anon can access a private object or write directly';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'recipe_stats'
      and column_name = 'visitor_hash'
  ) then
    raise exception 'FAIL: recipe_stats exposes visitor_hash';
  end if;
  if not exists (
    select 1 from cron.job where jobname = 'cleanup-rate-limit-buckets'
  ) then
    raise exception 'FAIL: cleanup cron job is missing';
  end if;
end;
$$;

set local role anon;
do $$
begin
  if (select count(*) from public.comments where target_slug = 'm2a-rls-probe') <> 1 then
    raise exception 'FAIL: comments visibility';
  end if;
  if (select count(*) from public.questions where id in
      ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')) <> 1 then
    raise exception 'FAIL: questions visibility';
  end if;
  if (select count(*) from public.answers where question_id in
      ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')) <> 1 then
    raise exception 'FAIL: answers visibility';
  end if;
end;
$$;

set local role service_role;
do $$
declare s record;
begin
  select * into s from public.recipe_stats where recipe_slug = 'm2a-rls-probe';
  if s.like_count <> 1 or s.rating_count <> 2 or s.avg_rating <> 4.0 then
    raise exception 'FAIL: recipe_stats returned wrong aggregates';
  end if;
  if public.consume_rate_limit(repeat('c', 64)) <> 1
     or public.consume_rate_limit(repeat('c', 64)) <> 2 then
    raise exception 'FAIL: rate-limit RPC is not atomic/incrementing';
  end if;
end;
$$;

reset role;
rollback;
select 'M2a RLS checks passed; probe data rolled back' as result;
