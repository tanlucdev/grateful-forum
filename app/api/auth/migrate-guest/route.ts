import { NextResponse } from "next/server";
import { GUEST_SESSION_COOKIE } from "@/lib/auth/constants";
import { getGuestId } from "@/lib/auth/guest-session";
import { migrateGuestData } from "@/lib/auth/migrate-guest-data";
import { parseBearerToken } from "@/lib/auth/bearer-token";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { code: "auth_unconfigured", error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const serverSupabase = await createSupabaseServerClient();
  const bearer = parseBearerToken(request.headers.get("authorization"));

  if (!bearer.ok) {
    return NextResponse.json(
      { code: "auth_invalid_session", error: "Phiên đăng nhập không hợp lệ." },
      { status: 401 },
    );
  }

  const { data: auth, error: authError } = bearer.token
    ? await serverSupabase.auth.getUser(bearer.token)
    : await serverSupabase.auth.getUser();

  if (authError || !auth.user) {
    return NextResponse.json(
      { code: "auth_invalid_session", error: "Phiên đăng nhập không hợp lệ." },
      { status: 401 },
    );
  }

  let supabase: ReturnType<typeof createSupabaseAdminClient>;

  try {
    supabase = createSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      { code: "auth_unconfigured", error: "Supabase service role chưa được cấu hình." },
      { status: 503 },
    );
  }

  const guestId = await getGuestId();

  if (!guestId) {
    return NextResponse.json({ migrated: false });
  }

  try {
    await migrateGuestData(supabase, {
      guestId,
      userId: auth.user.id,
    });
  } catch {
    return NextResponse.json(
      { code: "guest_migration_failed", error: "Không thể chuyển dữ liệu khách." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ migrated: true });
  response.cookies.delete(GUEST_SESSION_COOKIE);
  return response;
}
