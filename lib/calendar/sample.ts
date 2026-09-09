import type { CalendarOverview } from "./dto";
import { makeBadges, makeMonthDays, makeYearDays, visibleYearDays } from "./stats";
import { calendarHref } from "./validation";

const year = 2024;
const month = 10;
const selectedDate = "2024-10-24";
const buckets = new Map<string, number>();
for (let day = 1; day <= 24; day += 1) buckets.set(`2024-10-${String(day).padStart(2, "0")}`, day === 24 ? 2 : 1);
const yearDays = makeYearDays(year, buckets, selectedDate);
const badges = makeBadges(128, 28, 24, 26);

export const sampleCalendarOverview: CalendarOverview = {
  timezone: "Asia/Ho_Chi_Minh",
  view: "year",
  period: {
    year,
    month,
    selectedDate,
    todayDate: selectedDate,
    monthLabel: "Tháng 10, 2024",
    selectedDateLabel: "Thứ Năm, 24 tháng 10, 2024",
    gardenTitle: "Vườn hoa 2024 ngày gieo mầm",
    gardenRangeLabel: "2024 • 214 đóa hoa",
  },
  filters: [["year", "Năm 2024"], ["six-months", "6 tháng qua"], ["month", "Tháng này"], ["week", "Tuần này"]].map(([key, label]) => ({ key: key as CalendarOverview["view"], label, active: key === "year", href: calendarHref(year, month, selectedDate, key as CalendarOverview["view"]) })),
  stats: {
    currentStreak: 14,
    longestStreak: 28,
    totalEntries: 128,
    monthEntries: 26,
    activeDaysThisMonth: 24,
    daysElapsedInMonth: 26,
    monthCompletionRate: 92,
    entriesDeltaFromPreviousMonth: 18,
  },
  garden: { yearDays, visibleDays: visibleYearDays(yearDays, "year", year, month, selectedDate), totalFlowers: 214, todayCount: 2, todayStreakLabel: "14 ngày liên tiếp" },
  monthDays: makeMonthDays(year, month, buckets, selectedDate, (date) => calendarHref(year, month, date, "year")),
  selectedEntries: [
    { id: "sample-1", content: "Biết ơn ly cà phê sáng mẹ pha thơm lừng.", createdAt: "2024-10-24T08:30:00+07:00", visibility: "private", metadata: { gratitudes: [], reflection: "Một buổi sáng thật dịu dàng.", mood: "Bình an", washi: null, space: null, quote: "Biết ơn những điều giản dị.", sticker: "#giadinh", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=160&q=80" } },
    { id: "sample-2", content: "Hoàn thành buổi chạy bộ 5km quanh công viên.", createdAt: "2024-10-24T21:15:00+07:00", visibility: "private", metadata: { gratitudes: [], reflection: "Cơ thể khỏe mạnh là món quà.", mood: "Phấn chấn", washi: null, space: null, quote: null, sticker: "#suckhoe", imageUrl: null } },
  ],
  badges,
  mascot: { level: 3, maxLevel: 5, label: "Mầm Căng Tràn", progress: 0.65, daysToNextLevel: 8, whisper: "Hôm nay bạn đã hoàn thành xuất sắc mục tiêu nuôi dưỡng tâm hồn! Hãy ôm lấy giấc ngủ thật sâu và giữ nhịp điệu tươi vui này vào ngày mai nhé." },
};
