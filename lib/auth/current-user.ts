import { cache } from "react";
import { timeLoader } from "@/lib/supabase/timing";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getVerifiedUser = cache(async () => timeLoader("auth", async () => {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user ?? null;
}));

export const getCurrentUser = cache(async () => {
  const user = await getVerifiedUser();
  return user?.is_anonymous ? null : user;
});
