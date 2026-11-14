import type { SoulTitle } from "./soul-titles";
import type { JournalStatistics } from "./queries";
import type { JournalPagination } from "./pagination";
import type { EntryKind, EntryMetadata, EntryVisibility, InkDocument } from "@/lib/entries/types";

export type ProfileRecord = {
  id: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  soulTitle?: SoulTitle;
  email?: string | null;
};

export type JournalEntry = {
  id: string;
  content: string;
  visibility: EntryVisibility;
  createdAt: string;
  metadata: EntryMetadata;
  entryKind: EntryKind;
  handwritingData: InkDocument | null;
  handwritingPreviewUrl: string | null;
};

export type ProfileDashboard = {
  statistics: JournalStatistics;
  pagination: JournalPagination;
  profile: ProfileRecord;
  entryCount: number;
  streak: number;
  timezone: string;
  entries: JournalEntry[];
};

export type PublicProfile = {
  pagination: JournalPagination;
  profile: ProfileRecord;
  publicEntryCount: number;
  streak: number;
  entries: JournalEntry[];
};

export type UpdateProfileRequest = {
  soulTitle?: SoulTitle;
  avatarUrl: string;
  bio: string;
  displayName: string;
  username: string;
};
