import Image from "next/image";
import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CalendarBadge, CalendarEntry, CalendarOverview } from "@/lib/calendar/dto";
import { getStickerLabel } from "@/lib/entries/stickers";
import { coffee } from "../calendar-assets";

export function MonthCalendar({ desktop = false, overview }: Readonly<{ desktop?: boolean; overview: CalendarOverview }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-6" : "rounded-3xl p-4"} border border-border bg-card shadow-sm`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>📅</span>
          <h2 className={`${desktop ? "text-2xl" : "text-base"} font-bold text-foreground`}>{overview.period.monthLabel}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Link className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" href={`/calendar?year=${overview.period.month === 1 ? overview.period.year - 1 : overview.period.year}&month=${overview.period.month === 1 ? 12 : overview.period.month - 1}&view=${overview.view}`}>‹</Link>
          <Link className="rounded-full bg-accent/50 px-3 py-1 text-xs font-bold text-[var(--leaf-deep)]" href={`/calendar?date=${overview.period.todayDate}&view=${overview.view}`}>Hôm nay</Link>
          <Link className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" href={`/calendar?year=${overview.period.month === 12 ? overview.period.year + 1 : overview.period.year}&month=${overview.period.month === 12 ? 1 : overview.period.month + 1}&view=${overview.view}`}>›</Link>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-bold text-muted-foreground">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span className={day === "CN" ? "text-rose-400" : ""} key={day}>{day}</span>)}
      </div>
      <div className={`grid grid-cols-7 ${desktop ? "gap-2" : "gap-1"} text-xs`}>
        {overview.monthDays.map((day) => <MonthCell day={day} desktop={desktop} key={day.date} />)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Ghi chép cá nhân</span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">🔥 Chuỗi {overview.stats.currentStreak} ngày đang kích hoạt</span>
      </div>
    </section>
  );
}

export function TodayMoments({ desktop = false, overview }: Readonly<{ desktop?: boolean; overview: CalendarOverview }>) {
  const displayEntries = overview.selectedEntries.length
    ? overview.selectedEntries.map(entryToMoment)
    : [];

  return (
    <section className={`${desktop ? "rounded-xl p-6" : "rounded-3xl p-4"} space-y-3 border border-border bg-card shadow-sm`}>
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <div>
          <span className="text-[11px] font-medium text-muted-foreground">{overview.period.selectedDateLabel}</span>
          <h3 className={`${desktop ? "text-xl" : "text-base"} font-bold text-foreground`}>Khoảnh khắc hôm nay</h3>
        </div>
        <span className="rounded-full border border-accent bg-accent/70 px-2.5 py-1 text-xs font-bold text-[var(--leaf-deep)]">{overview.selectedEntries.length} điều đã gieo</span>
      </div>
      {displayEntries.map((entry) => <Moment image={typeof entry.image === "string" ? entry.image : entry.image ? desktop : undefined} key={`${entry.time}-${entry.tag}-${entry.text}`} night={entry.night} tag={entry.tag} text={entry.text} time={entry.time} />)}
      <Link className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-accent bg-muted px-3 py-2.5 text-xs font-semibold text-primary" href="/write">⊕ Ghi thêm điều biết ơn cho hôm nay</Link>
    </section>
  );
}

export function MascotWhisper({ desktop = false, mascot }: Readonly<{ desktop?: boolean; mascot: CalendarOverview["mascot"] }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-5" : "rounded-3xl p-4"} flex items-start gap-3 border border-accent bg-gradient-to-r from-accent/35 via-muted to-accent/60 shadow-sm`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-accent bg-card text-2xl shadow-sm">🌱</div>
      <div className="space-y-1">
        <h4 className={`${desktop ? "text-xl" : "text-xs"} font-bold text-foreground`}>Lời thì thầm của Bé Mầm <span className="text-[10px]">🍃</span></h4>
        <p className={`${desktop ? "text-base" : "text-xs"} leading-relaxed text-foreground/90 italic`}>“{mascot.whisper}”</p>
      </div>
    </section>
  );
}

