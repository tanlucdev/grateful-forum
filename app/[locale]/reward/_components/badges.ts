export type Badge = {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  category: "streak" | "habit" | "community";
  status: "earned" | "growing" | "locked";
  date?: string;
  current?: number;
  total?: number;
  unit?: "days" | "posts";
};

// ponytail: illustrative Stitch collection; use earned badge data when rewards ship.
export const badges: readonly Badge[] = [
  { id: 1, category: "habit", status: "earned", date: "2024-09-01" },
  { id: 2, category: "streak", status: "earned", date: "2024-09-04" },
  { id: 3, category: "streak", status: "earned", date: "2024-09-11" },
  { id: 4, category: "streak", status: "earned", date: "2024-09-18" },
  { id: 5, category: "habit", status: "earned", date: "2024-09-25" },
  { id: 6, category: "habit", status: "earned", date: "2024-10-02" },
  { id: 7, category: "streak", status: "growing", current: 14, total: 21, unit: "days" },
  { id: 8, category: "streak", status: "growing", current: 14, total: 30, unit: "days" },
  { id: 9, category: "habit", status: "growing", current: 7, total: 10, unit: "days" },
  { id: 10, category: "community", status: "locked", current: 2, total: 5, unit: "posts" },
  { id: 11, category: "streak", status: "locked", current: 14, total: 100, unit: "days" },
  { id: 12, category: "community", status: "locked", current: 128, total: 365, unit: "days" },
];
