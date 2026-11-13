import type { SupabaseClient } from "@supabase/supabase-js";
import { safeLocalizedAuthRedirect } from "./redirects.ts";

export async function startGoogleSignIn(
  supabase: SupabaseClient,
  origin: string,
  next: string,
  locale: string,
) {
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", safeLocalizedAuthRedirect(next, locale));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.toString(), skipBrowserRedirect: true },
  });
  if (error || !data.url) throw new Error("google_sign_in_failed");
  return data.url;
}
