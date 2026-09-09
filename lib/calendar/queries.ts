import type { SupabaseClient } from "@supabase/supabase-js";
import { entrySelect } from "@/lib/entries/records";
import { isMissingTimezoneColumn } from "./errors.ts";

export async function queryCalendarTimezone(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.from("profiles").select("timezone").eq("id", userId).maybeSingle();
  if (error && !isMissingTimezoneColumn(error.message)) throw new Error(error.message);
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: data?.timezone ?? "Asia/Ho_Chi_Minh" });
    return data?.timezone ?? "Asia/Ho_Chi_Minh";
  } catch {
    return "Asia/Ho_Chi_Minh";
  }
}

export async function queryCalendarData(
  supabase: SupabaseClient,
  userId: string,
  yearStart: string,
  yearEnd: string,
  selectedStart: string,
  selectedEnd: string,
  previousStart: string,
  previousEnd: string,
) {
  const [year, history, selected, total, previous] = await Promise.all([
    supabase.from("entries").select("id, created_at").eq("user_id", userId).is("hidden_at", null).gte("created_at", yearStart).lt("created_at", yearEnd),
    supabase.from("entries").select("created_at").eq("user_id", userId).is("hidden_at", null).order("created_at", { ascending: true }),
    supabase.from("entries").select(entrySelect).eq("user_id", userId).is("hidden_at", null).gte("created_at", selectedStart).lt("created_at", selectedEnd).order("created_at", { ascending: false }).limit(10),
    supabase.from("entries").select("id", { count: "exact", head: true }).eq("user_id", userId).is("hidden_at", null),
    supabase.from("entries").select("id", { count: "exact", head: true }).eq("user_id", userId).is("hidden_at", null).gte("created_at", previousStart).lt("created_at", previousEnd),
  ]);
  const error = [year, history, selected, total, previous].find((result) => result.error)?.error;
  if (error) throw new Error(error.message);
  return { year: year.data ?? [], history: history.data ?? [], selected: selected.data ?? [], total: total.count ?? 0, previous: previous.count ?? 0 };
}
