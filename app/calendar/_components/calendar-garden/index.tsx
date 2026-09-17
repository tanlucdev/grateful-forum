import type { CalendarOverview, CalendarYearDay } from "@/lib/calendar/dto";

export function GardenDesktop({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <section className="rounded-xl bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/60 text-2xl">🌸</span>
          <div>
            <h2 className="text-2xl font-semibold leading-8 text-foreground">{overview.period.gardenTitle} <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{overview.period.year}</span></h2>
            <p className="text-sm text-muted-foreground">Mỗi ngày một điều biết ơn là một mầm hoa được tưới tắm an lành cùng Bé Mầm 🌱🌸</p>
          </div>
        </div>
          <span className="flex items-center gap-3 rounded-xl border border-input bg-muted px-4 py-2 text-xs text-muted-foreground">
          <span className="text-2xl">🌱</span>
          <span>Hành trình nở rộ<br /><strong className="text-primary">Đã tưới mát {overview.garden.totalFlowers} đóa hoa tâm hồn ✨</strong></span>
        </span>
      </div>
      <div className="mb-6 flex items-center justify-between rounded-xl bg-accent/35 px-4 py-3 text-sm text-muted-foreground">
        <span><strong className="text-primary">Hôm nay:</strong> {overview.garden.todayCount} đóa hoa đang bung nở • Chuỗi {overview.stats.currentStreak} ngày gieo mầm liên tục</span>
        <span>Rê chuột ngắm hoa từng ngày</span>
      </div>
      <div className="rounded-xl border border-input bg-background p-5">
        <div className="mb-2 ml-8 grid grid-cols-12 text-center text-xs font-semibold text-muted-foreground">
          {Array.from({ length: 12 }, (_, index) => <span className={index === 9 ? "text-primary" : ""} key={index}>Th {index + 1}</span>)}
        </div>
        <div className="space-y-1.5">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, row) => (
            <div className="flex items-center gap-2" key={day}>
              <span className={`w-6 shrink-0 text-right text-[10px] font-bold ${day === "T5" ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
              <div className="grid flex-1 grid-cols-[repeat(53,minmax(0,1fr))] items-center gap-1">
                {overview.garden.visibleDays.filter((day) => weekdayRow(day.date) === row).map((day) => <HeatDot day={day} key={day.date} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <GardenLegend desktop />
    </section>
  );
}

export function GardenMobile({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🌸</span>
          <div>
            <h2 className="text-sm font-bold text-foreground">{overview.period.gardenTitle}</h2>
            <p className="text-[11px] font-medium text-primary">Đã tưới mát {overview.garden.totalFlowers} đóa hoa tâm hồn ✨</p>
          </div>
        </div>
        <span className="rounded-md border border-accent bg-accent/50 px-2 py-0.5 text-[11px] font-bold text-[var(--leaf-deep)]">{overview.period.year}</span>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {["Mùa Xuân", "Mùa Hạ", "Mùa Thu (Hiện tại)", "Mùa Đông"].map((season, index) => (
          <button className={`whitespace-nowrap rounded-lg px-2.5 py-1 ${index === 2 ? "bg-[var(--leaf-deep)] text-primary-foreground" : "bg-muted text-muted-foreground"}`} key={season}>{season}</button>
        ))}
      </div>
      <div className="mt-3.5 rounded-2xl border border-accent/60 bg-accent/25 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-muted-foreground">
          <span>{overview.period.gardenRangeLabel}</span><span>{overview.garden.visibleDays.length} ngày</span><span className="text-primary">Hôm nay</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 justify-between gap-1.5 py-1">
          {overview.garden.visibleDays.slice(0, 84).map((day) => <MiniHeatDot active={day.isToday} future={day.date > overview.period.todayDate} key={day.date} level={Math.min(day.count, 3)} />)}
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-accent/50 pt-2 text-[11px] text-foreground">
          <span>🌱 Hôm nay: <strong>{overview.garden.todayCount} hạt giống đã gieo</strong></span>
          <span className="font-bold text-primary">#{overview.stats.currentStreak}</span>
        </div>
      </div>
      <GardenLegend />
    </section>
  );
}

function weekdayRow(date: string) {
  return (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
}

function HeatDot({ day }: Readonly<{ day: CalendarYearDay }>) {
  const kind = day.count > 2 ? "bloom" : day.count === 2 ? "sprout" : day.count === 1 ? "seed" : "empty";
  const classes = {
    bloom: "bg-primary text-primary-foreground",
    empty: "bg-secondary/70",
    seed: "bg-accent",
    sprout: "bg-accent",
  }[kind];
  const mark = kind === "bloom" ? "🌸" : kind === "seed" ? "🌱" : kind === "sprout" ? "🌿" : "";
  return <span title={`${day.date}: ${day.count}`} className={`flex h-3.5 items-center justify-center rounded-full text-[8px] transition-transform hover:scale-125 ${classes} ${day.isToday ? "animate-pulse ring-2 ring-[var(--fire)] ring-offset-1" : ""}`}>{mark}</span>;
}

function MiniHeatDot({ level, active, future }: Readonly<{ level: number; active?: boolean; future?: boolean }>) {
  const bg = future ? "bg-muted" : ["bg-accent", "bg-primary/60", "bg-primary", "bg-[var(--leaf-deep)]"][level];
  return <span className={`h-3 w-3 rounded-sm ${bg} ${active ? "ring-2 ring-amber-400 ring-offset-1" : ""}`} />;
}

function GardenLegend({ desktop = false }: Readonly<{ desktop?: boolean }>) {
  return (
    <div className={`${desktop ? "mt-6 border-t border-border pt-3" : "mt-3 pt-1"} flex items-center justify-between gap-2 text-[10px] text-muted-foreground`}>
      <span>{desktop ? "Cùng Bé Mầm kiên trì gieo mầm mỗi ngày để cả khu vườn luôn ngát hương an lành." : "Gieo ít"}</span>
      <div className="flex items-center gap-1.5">
        {["bg-muted", "bg-accent", "bg-primary/60", "bg-[var(--leaf-deep)]"].map((color) => <span className={`h-2.5 w-2.5 rounded-sm ${color}`} key={color} />)}
      </div>
      <span>{desktop ? "Nở rực rỡ (&gt;2)" : "Nở rộ nhiều"}</span>
    </div>
  );
}
