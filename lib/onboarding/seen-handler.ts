import { markOnboardingTourSeenSchema } from "./schema.ts";

type OnboardingSeenClient = {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
};

type OnboardingSeenDependencies<T extends OnboardingSeenClient> = {
  createClient: () => Promise<T>;
  isConfigured: () => boolean;
  recordSeen: (supabase: T, userId: string) => Promise<void>;
};

export function createOnboardingSeenHandler<T extends OnboardingSeenClient>({
  createClient,
  isConfigured,
  recordSeen,
}: OnboardingSeenDependencies<T>) {
  return async function POST(request: Request) {
    const parsed = markOnboardingTourSeenSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) {
      return Response.json(
        { code: "onboarding_invalid_input", error: "Invalid onboarding request." },
        { status: 400 },
      );
    }

    if (!isConfigured()) {
      return Response.json(
        { code: "onboarding_unavailable", error: "Onboarding is unavailable." },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return Response.json(
        { code: "onboarding_unauthorized", error: "Not signed in." },
        { status: 401 },
      );
    }

    try {
      await recordSeen(supabase, auth.user.id);
    } catch {
      return Response.json(
        { code: "onboarding_failed", error: "Could not save onboarding progress." },
        { status: 500 },
      );
    }

    return Response.json({ seen: true });
  };
}
