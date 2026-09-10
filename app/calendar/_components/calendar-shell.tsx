import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CalendarOverview } from "@/lib/calendar/dto";

export function HeroActions({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <section className="grid gap-5 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-end">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#3d4a41]">
          <MaterialSymbol className="text-base text-[#006d43]" name="calendar_today" />
          <span>Theo dõi chánh niệm & thói quen</span>
          <span>•</span>
          <span className="font-semibold text-[#006d43]">Nhật ký nhịp điệu</span>
        </div>
        <h1 className="mt-1.5 text-[32px] font-bold leading-10 text-[#1A2F2B]">Nhịp điệu biết ơn</h1>
        <p className="mt-1 max-w-2xl text-base leading-6 text-[#3d4a41]">Mỗi ngày ghi lại một điều nhỏ bé để nuôi dưỡng tâm hồn bình an. Dõi theo hành trình gieo hạt cùng Bé Mầm.</p>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-[#e8efec]/75 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_rgba(26,47,43,0.04)]">
        <FilterPills filters={overview.filters} />
        <Link className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#006d43] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,109,67,0.18)] hover:bg-[#145C34]" href="/write">
          <MaterialSymbol className="text-lg" name="edit_note" />
          Viết nhật ký hôm nay
        </Link>
      </div>
    </section>
  );
}

export function FilterPills({ compact = false, filters }: Readonly<{ compact?: boolean; filters: CalendarOverview["filters"] }>) {
  return (
    <nav
      aria-label="Bộ lọc lịch biết ơn"
      className={`${compact ? "mt-4 text-[11px]" : "text-sm"} flex min-h-12 items-center gap-1 rounded-[14px] bg-[#dfe8e4] p-1 font-semibold text-[#3d4a41]`}
    >
      {filters.map((item) => (
        <Link
          aria-current={item.active ? "page" : undefined}
          className={`${compact ? "flex-1 px-1.5 py-2" : "flex-1 px-3 py-2.5"} rounded-[10px] text-center leading-5 outline-offset-2 ${
            item.active ? "bg-white text-[#006d43] shadow-[0_2px_10px_rgba(26,47,43,0.08)]" : "hover:bg-white/55 hover:text-[#1A2F2B]"
          }`}
          href={item.href}
          key={item.key}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function DesktopFooter() {
  return (
    <footer className="w-full bg-[#eef5f2]/60 py-8 shadow-[0_-1px_8px_rgba(26,47,43,0.02)]">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-6 text-center text-[#3d4a41] sm:flex-row sm:text-left lg:px-16">
        <div><p className="text-xl font-semibold text-[#006d43]">Grateful Forum</p><p>Nuôi dưỡng tâm hồn an yên qua từng điều giản dị mỗi ngày.</p></div>
        <div className="text-xs">© 2025 Grateful Forum. Cùng Bé Mầm gieo mầm hạnh phúc.</div>
      </div>
    </footer>
  );
}
