import assert from "node:assert/strict";
import { localizedLoginHref, loginHref, safeAuthRedirect, safeLocalizedAuthRedirect } from "../lib/auth/redirects.ts";

assert.equal(safeAuthRedirect("/profile?tab=moments"), "/profile?tab=moments");
assert.equal(safeAuthRedirect("https://bad.test"), "/feed");
assert.equal(safeAuthRedirect("//bad.test"), "/feed");
assert.equal(loginHref("/calendar?month=9&year=2026"), "/auth?next=%2Fcalendar%3Fmonth%3D9%26year%3D2026");
assert.equal(loginHref("/profile"), "/auth?next=%2Fprofile");
assert.equal(loginHref("/calendar?month=9&year=2026", "en"), "/auth?next=%2Fen%2Fcalendar%3Fmonth%3D9%26year%3D2026");
assert.equal(localizedLoginHref("/profile", "vi"), "/vi/auth?next=%2Fvi%2Fprofile");
assert.equal(safeLocalizedAuthRedirect("/en/feed", "vi"), "/en/feed");
assert.equal(safeLocalizedAuthRedirect("//bad.test", "en"), "/en/feed");

// URL parsing treats backslashes and control characters as URL separators.
for (const unsafe of ["/\\evil.test", "/\n/evil.test", "/\t/evil.test", "/\r/evil.test"]) {
  assert.equal(safeAuthRedirect(unsafe), "/feed");
  assert.equal(safeLocalizedAuthRedirect(unsafe, "en"), "/en/feed");
}

const { startGoogleSignIn } = await import("../lib/auth/google.ts");
type SupabaseClient = import("@supabase/supabase-js").SupabaseClient;
for (const locale of ["vi", "en"]) {
  for (const next of ["/profile?tab=moments", "/en/calendar", "//evil.test", "/\\evil.test"]) {
    const client = { auth: { signInWithOAuth: async (input: unknown) => {
      const callback = new URL("/auth/callback", "https://grateful.test");
      callback.searchParams.set("next", safeLocalizedAuthRedirect(next, locale));
      assert.deepEqual(input, { provider: "google", options: { redirectTo: callback.toString(), skipBrowserRedirect: true } });
      return { data: { url: "https://accounts.google.com/fixture" }, error: null };
    } } } as unknown as SupabaseClient;
    assert.equal(await startGoogleSignIn(client, "https://grateful.test", next, locale), "https://accounts.google.com/fixture");
  }
}
for (const result of [{ data: { url: null }, error: null }, { data: { url: "https://unused.test" }, error: { message: "Provider disabled" } }]) {
  const client = { auth: { signInWithOAuth: async () => result } } as unknown as SupabaseClient;
  await assert.rejects(startGoogleSignIn(client, "https://grateful.test", "/feed", "vi"), /google_sign_in_failed/);
}
console.log("Google OAuth and safe return path checks passed");

// Exercise the callback with isolated auth/migration dependencies; no external accounts.
const { registerHooks } = await import("node:module");
const fixture = { guest: null as string | null, error: false, migrationError: false, migrations: 0, exchanges: 0 };
Object.assign(globalThis, { __googleCallbackFixture: fixture });
const moduleSource = (text: string) => ({ url: `data:text/javascript,${encodeURIComponent(text)}`, shortCircuit: true as const });
const hooks = registerHooks({ resolve(specifier, context, next) {
  if (specifier === "@/lib/supabase/server") return moduleSource(`export const createSupabaseServerClient = async () => ({auth:{exchangeCodeForSession:async code => {const f=globalThis.__googleCallbackFixture;f.exchanges++;return {data:{user:f.error?null:{id:'member'}},error:f.error?{}:null};}}});`);
  if (specifier === "@/lib/auth/guest-session") return moduleSource("export const getGuestId = async () => globalThis.__googleCallbackFixture.guest;");
  if (specifier === "@/lib/supabase/admin") return moduleSource("export const createSupabaseAdminClient = () => ({});");
  if (specifier === "@/lib/auth/migrate-guest-data") return moduleSource("export const migrateGuestData = async () => { const f=globalThis.__googleCallbackFixture; f.migrations++; if(f.migrationError) throw Error('migration'); };");
  if (specifier.startsWith("@/lib/auth/")) return next(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
  if (specifier === "next/server") return next("next/server.js", context);
  return next(specifier, context);
} });
try {
  const { GET } = await import("../app/auth/callback/route.ts");
  for (const locale of ["vi", "en"]) {
    const next = `/${locale}/profile?tab=moments`;
    const callback = new URL("https://grateful.test/auth/callback");
    callback.searchParams.set("next", next);
    for (const scenario of ["cancel", "missing-code", "invalid-code", "migration-failed", "success"]) {
      callback.searchParams.delete("error");
      callback.searchParams.delete("code");
      if (scenario === "cancel") callback.searchParams.set("error", "access_denied");
      else if (scenario !== "missing-code") callback.searchParams.set("code", "fixture");
      Object.assign(fixture, { guest: "guest", error: scenario === "invalid-code", migrationError: scenario === "migration-failed", migrations: 0, exchanges: 0 });
      const response = await GET(new Request(callback));
      const target = new URL(response.headers.get("location")!);
      assert.equal(target.origin, "https://grateful.test");
      if (scenario === "success") {
        assert.equal(target.pathname + target.search, next);
        assert.match(response.headers.get("set-cookie")!, /Expires=Thu, 01 Jan 1970/);
        assert.equal(fixture.migrations, 1);
      } else {
        assert.equal(target.pathname, `/${locale}/auth`);
        assert.equal(target.searchParams.get("next"), next);
        assert.equal(target.searchParams.get("authError"), scenario === "migration-failed" ? "migration" : "oauth");
        assert.equal(response.headers.get("set-cookie"), null, "Retain guest cookie on failure");
      }
      if (scenario === "cancel" || scenario === "missing-code") assert.equal(fixture.exchanges, 0);
    }
  }
} finally {
  hooks.deregister();
  Reflect.deleteProperty(globalThis, "__googleCallbackFixture");
}
console.log("OAuth callback success, cancellation, session failure and migration checks passed");
