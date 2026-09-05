import { DesktopFooter, FilterPills, HeroActions, MobileBottomNav } from "./calendar-shell";
import { GardenDesktop, GardenMobile } from "./calendar-garden";
import { Badges, MascotWhisper, MonthCalendar, TodayMoments } from "./calendar-time";
import { MascotLevel, Metric } from "./calendar-stat";

export function CalendarScreen() {
  return (
    <div className="min-h-dvh bg-[#f5faf7] font-[family-name:var(--font-quicksand)] text-[#1C3127]">
      <DesktopCalendar />
      <MobileCalendar />
    </div>
  );
}

function DesktopCalendar() {
  return (
    <div className="hidden min-h-dvh bg-[#f4fbf8] md:block">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-10 pt-24 lg:px-16">
        <HeroActions />
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Chuỗi hiện tại" icon="local_fire_department" value="14" unit="ngày liên tiếp" hint="Kỷ lục dài nhất: 28 ngày" tone="rose" progress={50} />
          <Metric label="Tổng khoảnh khắc" icon="eco" value="128" unit="hạt giống" hint="+18 hạt so với tháng trước" tone="green" progress={75} />
          <Metric label="Tỷ lệ duy trì" icon="check_circle" value="92" unit="%" hint="Chỉ bỏ lỡ 2 ngày trong tháng này" tone="teal" ring="24/26" />
          <MascotLevel />
        </section>
        <GardenDesktop />
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MonthCalendar desktop />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <TodayMoments desktop />
            <MascotWhisper desktop />
          </div>
        </section>
        <Badges desktop />
      </main>
      <DesktopFooter />
    </div>
  );
}

function MobileCalendar() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-[#f5faf7] pb-24 shadow-2xl md:hidden">
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
          <span className="flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 shadow-sm">🔥 14 ngày</span>
        </div>
        <FilterPills compact />
        <button className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#145C34] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,168,107,0.28)]">
          <span className="text-lg leading-none">+</span>
          Viết nhật ký hôm nay
        </button>
      </header>
      <main className="mt-1 flex-1 space-y-5 px-4">
        <section className="grid grid-cols-2 gap-3">
          <Metric label="Chuỗi hiện tại" emoji="🔥" value="14" unit="ngày liên tiếp" hint="🏆 Kỷ lục: 28 ngày" tone="rose" progress={50} mobile />
          <Metric label="Khoảnh khắc" emoji="🌱" value="128" unit="hạt giống" hint="↗ +18 hạt so với tháng trước" tone="green" progress={75} mobile />
          <Metric label="Tỷ lệ duy trì" emoji="✓" value="92" unit="%" hint="Chỉ bỏ lỡ 2 ngày" tone="teal" ring="24/26" mobile />
          <MascotLevel mobile />
        </section>
        <GardenMobile />
        <MonthCalendar />
        <TodayMoments />
        <MascotWhisper />
        <Badges />
        <footer className="space-y-1 pb-6 pt-4 text-center text-[#6C8377]">
          <p className="text-xs font-semibold text-[#145C34]">BeGrateful</p>
          <p className="text-[11px] italic">“Nuôi dưỡng tâm hồn an yên qua từng điều giản dị mỗi ngày.”</p>
          <p className="pt-2 text-[10px] text-gray-400">© 2025 BeGrateful. Cùng Bé Mầm gieo mầm hạnh phúc.</p>
        </footer>
      </main>
      <MobileBottomNav />
    </div>
  );
}
