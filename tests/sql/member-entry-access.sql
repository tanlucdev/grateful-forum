-- Run with psql -v ON_ERROR_STOP=1. Fixtures and writes are rolled back.
begin;

select set_config('test.member_id', gen_random_uuid()::text, true);
insert into auth.users (id, email, is_anonymous, raw_user_meta_data)
values (current_setting('test.member_id')::uuid,
        'member-rls-' || current_setting('test.member_id') || '@example.invalid',
        false, '{}'::jsonb);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  begin
    insert into public.entries (guest_id, content) values (gen_random_uuid(), 'RLS guest check');
    raise exception 'Guest insert unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.member_id'), 'role', 'authenticated', 'is_anonymous', true)::text, true);
do $$ begin
  begin
    insert into public.entries (user_id, content) values (auth.uid(), 'RLS anonymous account check');
    raise exception 'Anonymous account insert unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.member_id'), 'role', 'authenticated', 'is_anonymous', false)::text, true);
insert into public.entries (user_id, content, visibility)
select auth.uid(), 'RLS member check', value::public.entry_visibility
from unnest(array['private', 'public', 'anonymous']) as value;
do $$ begin
  begin
    insert into public.entries (user_id, content) values (gen_random_uuid(), 'RLS wrong owner check');
    raise exception 'Wrong owner insert unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
do $$ declare legacy_id uuid; target_id uuid := current_setting('test.member_id')::uuid;
begin
  insert into public.entries (guest_id, content) values (gen_random_uuid(), 'Legacy transfer check') returning id into legacy_id;
  update public.entries set user_id = target_id, guest_id = null where id = legacy_id;
  if not exists (select 1 from public.entries where id = legacy_id and user_id = target_id and guest_id is null) then
    raise exception 'Legacy transfer failed';
  end if;
end $$;
rollback;
