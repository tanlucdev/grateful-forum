import type { FeedPage } from "@/lib/feed/types";
import type { EntryVisibility } from "@/lib/entries/types";

type ApiError = { error?: string };

async function fetchJson<T>(input: RequestInfo | URL, init: RequestInit, fallback: string) {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.error ?? fallback);
  }

  return data;
}

export function loadMoreFeed(cursor: string) {
  return fetchJson<FeedPage>(
    `/api/feed?cursor=${encodeURIComponent(cursor)}`,
    {},
    "Could not load more entries.",
  );
}

export function createEntry(content: string, visibility: EntryVisibility) {
  return fetchJson<{ saved?: boolean }>(
    "/api/entries",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, visibility }),
    },
    "Could not save entry.",
  );
}

export function updateProfile(draft: {
  avatarUrl: string;
  bio: string;
  displayName: string;
  username: string;
}) {
  return fetchJson<ApiError>(
    "/api/profile",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    },
    "Could not save profile.",
  );
}

export function reportEntry(entryId: string, reason: string) {
  return fetchJson<ApiError>(
    "/api/reports",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, reason }),
    },
    "Could not report entry.",
  );
}

export function updateModerationReport(input: {
  action: string;
  entryId?: string;
  reportId: string;
}) {
  return fetchJson<ApiError>(
    "/api/moderation",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    "Could not update moderation report.",
  );
}
