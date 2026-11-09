-- Run after 20261109_m2b.sql in Supabase SQL Editor. All probe writes roll back.
begin;

insert into public.recipe_submissions
  (display_name, title, description, ingredients, steps, image_url, image_credit, rights_confirmed_at)
values
  ('Kiểm thử', 'Món thử M2b', 'Mô tả công thức kiểm thử M2b', '[{"name":"Đậu hũ","amount":"2","unit":"miếng"}]'::jsonb,
   '1. Sơ chế nguyên liệu. 2. Nấu chín.', 'https://example.com/anh.jpg', 'Ảnh tự chụp', now());

insert into public.questions (id, display_name, title, body, category, hidden)
values
  ('33333333-3333-4333-8333-333333333333', 'Kiểm thử', 'Câu hỏi M2b', 'Nội dung câu hỏi để kiểm tra M2b.', 'so-che', false),
  ('44444444-4444-4444-8444-444444444444', 'Kiểm thử', 'Câu hỏi ẩn M2b', 'Nội dung câu hỏi ẩn để kiểm tra.', 'meo-vat', true);
insert into public.answers (question_id, display_name, body, hidden)
values
  ('33333333-3333-4333-8333-333333333333', 'Kiểm thử', 'Trả lời đang hiện', false),
  ('33333333-3333-4333-8333-333333333333', 'Kiểm thử', 'Trả lời đã ẩn', true),
  ('44444444-4444-4444-8444-444444444444', 'Kiểm thử', 'Trả lời cho câu hỏi ẩn', false);

do $$
begin
  if has_function_privilege('anon', 'public.consume_rate_limit_10m(text)', 'EXECUTE')
    or has_table_privilege('anon', 'public.recipe_submissions', 'SELECT')
    or has_table_privilege('anon', 'public.recipe_submissions', 'INSERT')
    or has_table_privilege('anon', 'public.questions', 'INSERT')
    or has_table_privilege('anon', 'public.answers', 'INSERT') then
    raise exception 'FAIL: anon has private read/write/RPC access';
  end if;
  if not exists (
    select 1 from public.recipe_submissions where title = 'Món thử M2b'
      and status = 'pending' and rights_confirmed_at is not null
  ) then
    raise exception 'FAIL: submission fields or pending default';
  end if;
end;
$$;

set local role anon;
do $$
begin
  if (select count(*) from public.questions where id in
    ('33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444')) <> 1 then
    raise exception 'FAIL: hidden question is visible';
  end if;
  if (select count(*) from public.answers where question_id in
    ('33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444')) <> 1 then
    raise exception 'FAIL: hidden answer or answer to hidden question is visible';
  end if;
end;
$$;

set local role service_role;
do $$
begin
  if public.consume_rate_limit_10m(repeat('d', 64)) <> 1
    or public.consume_rate_limit_10m(repeat('d', 64)) <> 2 then
    raise exception 'FAIL: 10-minute rate-limit RPC';
  end if;
end;
$$;

reset role;
rollback;
select 'M2b RLS checks passed; probe data rolled back' as result;
