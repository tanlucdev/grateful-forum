import type { EntryKind, EntryMetadata, EntryVisibility } from "@/lib/entries/types";

export type CalendarView = "year" | "six-months" | "month" | "week";

export type CalendarEntry = {
  id: string;
  content: string;
  createdAt: string;
  visibility: EntryVisibility;
  metadata: EntryMetadata;
  entryKind: EntryKind;
  handwritingPreviewUrl: string | null;
};

export type CalendarYearDay = { count: number; date: string; inYear: boolean; isToday: boolean };
export type CalendarMonthDay = { count: number; date: string; day: number; inMonth: boolean; isToday: boolean; href: string };
export type CalendarBadge = {
  id: "firstWeek" | "steadySprout" | "morningSun" | "openHeart";
  emoji: string;
  progress: number;
  current: number;
  target: number;
  unlocked: boolean;
};

export type CalendarOverview = {
  timezone: string;
  view: CalendarView;
  period: {
    year: number;
    month: number;
    selectedDate: string;
    todayDate: string;
  };
  filters: { key: CalendarView; active: boolean; href: string }[];
  stats: {
    currentStreak: number;
    longestStreak: number;
    totalEntries: number;
    monthEntries: number;
    activeDaysThisMonth: number;
    daysElapsedInMonth: number;
    monthCompletionRate: number;
    entriesDeltaFromPreviousMonth: number;
  };
  garden: { yearDays: CalendarYearDay[]; visibleDays: CalendarYearDay[]; totalFlowers: number; todayCount: number };
  monthDays: CalendarMonthDay[];
  selectedEntries: CalendarEntry[];
  badges: CalendarBadge[];
  mascot: { level: number; maxLevel: number; progress: number; daysToNextLevel: number };
};
