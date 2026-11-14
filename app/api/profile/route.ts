import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/profile/validation";
import { updateOwnProfile } from "@/lib/profile/mutations";

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ code: "profile_failed", error: "Not signed in." }, { status: 401 });
  }

  const parsed = updateProfileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const code = parsed.error.issues.some((issue) => issue.path[0] === "username") ? "invalid_username" : "invalid_profile";
    return NextResponse.json({ code, error: "Invalid profile." }, { status: 400 });
  }

  try {
    await updateOwnProfile(supabase, auth.user.id, parsed.data);
  } catch (error) {
    return NextResponse.json({ code: "profile_failed", error: error instanceof Error ? error.message : "Could not save profile." }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
