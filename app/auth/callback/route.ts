import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getGuestId } from "@/lib/auth/guest-session";
import { migrateGuestData } from "@/lib/auth/migrate-guest-data";
import { GUEST_SESSION_COOKIE } from "@/lib/auth/constants";
import { safeAuthRedirect } from "@/lib/auth/redirects";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const safeNext = safeAuthRedirect(url.searchParams.get("next"), "/vi/feed");

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
    try {
      await migrateGuestData(createSupabaseAdminClient(), {
        guestId,
        userId: data.user.id,
      });
    } catch {
      return NextResponse.redirect(
        new URL("/?auth=migration-failed", url.origin),
      );
    }
  }

  const response = NextResponse.redirect(new URL(safeNext, url.origin));
  response.cookies.delete(GUEST_SESSION_COOKIE);
  return response;
}