export function Badges({ desktop = false, badges }: Readonly<{ desktop?: boolean; badges: CalendarBadge[] }>) {
  return (
    <section className={`${desktop ? "space-y-4 pb-8" : "space-y-2.5 pt-1"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`${desktop ? "text-2xl" : "text-sm"} font-bold text-foreground`}>Cột mốc & Huy hiệu đồng hành</h3>
          <p className={`${desktop ? "text-base" : "text-[11px]"} text-muted-foreground`}>Phần thưởng cho sự kiên trì gieo mầm hạnh phúc tự thân.</p>
        </div>
        <span className="shrink-0 text-xs font-bold text-primary">Tất cả {desktop ? `${badges.length} huy hiệu` : `(${badges.length})`} →</span>
      </div>
      <div className={`${desktop ? "grid grid-cols-4 gap-4" : "no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1"}`}>
        {badges.map((badge) => (
          <article className={`${desktop ? "" : "w-44 shrink-0"} flex flex-col justify-between rounded-2xl border border-border bg-card p-3.5 shadow-sm`} key={badge.title}>
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent bg-accent/50 text-lg">{badge.emoji}</div>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-[var(--leaf-deep)]">{badge.status}</span>
            </div>
            <div className="mt-3">
              <h5 className="text-xs font-bold text-foreground">{badge.title}</h5>
              <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{badge.description}</p>
            </div>
            {badge.unlockedAt ? <span className="mt-2.5 block text-[9px] font-semibold text-emerald-600">{badge.unlockedAt}</span> : <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-rose-100"><div className="h-full rounded-full bg-rose-500" style={{ width: `${badge.progress * 100}%` }} /></div>}
          </article>
        ))}
      </div>
    </section>
  );
}

function MonthCell({ day, desktop }: Readonly<{ day: CalendarOverview["monthDays"][number]; desktop?: boolean }>) {
  const streak = day.count > 0 && day.inMonth;
  const faded = !day.inMonth;
  return (
    <Link className={`${desktop ? "h-14 items-start p-1.5" : "h-10 items-center justify-center"} flex flex-col rounded-xl ${day.isToday ? "bg-[var(--leaf-deep)] text-primary-foreground shadow-md ring-2 ring-accent ring-offset-1" : streak ? "border border-accent bg-accent/50 text-[var(--leaf-deep)]" : faded ? "bg-muted/60 text-muted-foreground/70" : "bg-muted/60 text-muted-foreground"} ${desktop ? "justify-between" : ""}`} href={day.href}>
      <span className={`${streak || day.isToday ? "font-bold" : ""} ${desktop ? "text-xs" : "text-[11px]"}`}>{day.day}</span>
      {streak ? <span className={`${desktop ? "text-[11px]" : "text-[9px]"} font-bold ${day.isToday ? "text-amber-300" : "text-amber-600"}`}>🌱{day.count}{day.isToday ? " Nay" : ""}</span> : null}
      {!streak && day.count > 0 ? <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" /> : null}
    </Link>
  );
}

function entryToMoment(entry: CalendarEntry, index: number) {
  return {
    time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date(entry.createdAt)),
    tag: getStickerLabel(entry.metadata.sticker, "vi") ?? (entry.visibility === "private" ? "Riêng tư" : "Chia sẻ"),
    text: entry.metadata.quote ?? entry.metadata.reflection ?? entry.content,
    night: index % 2 === 1,
    image: entry.metadata.imageUrl ?? undefined,
  };
}

function Moment({ time, tag, text, night, image }: Readonly<{ time: string; tag: string; text: string; night?: boolean; image?: boolean | string }>) {
  return (
    <article className={`space-y-2 rounded-2xl border p-3.5 ${night ? "border-teal-100/70 bg-teal-50/30" : "border-accent/70 bg-accent/50/40"}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">{night ? "🌙" : "☀️"} {time}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${night ? "bg-teal-100 text-teal-800" : "bg-accent text-primary"}`}>{tag}</span>
      </div>
      <p className="text-xs leading-relaxed text-foreground">{text}</p>
      <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-muted-foreground">
        {typeof image === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-12 w-12 rounded-lg object-cover shadow-sm" src={image} />
        ) : image ? <Image alt="Cà phê buổi sáng" className="h-12 w-12 rounded-lg object-cover shadow-sm" height={48} unoptimized width={48} src={coffee} /> : <MaterialSymbol className="text-xs" name="lock" />}
        <span>{image ? "Ảnh lưu khoảnh khắc bình yên" : "Riêng tư • Tâm trạng: Bình an, phấn chấn"}</span>
      </div>
    </article>
  );
}
