import type { EntryMetadata, EntryVisibility } from "@/lib/entries/types";

export type CalendarEntry = {
  id: string;
  content: string;
  createdAt: string;
  visibility: EntryVisibility;
  metadata: EntryMetadata;
};

export type CalendarDay = {
  count: number;
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
};

export type CalendarYearDay = {
  count: number;
  date: string;
  inYear: boolean;
  isToday: boolean;
};

export type CalendarOverview = {
  year: number;
  month: number;
  monthLabel: string;
  todayLabel: string;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  monthEntries: number;
  activeDaysThisMonth: number;
  monthCompletionRate: number;
  daysElapsedInMonth: number;
  daysInMonth: number;
  todayEntries: CalendarEntry[];
  monthDays: CalendarDay[];
  yearDays: CalendarYearDay[];
};
