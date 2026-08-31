import { NextResponse } from "next/server";
import { ensureGuestId } from "@/lib/auth/guest-session";

export async function POST() {
  const guestId = await ensureGuestId();
  return NextResponse.json({ guestId });
}
