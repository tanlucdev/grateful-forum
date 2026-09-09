import type { EntryMetadata, EntryVisibility } from "@/lib/entries/types";

export type CalendarView = "year" | "six-months" | "month" | "week";

export type CalendarEntry = {
  id: string;
  content: string;
  createdAt: string;
  visibility: EntryVisibility;
  metadata: EntryMetadata;
};

export type CalendarYearDay = { count: number; date: string; inYear: boolean; isToday: boolean };
export type CalendarMonthDay = { count: number; date: string; day: number; inMonth: boolean; isToday: boolean; href: string };
export type CalendarBadge = { emoji: string; title: string; description: string; status: string; progress: number; unlockedAt: string | null };

export type CalendarOverview = {
  timezone: string;
  view: CalendarView;
  period: {
    year: number;
    month: number;
    selectedDate: string;
    todayDate: string;
    monthLabel: string;
    selectedDateLabel: string;
    gardenTitle: string;
    gardenRangeLabel: string;
  };
  filters: { key: CalendarView; label: string; active: boolean; href: string }[];
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
  garden: { yearDays: CalendarYearDay[]; visibleDays: CalendarYearDay[]; totalFlowers: number; todayCount: number; todayStreakLabel: string };
  monthDays: CalendarMonthDay[];
  selectedEntries: CalendarEntry[];
  badges: CalendarBadge[];
  mascot: { level: number; maxLevel: number; label: string; progress: number; daysToNextLevel: number; whisper: string };
};
