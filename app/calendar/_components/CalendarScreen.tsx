import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { DesktopFooter, FilterPills, HeroActions } from "./calendar-shell";
import { GardenDesktop, GardenMobile } from "./calendar-garden";
import { Badges, MascotWhisper, MonthCalendar, TodayMoments } from "./calendar-time";
import { MascotLevel, Metric } from "./calendar-stat";
import type { CalendarOverview } from "@/lib/calendar/dto";

export function CalendarScreen({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <div className="min-h-dvh bg-[#f5faf7] font-[family-name:var(--font-quicksand)] text-[#1C3127]">
      <DesktopCalendar overview={overview} />
      <MobileCalendar overview={overview} />
    </div>
  );
}

function DesktopCalendar({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <div className="hidden min-h-dvh bg-[#f4fbf8] md:block">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-10 pt-24 lg:px-16">
        <HeroActions overview={overview} />
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Chuỗi hiện tại" icon="local_fire_department" value={String(overview.stats.currentStreak)} unit="ngày liên tiếp" hint={`Kỷ lục dài nhất: ${overview.stats.longestStreak} ngày`} tone="rose" progress={Math.min(overview.stats.currentStreak * 4, 100)} />
          <Metric label="Tổng khoảnh khắc" icon="eco" value={String(overview.stats.totalEntries)} unit="hạt giống" hint={`${overview.stats.entriesDeltaFromPreviousMonth >= 0 ? "+" : ""}${overview.stats.entriesDeltaFromPreviousMonth} hạt so với tháng trước`} tone="green" progress={Math.min(overview.stats.totalEntries, 100)} />
          <Metric label="Tỷ lệ duy trì" icon="check_circle" value={String(overview.stats.monthCompletionRate)} unit="%" hint={`${overview.stats.activeDaysThisMonth}/${overview.stats.daysElapsedInMonth} ngày trong tháng`} tone="teal" ring={`${overview.stats.activeDaysThisMonth}/${overview.stats.daysElapsedInMonth}`} />
          <MascotLevel mascot={overview.mascot} />
        </section>
        <GardenDesktop overview={overview} />
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MonthCalendar desktop overview={overview} />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <TodayMoments desktop overview={overview} />
            <MascotWhisper desktop mascot={overview.mascot} />
          </div>
        </section>
        <Badges desktop badges={overview.badges} />
      </main>
      <DesktopFooter />
    </div>
  );
}

function MobileCalendar({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <div className="mx-0 flex min-h-dvh w-[100dvw] max-w-[420px] flex-col overflow-hidden bg-[#f5faf7] shadow-2xl md:hidden">
      <div className="flex items-center justify-between px-6 pb-1 pt-2 text-xs font-semibold text-[#6C8377]">
        <span>9:41</span>
        <span>● ◒ ▱</span>
      </div>
      <header className="px-5 pb-3 pt-3">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[#0f7652]">
          <span className="text-sm">📅</span>
          <span>Theo dõi chánh niệm • <strong>Nhật ký nhịp điệu</strong></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#bbf7d1] bg-[#dcfce8] text-xl shadow-sm">🌱</div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-[#1C3127]">Lịch biết ơn</h1>
              <p className="text-xs text-[#6C8377]">Vườn hoa 365 ngày chánh niệm</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 shadow-sm">🔥 {overview.stats.currentStreak} ngày</span>
        </div>
        <FilterPills compact filters={overview.filters} />
        <Link className="mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#145C34] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,168,107,0.28)]" href="/write">
          <MaterialSymbol className="text-lg" name="edit_note" />
          Viết nhật ký hôm nay
        </Link>
      </header>
      <main className="mt-1 flex-1 space-y-5 px-4">
        <section className="grid grid-cols-2 gap-3">
          <Metric label="Chuỗi hiện tại" emoji="🔥" value={String(overview.stats.currentStreak)} unit="ngày liên tiếp" hint={`🏆 Kỷ lục: ${overview.stats.longestStreak} ngày`} tone="rose" progress={Math.min(overview.stats.currentStreak * 4, 100)} mobile />
          <Metric label="Khoảnh khắc" emoji="🌱" value={String(overview.stats.totalEntries)} unit="hạt giống" hint={`↗ ${overview.stats.entriesDeltaFromPreviousMonth >= 0 ? "+" : ""}${overview.stats.entriesDeltaFromPreviousMonth} hạt so với tháng trước`} tone="green" progress={Math.min(overview.stats.totalEntries, 100)} mobile />
          <Metric label="Tỷ lệ duy trì" emoji="✓" value={String(overview.stats.monthCompletionRate)} unit="%" hint={`${overview.stats.activeDaysThisMonth}/${overview.stats.daysElapsedInMonth} ngày`} tone="teal" ring={`${overview.stats.activeDaysThisMonth}/${overview.stats.daysElapsedInMonth}`} mobile />
          <MascotLevel mascot={overview.mascot} mobile />
        </section>
        <GardenMobile overview={overview} />
        <MonthCalendar overview={overview} />
        <TodayMoments overview={overview} />
        <MascotWhisper mascot={overview.mascot} />
        <Badges badges={overview.badges} />
        <footer className="space-y-1 pb-6 pt-4 text-center text-[#6C8377]">
          <p className="text-xs font-semibold text-[#145C34]">Grateful Forum</p>
          <p className="text-[11px] italic">“Nuôi dưỡng tâm hồn an yên qua từng điều giản dị mỗi ngày.”</p>
          <p className="pt-2 text-[10px] text-gray-400">© 2025 Grateful Forum. Cùng Bé Mầm gieo mầm hạnh phúc.</p>
        </footer>
      </main>
    </div>
  );
}
