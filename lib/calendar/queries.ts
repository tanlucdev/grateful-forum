import type { SupabaseClient } from "@supabase/supabase-js";
import { entrySelect } from "@/lib/entries/records";

export async function queryCalendarData(supabase: SupabaseClient, userId: string, selectedStart: string, selectedEnd: string) {
  const selected = await supabase.from("entries").select(entrySelect).eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null).gte("created_at", selectedStart).lt("created_at", selectedEnd).order("created_at", { ascending: false }).order("id", { ascending: false }).limit(10);
  if (selected.error) throw new Error(selected.error.message);
  return { selected: selected.data ?? [] };
}

export async function queryCalendarTimezone(supabase: SupabaseClient, userId: string) {
  const profile = await supabase.from("profiles").select("timezone").eq("id", userId).maybeSingle();
  if (profile.error) throw new Error(profile.error.message);
  const timezone = profile.data?.timezone ?? "Asia/Ho_Chi_Minh";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return timezone;
  } catch {
    return "Asia/Ho_Chi_Minh";
  }
}
