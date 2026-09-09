import type { CalendarBadge, CalendarMonthDay, CalendarView, CalendarYearDay } from "./dto";

const dayMs = 86_400_000;
const key = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (date: string, amount: number) => key(new Date(Date.parse(`${date}T00:00:00Z`) + amount * dayMs));
const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();
const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;

export function localDateKey(value: string, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export function bucketDates(values: string[], timezone: string) {
  const buckets = new Map<string, number>();
  values.forEach((value) => {
    const date = localDateKey(value, timezone);
    buckets.set(date, (buckets.get(date) ?? 0) + 1);
  });
  return buckets;
}

export function getCalendarStreaks(dates: string[], today: string) {
  const active = new Set(dates);
  let currentStreak = 0;
  if (active.has(today)) {
    for (let cursor = today; active.has(cursor); cursor = addDays(cursor, -1)) currentStreak += 1;
  }
  let longestStreak = 0;
  let run = 0;
  for (const date of [...active].sort()) {
    run = active.has(addDays(date, -1)) ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  }
  return { currentStreak, longestStreak };
}

export function makeYearDays(year: number, buckets: Map<string, number>, today: string): CalendarYearDay[] {
  const total = new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1 ? 366 : 365;
  return Array.from({ length: total }, (_, index) => {
    const date = addDays(`${year}-01-01`, index);
    return { date, count: buckets.get(date) ?? 0, inYear: true, isToday: date === today };
  });
}

export function makeMonthDays(year: number, month: number, buckets: Map<string, number>, today: string, href: (date: string) => string): CalendarMonthDay[] {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const offset = (firstDay + 6) % 7;
  const total = Math.ceil((offset + daysInMonth(year, month)) / 7) * 7;
  const currentMonth = monthKey(year, month);
  return Array.from({ length: total }, (_, index) => {
    const date = addDays(`${currentMonth}-01`, index - offset);
    return { date, count: buckets.get(date) ?? 0, day: Number(date.slice(8)), inMonth: date.startsWith(currentMonth), isToday: date === today, href: href(date) };
  });
}

export function visibleYearDays(yearDays: CalendarYearDay[], view: CalendarView, year: number, month: number, selectedDate: string) {
  if (view === "year") return yearDays;
  const start = view === "week" ? addDays(selectedDate, -3) : key(new Date(Date.UTC(year, month - (view === "six-months" ? 6 : 1), 1)));
  const end = view === "week" ? addDays(selectedDate, 3) : key(new Date(Date.UTC(year, month, 0)));
  return yearDays.filter((day) => day.date >= start && day.date <= end);
}

export function monthCompletion(activeDays: number, year: number, month: number, today: string) {
  const currentMonth = monthKey(year, month);
  const elapsed = today.startsWith(currentMonth) ? Number(today.slice(8)) : today > `${currentMonth}-31` ? daysInMonth(year, month) : 0;
  return { daysElapsedInMonth: elapsed, monthCompletionRate: elapsed ? Math.round((activeDays / elapsed) * 100) : 0 };
}

export function makeBadges(totalEntries: number, longestStreak: number, activeDays: number, monthEntries: number): CalendarBadge[] {
  return [
    { emoji: "🌱", title: "Khởi đầu an lành", description: "Hoàn thành 7 ngày ghi nhật ký đầu tiên liên tục.", status: activeDays >= 7 ? "✓ Đã đạt" : `${activeDays}/7 ngày`, progress: Math.min(activeDays / 7, 1), unlockedAt: activeDays >= 7 ? "Đã mở khóa" : null },
    { emoji: "🔥", title: "Chiếc mầm kiên trì", description: "Duy trì liên tục 21 ngày hình thành nếp sống chánh niệm.", status: longestStreak >= 21 ? "✓ Đã đạt" : `${longestStreak}/21 ngày`, progress: Math.min(longestStreak / 21, 1), unlockedAt: longestStreak >= 21 ? "Đã mở khóa" : null },
    { emoji: "☀️", title: "Ánh dương ban mai", description: "Gieo 10 khoảnh khắc trong tháng.", status: monthEntries >= 10 ? "✓ Đã đạt" : `${monthEntries}/10`, progress: Math.min(monthEntries / 10, 1), unlockedAt: monthEntries >= 10 ? "Đã mở khóa" : null },
    { emoji: "💚", title: "Trái tim rộng mở", description: "Tạo 50 khoảnh khắc biết ơn.", status: totalEntries >= 50 ? "✓ Đã đạt" : `${totalEntries}/50`, progress: Math.min(totalEntries / 50, 1), unlockedAt: totalEntries >= 50 ? "Đã mở khóa" : null },
  ];
}
