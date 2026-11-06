import type { JournalEntry, ProfileDashboard } from "@/lib/profile/types";
import { makeWeeklyRhythm, type WeeklyRhythmDay } from "@/lib/profile/weekly-rhythm";
import { makeMonthlyRhythm } from "@/lib/profile/monthly-rhythm";

export const profileAssets = {
  avatarDesktop: "/stitch/profile/avatar-desktop.jpg",
  avatarMobile: "/stitch/profile/avatar-mobile.jpg",
  coffeeDesktop: "/stitch/profile/coffee-desktop.jpg",
  coffeeMobile: "/stitch/profile/coffee-mobile.jpg",
  mascot: "/stitch/profile/mascot.jpg",
  park: "/stitch/profile/park.jpg",
  sprout: "/stitch/profile/sprout.jpg",
};

export type ProfileView = {
  requestedEntry?: string;
  pagination: ProfileDashboard["pagination"];
  initialEdge?: "first" | "last";
  avatarDesktop: string;
  avatarMobile: string;
  bio: string;
  displayName: string;
  email: string;
  entries: JournalEntry[];
  entryCount: number;
  publicCount: number;
  shareUrl: string;
  streak: number;
  weeklyRhythm: WeeklyRhythmDay[];
  monthlyRhythm: ReturnType<typeof makeMonthlyRhythm>;
  username: string;
};

export function toProfileView(dashboard: ProfileDashboard): ProfileView {
  const entries = dashboard.entries;
  const now = new Date();
  const displayName =
    dashboard.profile.displayName ||
    dashboard.profile.email?.split("@")[0] ||
    "";
  const shareSlug = slugify(displayName) || dashboard.profile.id;
  const username = dashboard.profile.username || shareSlug.replace(/-/g, "_");

  return {
    avatarDesktop: dashboard.profile.avatarUrl || profileAssets.avatarDesktop,
    avatarMobile: dashboard.profile.avatarUrl || profileAssets.avatarMobile,
    bio: dashboard.profile.bio || "",
    displayName,
    email: dashboard.profile.email || "",
    entries,
    pagination: dashboard.pagination,
    entryCount: dashboard.entryCount,
    publicCount: dashboard.statistics.publicTotal,
    shareUrl: `begrateful.app/share/${shareSlug}`,
    streak: dashboard.streak,
    weeklyRhythm: makeWeeklyRhythm([], dashboard.timezone, now).map((day) => ({ ...day, count: dashboard.statistics.weekBuckets[day.date] ?? 0, active: (dashboard.statistics.weekBuckets[day.date] ?? 0) > 0 })),
    monthlyRhythm: { ...makeMonthlyRhythm([], dashboard.timezone, now), activeDays: dashboard.statistics.currentMonthActiveDays, completionRate: dashboard.statistics.currentMonthActiveDays / makeMonthlyRhythm([], dashboard.timezone, now).totalDays },
    username,
  };
}

export function formatRelative(value: string, locale: string) {
  const diff = Date.now() - new Date(value).getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const minutes = Math.round(diff / 60000);
  const days = Math.round(diff / 86400000);

  if (minutes < 60) return rtf.format(-Math.max(minutes, 1), "minute");
  if (days < 7) return rtf.format(-Math.max(days, 1), "day");
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(value));
}

export function visibilityKey(value: JournalEntry["visibility"]) {
  return value;
}

// ponytail: legacy profile cards do not receive an i18n context yet; remove after they use profile.visibility directly.
export function visibilityLabel(value: JournalEntry["visibility"]) {
  return { private: "Riêng tư", public: "Công khai", anonymous: "Ẩn danh" }[value];
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
