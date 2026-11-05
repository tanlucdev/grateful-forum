import type { BadgeId, RewardBadge, RewardEntry, RewardOverview } from "./dto.ts";

const dayMs = 86_400_000;
const dayNumber = (date: string) => Date.parse(`${date}T00:00:00Z`) / dayMs;

export function buildRewardOverview(entries: readonly RewardEntry[], timezone: string, now = new Date()): RewardOverview {
  const dateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" });
  const hourFormatter = new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hourCycle: "h23" });
  const today = dayNumber(dateFormatter.format(now));
  const history = entries.filter((entry) => Number.isFinite(Date.parse(entry.created_at)) && Date.parse(entry.created_at) <= now.getTime())
    .toSorted((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at) || a.id.localeCompare(b.id));
  const days = new Map<string, number>();
  const months = new Set<string>();
  const mornings = new Set<string>();
  const earned = new Map<BadgeId, string>();
  let previousDay: number | undefined;
  let run = 0;
  let longestStreak = 0;
  let anonymous = 0;
  let returns = 0;
  let mostGratitudes = 0;
  const award = (id: BadgeId, date: string) => { if (!earned.has(id)) earned.set(id, date); };
  const streakTargets = [[2, 3], [3, 7], [4, 14], [7, 21], [8, 30], [11, 100]] as const;

  for (const entry of history) {
    const timestamp = new Date(entry.created_at);
    const date = dateFormatter.format(timestamp);
    const day = dayNumber(date);
    if (!days.has(date)) {
      if (previousDay !== undefined && day - previousDay > 1) { returns++; award(5, entry.created_at); }
      run = previousDay !== undefined && day - previousDay === 1 ? run + 1 : 1;
      previousDay = day;
      longestStreak = Math.max(longestStreak, run);
    }
    days.set(date, (days.get(date) ?? 0) + (entry.gratitudes ?? []).filter((item) => item.trim()).length);
    months.add(date.slice(0, 7));
    mostGratitudes = Math.max(mostGratitudes, days.get(date)!);
    if (Number(hourFormatter.format(timestamp)) < 8) mornings.add(date);
    if (entry.visibility === "anonymous") anonymous++;
    award(1, entry.created_at);
    for (const [id, target] of streakTargets) if (run >= target) award(id, entry.created_at);
    if (mostGratitudes >= 3) award(6, entry.created_at);
    if (mornings.size >= 10) award(9, entry.created_at);
    if (anonymous >= 5) award(10, entry.created_at);
    if (days.size >= 365) award(12, entry.created_at);
  }

  const currentStreak = previousDay !== undefined && today - previousDay <= 1 ? run : 0;
  const badge = (id: BadgeId, category: RewardBadge["category"], current: number, total: number, unit: RewardBadge["unit"]): RewardBadge => ({
    id, category, current: earned.has(id) ? total : Math.min(current, total), total, unit,
    status: earned.has(id) ? "earned" : current > 0 ? "growing" : "locked", earnedAt: earned.get(id) ?? null,
  });
  const badges = [
    badge(1, "habit", history.length, 1, "entries"),
    badge(2, "streak", currentStreak, 3, "days"),
    badge(3, "streak", currentStreak, 7, "days"),
    badge(4, "streak", currentStreak, 14, "days"),
    badge(5, "habit", returns, 1, "returns"),
    badge(6, "habit", mostGratitudes, 3, "gratitudes"),
    badge(7, "streak", currentStreak, 21, "days"),
    badge(8, "streak", currentStreak, 30, "days"),
    badge(9, "habit", mornings.size, 10, "days"),
    badge(10, "community", anonymous, 5, "entries"),
    badge(11, "streak", currentStreak, 100, "days"),
    badge(12, "community", days.size, 365, "days"),
  ];
  return { timezone, stats: { currentStreak, longestStreak, totalEntries: history.length, activeDays: days.size, activeMonths: months.size, earnedBadges: badges.filter((item) => item.status === "earned").length }, badges };
}
