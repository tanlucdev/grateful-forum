"use client";

import type { EntryVisibility, LocalEntry } from "./types";

const KEY = "begrateful.entries";

export function getLocalEntries() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as LocalEntry[];
  } catch {
    return [];
  }
}

export function addLocalEntry(content: string, visibility: EntryVisibility) {
  const entry: LocalEntry = {
    id: crypto.randomUUID(),
    content,
    visibility,
    createdAt: new Date().toISOString(),
    synced: false,
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...getLocalEntries()]));
  return entry;
}

export function markLocalEntrySynced(id: string) {
  localStorage.setItem(
    KEY,
    JSON.stringify(
      getLocalEntries().map((entry) =>
        entry.id === id ? { ...entry, synced: true } : entry,
      ),
    ),
  );
}
