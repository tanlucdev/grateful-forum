import type { UpdateProfileRequest } from "@/lib/profile/dto";
import type { ProfileDashboard } from "@/lib/profile/types";
import { fetchJson } from "./fetch-json";

export async function getOwnProfileDashboard() {
  const response = await fetch("/api/profile/me", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Could not load profile.");
  }

  return (await response.json()) as ProfileDashboard;
}

export function updateProfile(draft: UpdateProfileRequest) {
  return fetchJson<{ saved: boolean }>(
    "/api/profile",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    },
    "Could not save profile.",
  );
}
