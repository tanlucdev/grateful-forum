import { timedSupabaseFetch } from "./timing";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "./env";

export function createSupabaseAdminClient() {
  const { url } = getSupabaseEnv();

  return createClient(url, getSupabaseServiceRoleKey(), {
    global: { fetch: timedSupabaseFetch },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
