import { fetchJson } from "./fetch-json";

export function logout() {
  return fetchJson<{ signedOut: true }>(
    "/api/auth/logout",
    {
      credentials: "same-origin",
      method: "POST",
    },
    "Could not sign out.",
  );
}
