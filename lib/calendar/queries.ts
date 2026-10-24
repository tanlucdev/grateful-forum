import type { SupabaseClient } from "@supabase/supabase-js";
import { entrySelect } from "@/lib/entries/records";
import { isMissingTimezoneColumn, shouldFallbackCalendarTour } from "./errors.ts";

export async function queryCalendarProfile(supabase: SupabaseClient, userId: string) {
  const profile = await supabase.from("profiles").select("timezone, calendar_tour_seen_at").eq("id", userId).maybeSingle();
  let timezoneValue: string | null | undefined = profile.data?.timezone;
  const calendarTourSeenAt: string | null = profile.data?.calendar_tour_seen_at ?? null;
  let calendarTourAvailable = !profile.error;

  if (shouldFallbackCalendarTour(profile.error)) {
    const fallback = await supabase.from("profiles").select("timezone").eq("id", userId).maybeSingle();
    if (fallback.error && !isMissingTimezoneColumn(fallback.error.message)) throw new Error(fallback.error.message);
    timezoneValue = fallback.data?.timezone;
    calendarTourAvailable = false;
  } else if (profile.error && !isMissingTimezoneColumn(profile.error.message)) {
    throw new Error(profile.error.message);
  }

  let timezone = "Asia/Ho_Chi_Minh";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezoneValue ?? "Asia/Ho_Chi_Minh" });
    timezone = timezoneValue ?? "Asia/Ho_Chi_Minh";
  } catch {
    // Keep the calendar usable when a stored timezone is no longer valid.
  }
  return { calendarTourAvailable, calendarTourSeenAt, timezone };
}

export async function queryCalendarTimezone(supabase: SupabaseClient, userId: string) {
  return (await queryCalendarProfile(supabase, userId)).timezone;
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
    supabase.from("entries").select("id, created_at").eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null).gte("created_at", yearStart).lt("created_at", yearEnd),
    supabase.from("entries").select("created_at").eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null).order("created_at", { ascending: true }),
    supabase.from("entries").select(entrySelect).eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null).gte("created_at", selectedStart).lt("created_at", selectedEnd).order("created_at", { ascending: false }).limit(10),
    supabase.from("entries").select("id", { count: "exact", head: true }).eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null),
    supabase.from("entries").select("id", { count: "exact", head: true }).eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null).gte("created_at", previousStart).lt("created_at", previousEnd),
  ]);
  const error = [year, history, selected, total, previous].find((result) => result.error)?.error;
  if (error) throw new Error(error.message);
  return { year: year.data ?? [], history: history.data ?? [], selected: selected.data ?? [], total: total.count ?? 0, previous: previous.count ?? 0 };
}
