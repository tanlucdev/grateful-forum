import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { GUEST_SESSION_COOKIE } from "./constants";

export async function getGuestId() {
  const store = await cookies();
  return store.get(GUEST_SESSION_COOKIE)?.value ?? null;
}

export async function ensureGuestId() {
  const store = await cookies();
  const existing = store.get(GUEST_SESSION_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const guestId = randomUUID();
  store.set(GUEST_SESSION_COOKIE, guestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return guestId;
}
