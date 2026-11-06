// Run: node tests/navigation-db.test.mjs; isolated PostgreSQL, no shared DB.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bucketDates, getCalendarStreaks, localDateKey } from '../lib/calendar/stats.ts';
import { getStreak } from '../lib/profile/streak.ts';
import { makeWeeklyRhythm } from '../lib/profile/weekly-rhythm.ts';
const directory = mkdtempSync(join(tmpdir(), 'grateful-navigation-'));
const data = join(directory, 'data');
const port = '55441';
const args = ['-X', '-q', '-v', 'ON_ERROR_STOP=1', '-h', directory, '-p', port, '-d', 'postgres', '-At'];
const sql = input => execFileSync('psql', args, { input, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
const owner = '00000000-0000-4000-8000-000000000001';
const other = '00000000-0000-4000-8000-000000000002';
const asUser = (id, query) => sql(`set role authenticated; set request.jwt.claim.sub='${id}'; ${query}`);
const call = (id, name, params='') => JSON.parse(asUser(id, `select public.${name}(${params});`));
let started = false;
try {
 execFileSync('initdb',['-D',data,'-A','trust','--no-locale','-E','UTF8'],{stdio:'pipe'});
 execFileSync('pg_ctl',['-D',data,'-o',`-k ${directory} -p ${port} -h ''`,'-l',join(directory,'server.log'),'start'],{stdio:'pipe'}); started=true;
 sql(`create role anon; create role authenticated; create role service_role bypassrls;
 create schema auth; create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{"is_anonymous":false}')::jsonb $$;
 create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
 grant usage on schema auth,public to anon,authenticated,service_role;
 grant execute on all functions in schema auth to anon,authenticated,service_role;`);
 // Real entry schema, real RLS, real indexes; media storage is unrelated to reads.
 for(const file of ['20260831150000_init_gratitude_schema.sql','20260831170000_private_admin_roles.sql','20260908120000_entry_metadata_and_media.sql','20260909100000_calendar.sql','20260913100000_flexible_entry_gratitudes.sql','20260914120000_feed_engagements.sql','20260928110000_owner_deleted_entries.sql','20260929120000_handwritten_entries.sql']) {
  let migration=readFileSync(new URL(`../supabase/migrations/${file}`,import.meta.url),'utf8');
  // Storage policies are not part of this isolated SQL read-model check.
  migration=migration.split('insert into storage.buckets')[0];
  sql(migration);
 }
 sql(readFileSync(new URL('../supabase/migrations/20261105120000_navigation_read_models.sql',import.meta.url),'utf8'));
 sql(readFileSync(new URL('../supabase/migrations/20261106120000_request_statistics_timezone.sql',import.meta.url),'utf8'));
 sql(readFileSync(new URL('../supabase/migrations/20261106130000_statistics_timezone_validation.sql',import.meta.url),'utf8'));
 sql(`grant select on all tables in schema public to anon,authenticated,service_role;
 insert into auth.users(id) values ('${owner}'),('${other}');
 insert into public.entries(id,user_id,content,visibility,created_at,hidden_at,owner_deleted_at)
 select (lpad(to_hex(n),8,'0')||'-0000-4000-8000-000000000000')::uuid, '${owner}'::uuid, 'fixture',
 (case when n%3=0 then 'private' when n%3=1 then 'public' else 'anonymous' end)::public.entry_visibility,
 date_trunc('day',now())-((n/3)::text||' days')::interval,
 case when n%17=0 then now() end,case when n%19=0 then now() end from generate_series(1,1200) n;
 insert into public.entries(user_id,content,visibility) values('${other}','second account private','private');
 analyze public.entries;`);
 const expected = Number(sql(`select count(*) from public.entries where user_id='${owner}' and hidden_at is null and owner_deleted_at is null`));
 assert.ok(expected>1000);
 sql(`update public.profiles set timezone='Asia/Ho_Chi_Minh' where id='${owner}';`);
 const stats = call(owner,'journal_statistics'); assert.equal(stats.timezone,'Asia/Ho_Chi_Minh'); assert.equal(stats.total,expected);
 assert.equal(call(other,'journal_statistics').total,1);
 const publicExpected=Number(sql(`select count(*) from public.entries where user_id='${owner}' and hidden_at is null and owner_deleted_at is null and visibility in ('public','anonymous')`));
 assert.equal(call(other,'journal_statistics',`'${owner}'`).total,publicExpected);
 assert.equal(call(owner,'journal_statistics',`'${owner}'`).total,publicExpected);
 assert.equal(call(owner,'journal_statistics').longestStreak,Number(sql(`with days as (select distinct (created_at at time zone 'Asia/Ho_Chi_Minh')::date d from public.entries where user_id='${owner}' and hidden_at is null and owner_deleted_at is null), runs as(select d,d-row_number() over(order by d)::integer g from days) select max(n) from(select count(*) n from runs group by g) r`)));
 sql(`update public.profiles set timezone='invalid/zone' where id='${owner}';`);assert.equal(call(owner,'journal_statistics').timezone,'Asia/Ho_Chi_Minh');
 sql(`update public.profiles set timezone='utc' where id='${owner}';`);assert.equal(call(owner,'journal_statistics').timezone,'utc');
 sql(`update public.profiles set timezone='Asia/Ho_Chi_Minh' where id='${owner}';`);
 const timestamps=JSON.parse(sql(`select jsonb_agg(created_at) from public.entries where user_id='${owner}' and hidden_at is null and owner_deleted_at is null`));
 assert.equal(stats.streak,getStreak(timestamps.map(value=>new Date(value).toISOString())));
 for(const zone of ['UTC','Asia/Ho_Chi_Minh','America/New_York']) {
  const today=localDateKey(new Date().toISOString(),zone);
  const year=Number(today.slice(0,4)), month=Number(today.slice(5,7));
  const actual=call(owner,'journal_statistics',`null,'${zone}',${year},${month}`);
  const buckets=bucketDates(timestamps,zone);
  const expectedStreaks=getCalendarStreaks([...buckets.keys()],today);
  assert.equal(actual.currentStreak,expectedStreaks.currentStreak);
  assert.equal(actual.longestStreak,expectedStreaks.longestStreak);
  assert.deepEqual(actual.yearBuckets,Object.fromEntries([...buckets].filter(([date])=>date.startsWith(String(year)))));
  const monthBuckets=[...buckets].filter(([date])=>date.startsWith(today.slice(0,7)));
  assert.equal(actual.monthEntries,monthBuckets.reduce((sum,[,count])=>sum+count,0));
  assert.equal(actual.activeDaysThisMonth,monthBuckets.length);
  const week=makeWeeklyRhythm(timestamps.map(createdAt=>({createdAt})),zone);
  assert.deepEqual(week.map(day=>actual.weekBuckets[day.date]??0),week.map(day=>day.count));
 }
 const first = call(owner,'journal_page'); assert.equal(first.rows.length,24);assert.equal(first.total,expected);assert.equal(first.start,0); assert.equal(first.previous,null);
 assert.ok(first.rows.every(row=>!('handwriting_data' in row)));
 const cursorArgs = c => `null,false,'${c.time}','${c.id}',${c.backwards}`;
 const second=call(owner,'journal_page',cursorArgs(first.next)); assert.equal(second.start,24); assert.equal(second.rows.length,24);
 assert.equal(new Set([...first.rows,...second.rows].map(r=>r.id)).size,48,'Tied timestamps must neither repeat nor skip');
 assert.deepEqual(call(owner,'journal_page',cursorArgs(second.previous)).rows,first.rows);
 const direct=call(owner,'journal_page',`null,false,null,null,false,'${second.rows[7].id}'`); assert.deepEqual(direct.rows,second.rows);
 const pub=call(owner,'journal_page',`null,true`); assert.equal(pub.total,publicExpected);assert.ok(pub.rows.every(r=>r.visibility!=='private'));
 const otherPublic=call(other,'journal_page',`'${owner}'`);assert.deepEqual(otherPublic.rows,pub.rows);
 const ownOther=call(other,'journal_page');assert.equal(ownOther.total,1);
 assert.equal(JSON.parse(sql(`set role anon; select public.journal_page();`)).total,0);
 assert.throws(()=>asUser(owner,`select * from public.feed_reaction_counts('{}');`),/permission denied/);
 sql(`insert into public.entry_reactions(entry_id,user_id,reaction_type) select id,'${owner}','empathy' from public.entries where visibility='public' and hidden_at is null and owner_deleted_at is null limit 1;`);
 const reactionEntry=sql('select entry_id from public.entry_reactions limit 1');
 assert.equal(sql(`set role service_role; select count from public.feed_reaction_counts(array['${reactionEntry}'::uuid]);`),'1');
 sql(`update public.entries set owner_deleted_at=now() where id='${reactionEntry}';`);
 assert.equal(sql(`set role service_role; select count(*) from public.feed_reaction_counts(array['${reactionEntry}'::uuid]);`),'0');
 const deleted=call(owner,'journal_page',`null,false,null,null,false,'${reactionEntry}'`); assert.ok(!deleted.rows.some(r=>r.id===reactionEntry));
 for(const count of [0,1,23,24,25,48,49]) {
  sql(`delete from public.entries where user_id='${other}'; insert into public.entries(user_id,content,visibility,created_at) select '${other}','boundary','private',now() from generate_series(1,${count});`);
  const page=call(other,'journal_page');assert.equal(page.total,count);assert.equal(page.rows.length,Math.min(count,24));assert.equal(Boolean(page.next),count>24);
  if(count>24){const next=call(other,'journal_page',cursorArgs(page.next));assert.equal(next.start,24);assert.equal(next.rows.length,Math.min(count-24,24));assert.deepEqual(call(other,'journal_page',cursorArgs(next.previous)).rows,page.rows);}
 }
 // Context composes real quota/onboarding/statistics without exposing another caller's rows.
 for(const file of ['20261023120000_onboarding_tour.sql','20261023130000_calendar_tour.sql','20261028120000_daily_entry_limit.sql','20261106140000_journal_request_context.sql']) {
  sql(readFileSync(new URL(`../supabase/migrations/${file}`,import.meta.url),'utf8'));
 }
 const context=call(owner,'journal_request_context');
 assert.equal(context.userId,owner);assert.equal(context.profile.id,owner);
 assert.equal(context.statistics.total,call(owner,'journal_statistics').total);
 assert.deepEqual(context.quota,call(owner,'get_entry_daily_quota'));
 const secondContext=call(other,'journal_request_context');
 assert.equal(secondContext.userId,other);assert.equal(secondContext.statistics.total,49);
 const shell=call(owner,'journal_request_context','false');
 assert.equal(shell.statistics,null);assert.equal(shell.quota,null);assert.deepEqual(shell.profile,context.profile);
 assert.equal(sql('set role anon; select public.journal_request_context() is null;'),'t');
 const guest=JSON.parse(asUser(owner,`set request.jwt.claims='{"is_anonymous":true}'; select public.journal_request_context();`));
 assert.equal(guest.quota,null);assert.equal(guest.userId,owner);
 assert.equal(guest.statistics.total,context.statistics.total);
 assert.throws(()=>asUser(owner,`select public.journal_request_context('${other}'::uuid);`),/does not exist/);
 // A quota outage must preserve the context and composer retry path.
 sql(`create or replace function public.get_entry_daily_quota() returns jsonb language plpgsql stable security definer set search_path='' as $$ begin raise exception 'quota_unavailable'; end; $$;`);
 const unavailableQuota=call(owner,'journal_request_context');
 assert.equal(unavailableQuota.quota,null);assert.equal(unavailableQuota.statistics.total,context.statistics.total);
 const plan=sql(`explain (analyze,buffers) select id,created_at from public.entries where user_id='${owner}' and hidden_at is null and owner_deleted_at is null order by created_at desc,id desc limit 24;`);
 writeFileSync('/tmp/grateful-navigation-plan.txt',plan);
 writeFileSync('/tmp/grateful-navigation-statistics-plan.txt',asUser(owner,'explain (analyze,buffers) select public.journal_statistics();'));
 writeFileSync('/tmp/grateful-navigation-page-plan.txt',asUser(owner,'explain (analyze,buffers) select public.journal_page();')); 
 console.log(`navigation DB checks passed: ${expected} visible entries, two accounts, RLS, ties, forward/back, target, public scope, counts; plan /tmp/grateful-navigation-plan.txt`);
} finally {
 if(started)execFileSync('pg_ctl',['-D',data,'-m','immediate','stop'],{stdio:'pipe'});
 rmSync(directory,{recursive:true,force:true});
}
