import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CalendarOverview } from "@/lib/calendar/dto";

export function HeroActions({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <section className="grid gap-5 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-end">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <MaterialSymbol className="text-base text-primary" name="calendar_today" />
          <span>Theo dõi chánh niệm & thói quen</span>
          <span>•</span>
          <span className="font-semibold text-primary">Nhật ký nhịp điệu</span>
        </div>
        <h1 className="mt-1.5 text-[32px] font-bold leading-10 text-foreground">Nhịp điệu biết ơn</h1>
        <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">Mỗi ngày ghi lại một điều nhỏ bé để nuôi dưỡng tâm hồn bình an. Dõi theo hành trình gieo hạt cùng Bé Mầm.</p>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-secondary/75 p-1.5 shadow-sm">
        <FilterPills filters={overview.filters} />
        <Link className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--primary-shadow-md)] hover:bg-[var(--primary-hover)]" href="/write">
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
      className={`${compact ? "mt-4 text-[11px]" : "text-sm"} flex min-h-12 items-center gap-1 rounded-[14px] bg-secondary p-1 font-semibold text-muted-foreground`}
    >
      {filters.map((item) => (
        <Link
          aria-current={item.active ? "page" : undefined}
          className={`${compact ? "flex-1 px-1.5 py-2" : "flex-1 px-3 py-2.5"} rounded-[10px] text-center leading-5 outline-offset-2 ${
            item.active ? "bg-card text-primary shadow-sm" : "hover:bg-card/55 hover:text-foreground"
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
    <footer className="w-full bg-muted/60 py-8 shadow-sm">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-6 text-center text-muted-foreground sm:flex-row sm:text-left lg:px-16">
        <div><p className="text-xl font-semibold text-primary">Grateful Forum</p><p>Nuôi dưỡng tâm hồn an yên qua từng điều giản dị mỗi ngày.</p></div>
        <div className="text-xs">© 2025 Grateful Forum. Cùng Bé Mầm gieo mầm hạnh phúc.</div>
      </div>
    </footer>
  );
}
