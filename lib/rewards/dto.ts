export type BadgeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type RewardBadge = {
  id: BadgeId;
  category: "streak" | "habit" | "community";
  status: "earned" | "growing" | "locked";
  current: number;
  total: number;
  unit: "days" | "entries" | "gratitudes" | "returns";
  earnedAt: string | null;
};
export type RewardOverview = {
  timezone: string;
  stats: { currentStreak: number; longestStreak: number; totalEntries: number; activeDays: number; activeMonths: number; earnedBadges: number };
  badges: RewardBadge[];
};
export type RewardEntry = { id: string; created_at: string; visibility: string; gratitudes: string[] | null };
