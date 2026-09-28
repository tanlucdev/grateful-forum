export function softDeleteEntryData(now = new Date()) {
  return { owner_deleted_at: now.toISOString() };
}
