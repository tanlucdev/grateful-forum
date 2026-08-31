import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await request.json()) as {
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    bio?: string;
  };

  const displayName = body.displayName?.trim() || "Grateful human";
  const username = body.username?.trim().toLowerCase() || null;
  const avatarUrl = body.avatarUrl?.trim() || null;
  const bio = body.bio?.trim() || null;

  if (username && !/^[a-z0-9_]{3,24}$/.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-24 chars: lowercase letters, numbers, underscore." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("profiles").upsert({
    id: auth.user.id,
    display_name: displayName,
    username,
    avatar_url: avatarUrl,
    bio,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
