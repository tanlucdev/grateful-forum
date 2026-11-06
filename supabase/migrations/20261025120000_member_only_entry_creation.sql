begin;

drop policy if exists "Guests insert guest entries" on public.entries;
drop policy if exists "Users insert their own entries" on public.entries;

create policy "Users insert their own entries"
on public.entries for insert to authenticated
with check (
  auth.uid() = user_id
  and guest_id is null
  and (auth.jwt() ->> 'is_anonymous') = 'false'
);

commit;
