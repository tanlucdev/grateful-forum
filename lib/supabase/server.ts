import { createServerClient } from "@supabase/ssr";
import { cache } from "react";
import { timedSupabaseFetch } from "./timing";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

export const createSupabaseServerClient = cache(async () => {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    global: { fetch: timedSupabaseFetch },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Read-only contexts can ignore writes here; middleware will handle refresh.
        }
      },
    },
  });
});
