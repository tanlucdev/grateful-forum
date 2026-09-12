import type { JournalEntry, ProfileDashboard } from "@/lib/profile/types";
import { makeWeeklyRhythm, type WeeklyRhythmDay } from "@/lib/profile/weekly-rhythm";

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
  username: string;
};

export function toProfileView(dashboard: ProfileDashboard): ProfileView {
  const entries = dashboard.entries;
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
    entryCount: dashboard.entryCount,
    publicCount: entries.filter((entry) => entry.visibility === "public").length,
    shareUrl: `begrateful.app/share/${shareSlug}`,
    streak: dashboard.streak,
    weeklyRhythm: makeWeeklyRhythm(entries, dashboard.timezone),
    username,
  };
}

export function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (hours < 24) {
    return "Hôm nay, 08:30";
  }

  if (days === 1) {
    return "Hôm qua, 21:15";
  }

  return new Intl.DateTimeFormat("vi", {
    day: "2-digit",
    month: "long",
  }).format(new Date(value));
}

export function visibilityLabel(value: JournalEntry["visibility"]) {
  if (value === "public") {
    return "Công khai";
  }

  if (value === "anonymous") {
    return "Ẩn danh";
  }

  return "Riêng tư";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
