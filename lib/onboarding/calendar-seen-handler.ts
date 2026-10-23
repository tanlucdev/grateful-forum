import { markCalendarTourSeenSchema } from "./schema.ts";

type CalendarSeenClient = {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
};

type CalendarSeenDependencies<T extends CalendarSeenClient> = {
  createClient: () => Promise<T>;
  isConfigured: () => boolean;
  recordSeen: (supabase: T, userId: string) => Promise<void>;
};

export function createCalendarSeenHandler<T extends CalendarSeenClient>({
  createClient,
  isConfigured,
  recordSeen,
}: CalendarSeenDependencies<T>) {
  return async function POST(request: Request) {
    const parsed = markCalendarTourSeenSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ code: "calendar_onboarding_invalid_input", error: "Invalid calendar onboarding request." }, { status: 400 });
    if (!isConfigured()) return Response.json({ code: "calendar_onboarding_unavailable", error: "Calendar onboarding is unavailable." }, { status: 503 });

    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return Response.json({ code: "calendar_onboarding_unauthorized", error: "Not signed in." }, { status: 401 });

    try {
      await recordSeen(supabase, auth.user.id);
    } catch {
      return Response.json({ code: "calendar_onboarding_failed", error: "Could not save calendar onboarding progress." }, { status: 500 });
    }

    return Response.json({ seen: true });
  };
}
