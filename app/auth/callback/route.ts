import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getGuestId } from "@/lib/auth/guest-session";
import { migrateGuestData } from "@/lib/auth/migrate-guest-data";
import { GUEST_SESSION_COOKIE } from "@/lib/auth/constants";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(new URL("/?auth=missing-code", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/?auth=failed", url.origin));
  }

  const guestId = await getGuestId();
  if (guestId) {
    await migrateGuestData(createSupabaseAdminClient(), {
      guestId,
      userId: data.user.id,
    });
  }

  const response = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.delete(GUEST_SESSION_COOKIE);
  return response;
}
