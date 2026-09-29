import { fetchJson } from "./fetch-json";

type AuthApiError = { code?: string };

export async function registerAccount(input: {
  displayName: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/register", {
    body: JSON.stringify(input),
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  return response.ok ? null : readAuthApiError(response);
}

export async function migrateGuestData(accessToken: string) {
  const response = await fetch("/api/auth/migrate-guest", {
    credentials: "same-origin",
    headers: { authorization: `Bearer ${accessToken}` },
    method: "POST",
  });
  return response.ok ? null : readAuthApiError(response);
}

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

async function readAuthApiError(response: Response) {
  const body = (await response.json().catch(() => null)) as AuthApiError | null;
  return body?.code;
}
