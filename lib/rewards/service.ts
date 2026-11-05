import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { queryRewardData } from "./repository";
import { buildRewardOverview } from "./stats";

export class RewardAuthError extends Error {}
export class RewardConfigError extends Error {}

export async function loadRewardOverview() {
  if (!hasSupabaseEnv()) throw new RewardConfigError();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error && (!error.status || error.status >= 500)) throw new Error("Could not verify reward session.");
  if (error || !data.user) throw new RewardAuthError();
  const now = new Date();
  const { entries, timezone } = await queryRewardData(supabase, data.user.id, now.toISOString());
  return buildRewardOverview(entries, timezone, now);
}
