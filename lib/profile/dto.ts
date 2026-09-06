import type { EntryVisibility } from "@/lib/entries/types";

export type ProfileRecord = {
  id: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  email?: string | null;
};

export type JournalEntry = {
  id: string;
  content: string;
  visibility: EntryVisibility;
  createdAt: string;
};

export type ProfileDashboard = {
  profile: ProfileRecord;
  entryCount: number;
  streak: number;
  entries: JournalEntry[];
};

export type PublicProfile = {
  profile: ProfileRecord;
  publicEntryCount: number;
  streak: number;
  entries: JournalEntry[];
};

export type UpdateProfileRequest = {
  avatarUrl: string;
  bio: string;
  displayName: string;
  username: string;
};
