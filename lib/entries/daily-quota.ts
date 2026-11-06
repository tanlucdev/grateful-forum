export const DAILY_ENTRY_LIMIT = 3;
export type EntryDailyQuota = { limit: number; remaining: number; resetsAt: string };

export function nextEntryQuotaReset(now = new Date()) {
  const vietnamOffset = 7 * 60 * 60 * 1000;
  const day = 24 * 60 * 60 * 1000;
  return new Date(Math.floor((now.getTime() + vietnamOffset) / day) * day + day - vietnamOffset).toISOString();
}

export function dailyQuotaFailure(error: unknown, now = new Date()) {
  if (!(error instanceof Error) || !error.message.includes("daily_entry_limit")) return null;
  const resetsAt = nextEntryQuotaReset(now);
  return {
    body: { code: "daily_entry_limit", error: "Daily entry limit reached.", limit: DAILY_ENTRY_LIMIT, remaining: 0, resetsAt },
    headers: { "Retry-After": String(Math.max(1, Math.ceil((Date.parse(resetsAt) - now.getTime()) / 1000))), "Cache-Control": "private, no-store" },
  };
}
