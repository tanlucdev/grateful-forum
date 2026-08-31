import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ModerationReport = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  entryId: string;
  entry: {
    id: string;
    content: string;
    visibility: string;
    hiddenAt: string | null;
  } | null;
};

export async function loadAdminQueue() {
  if (!hasSupabaseEnv()) {
    return { admin: false, reports: [] as ModerationReport[] };
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return { admin: false, reports: [] as ModerationReport[] };
  }

  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("user_id")
    .eq("user_id", auth.user.id)
    .single();

  if (!adminRole) {
    return { admin: false, reports: [] as ModerationReport[] };
  }

  const { data } = await supabase
    .from("reports")
    .select("id, reason, status, created_at, entry_id")
    .order("created_at", { ascending: false })
    .limit(50);

  const entryIds = (data ?? []).map((report) => report.entry_id);
  const entriesById = new Map<string, { id: string; content: string; visibility: string; hidden_at: string | null }>();

  if (entryIds.length) {
    const { data: entries } = await supabase
      .from("entries")
      .select("id, content, visibility, hidden_at")
      .in("id", entryIds);

    entries?.forEach((entry) => {
      entriesById.set(entry.id, entry);
    });
  }

  return {
    admin: true,
    reports: (data ?? []).map((report) => {
      const entry = entriesById.get(report.entry_id);

      return {
        id: report.id,
        reason: report.reason,
        status: report.status,
        createdAt: report.created_at,
        entryId: report.entry_id,
        entry: entry
          ? {
              id: entry.id,
              content: entry.content,
              visibility: entry.visibility,
              hiddenAt: entry.hidden_at,
            }
          : null,
      };
    }),
  };
}
