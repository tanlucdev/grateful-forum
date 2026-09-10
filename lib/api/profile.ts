import type { UpdateProfileRequest } from "@/lib/profile/dto";
import { fetchJson } from "./fetch-json";

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
