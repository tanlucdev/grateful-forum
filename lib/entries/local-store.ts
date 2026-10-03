"use client";

import type { EntryVisibility, InkDocument, LocalDraft, LocalEntry, LocalHandwrittenEntry } from "./types";

const KEY = "begrateful.entries";
const DRAFT_KEY = "begrateful.drafts";
const HANDWRITTEN_KEY = "begrateful.handwritten-entries";

export function getLocalEntries() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as LocalEntry[];
  } catch {
    return [];
  }
}

export function getLocalDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "[]") as LocalDraft[];
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

export function addLocalHandwrittenEntry(document: InkDocument, visibility: EntryVisibility) {
  const entry: LocalHandwrittenEntry = {
    id: crypto.randomUUID(),
    document,
    visibility,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(HANDWRITTEN_KEY, JSON.stringify([entry, ...getLocalHandwrittenEntries()]));
  return entry;
}

export function getLocalHandwrittenEntries() {
  try {
    return JSON.parse(localStorage.getItem(HANDWRITTEN_KEY) ?? "[]") as LocalHandwrittenEntry[];
  } catch {
    return [];
  }
}

export function addLocalDraft(content: string, mood: string) {
  const draft: LocalDraft = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    mood,
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify([draft, ...getLocalDrafts()]));
  return draft;
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

export function removeLocalDraft(id: string) {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(getLocalDrafts().filter((draft) => draft.id !== id)),
  );
}
