// Run: node tests/daily-quota-db.test.mjs (requires local PostgreSQL binaries).
import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const directory = mkdtempSync(join(tmpdir(), "grateful-quota-"));
const data = join(directory, "data");
const port = "55439";
const args = ["-X", "-v", "ON_ERROR_STOP=1", "-h", directory, "-p", port, "-d", "postgres", "-At"];
const sql = (input) => execFileSync("psql", args, { input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
let started = false;
try {
  execFileSync("initdb", ["-D", data, "-A", "trust", "--no-locale", "-E", "UTF8"], { stdio: "pipe" });
  execFileSync("pg_ctl", ["-D", data, "-o", `-k ${directory} -p ${port} -h ''`, "-l", join(directory, "server.log"), "start"], { stdio: "pipe" });
  started = true;
  sql(`
    create role anon; create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create function auth.jwt() returns jsonb language sql stable as $$ select '{"is_anonymous":false}'::jsonb $$;
    create type public.entry_visibility as enum ('private', 'public', 'anonymous');
    create table public.entries (
      id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
      content text, visibility public.entry_visibility default 'private', created_at timestamptz default now(),
      hidden_at timestamptz, owner_deleted_at timestamptz
    );
    insert into auth.users values ('00000000-0000-4000-8000-000000000001'), ('00000000-0000-4000-8000-000000000002');
    insert into public.entries (user_id, content, owner_deleted_at) values ('00000000-0000-4000-8000-000000000002', 'existing deleted entry', now());
  `);
  sql(readFileSync(new URL("../supabase/migrations/20261028120000_daily_entry_limit.sql", import.meta.url), "utf8"));
  const owner = "00000000-0000-4000-8000-000000000001";
  const existingOwner = "00000000-0000-4000-8000-000000000002";
  const results = await Promise.allSettled(Array.from({ length: 12 }, (_, index) => run("psql", [...args, "-c", `insert into public.entries (user_id, content, visibility, created_at) values ('${owner}', 'entry ${index}', '${["private", "public", "anonymous"][index % 3]}', '2000-01-01')`])));
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 3, "Exactly 3 of 12 concurrent requests may commit");
  for (const result of results.filter((result) => result.status === "rejected")) assert.match(result.reason.stderr, /daily_entry_limit/);
  assert.equal(sql(`select count(*) from public.entries where user_id = '${owner}'`), "3");
  assert.equal(sql(`select bool_and(created_at > now() - interval '1 minute') from public.entries where user_id = '${owner}'`), "t", "Forged timestamps must be replaced");
  assert.equal(sql(`select used from public.entry_daily_usage where user_id = '${existingOwner}'`), "1", "Existing soft-deleted entries count");
  sql(`update public.entries set owner_deleted_at = now(), hidden_at = now() where user_id = '${owner}'; delete from public.entries where user_id = '${owner}';`);
  assert.throws(() => sql(`insert into public.entries (user_id, content) values ('${owner}', 'after deletion')`), /daily_entry_limit/);
  sql(`begin; insert into public.entries (user_id, content) values ('${existingOwner}', 'rolled back'); rollback;`);
  assert.equal(sql(`select used from public.entry_daily_usage where user_id = '${existingOwner}'`), "1", "Rollback must restore allowance");
  assert.throws(() => sql(`update public.entries set created_at = '2000-01-01' where user_id = '${existingOwner}'`), /entry_identity_immutable/);
  assert.throws(() => sql(`update public.entries set user_id = '${owner}' where user_id = '${existingOwner}'`), /entry_identity_immutable/);
  assert.throws(() => sql("set role authenticated; update public.entry_daily_usage set used = 0"), /permission denied/);
  const quota = JSON.parse(sql(`set request.jwt.claim.sub = '${owner}'; select public.get_entry_daily_quota();`).split("\n").at(-1));
  assert.equal(quota.remaining, 0);
  assert.equal(quota.limit, 3);
  assert.ok(Date.parse(quota.resetsAt) > Date.now());
  sql(`insert into public.entries (content) values ('legacy'); update public.entries set user_id = '${existingOwner}' where user_id is null;`);
  console.log("PostgreSQL quota: concurrency, deletion, rollback, timestamps, ownership, permissions, quota RPC and legacy transfer passed");
} finally {
  if (started) execFileSync("pg_ctl", ["-D", data, "stop", "-m", "fast"], { stdio: "pipe" });
  rmSync(directory, { recursive: true, force: true });
}
