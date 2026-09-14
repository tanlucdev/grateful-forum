import Image from "next/image";
import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CalendarBadge, CalendarEntry, CalendarOverview } from "@/lib/calendar/dto";
import { coffee } from "../calendar-assets";

export function MonthCalendar({ desktop = false, overview }: Readonly<{ desktop?: boolean; overview: CalendarOverview }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-6" : "rounded-3xl p-4"} border border-[#E3EFE9] bg-white shadow-[0_4px_16px_rgba(22,60,42,0.05)]`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>📅</span>
          <h2 className={`${desktop ? "text-2xl" : "text-base"} font-bold text-[#1C3127]`}>{overview.period.monthLabel}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Link className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600" href={`/calendar?year=${overview.period.month === 1 ? overview.period.year - 1 : overview.period.year}&month=${overview.period.month === 1 ? 12 : overview.period.month - 1}&view=${overview.view}`}>‹</Link>
          <Link className="rounded-full bg-[#f0fdf6] px-3 py-1 text-xs font-bold text-[#145C34]" href={`/calendar?date=${overview.period.todayDate}&view=${overview.view}`}>Hôm nay</Link>
          <Link className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600" href={`/calendar?year=${overview.period.month === 12 ? overview.period.year + 1 : overview.period.year}&month=${overview.period.month === 12 ? 1 : overview.period.month + 1}&view=${overview.view}`}>›</Link>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-bold text-[#6C8377]">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span className={day === "CN" ? "text-rose-400" : ""} key={day}>{day}</span>)}
      </div>
      <div className={`grid grid-cols-7 ${desktop ? "gap-2" : "gap-1"} text-xs`}>
        {overview.monthDays.map((day) => <MonthCell day={day} desktop={desktop} key={day.date} />)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[#E3EFE9] pt-2.5 text-[11px] text-[#6C8377]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00a86b]" />Ghi chép cá nhân</span>
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
    <section className={`${desktop ? "rounded-xl p-6" : "rounded-3xl p-4"} space-y-3 border border-[#E3EFE9] bg-white shadow-[0_4px_16px_rgba(22,60,42,0.05)]`}>
      <div className="flex items-center justify-between border-b border-[#E3EFE9]/70 pb-2">
        <div>
          <span className="text-[11px] font-medium text-[#6C8377]">{overview.period.selectedDateLabel}</span>
          <h3 className={`${desktop ? "text-xl" : "text-base"} font-bold text-[#1C3127]`}>Khoảnh khắc hôm nay</h3>
        </div>
        <span className="rounded-full border border-[#bbf7d1] bg-[#dcfce8]/70 px-2.5 py-1 text-xs font-bold text-[#145C34]">{overview.selectedEntries.length} điều đã gieo</span>
      </div>
      {displayEntries.map((entry) => <Moment image={typeof entry.image === "string" ? entry.image : entry.image ? desktop : undefined} key={`${entry.time}-${entry.tag}-${entry.text}`} night={entry.night} tag={entry.tag} text={entry.text} time={entry.time} />)}
      <Link className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#86efac] bg-[#f5faf7] px-3 py-2.5 text-xs font-semibold text-[#0f7652]" href="/write">⊕ Ghi thêm điều biết ơn cho hôm nay</Link>
    </section>
  );
}

export function MascotWhisper({ desktop = false, mascot }: Readonly<{ desktop?: boolean; mascot: CalendarOverview["mascot"] }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-5" : "rounded-3xl p-4"} flex items-start gap-3 border border-[#bbf7d1] bg-gradient-to-r from-[#f0fdf6] via-[#ecfdf5] to-[#ccfbf1] shadow-[0_8px_24px_-4px_rgba(0,168,107,0.08)]`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#86efac] bg-white text-2xl shadow-sm">🌱</div>
      <div className="space-y-1">
        <h4 className={`${desktop ? "text-xl" : "text-xs"} font-bold text-[#0b381f]`}>Lời thì thầm của Bé Mầm <span className="text-[10px]">🍃</span></h4>
        <p className={`${desktop ? "text-base" : "text-xs"} leading-relaxed text-[#0b381f]/90 italic`}>“{mascot.whisper}”</p>
      </div>
    </section>
  );
}

export function Badges({ desktop = false, badges }: Readonly<{ desktop?: boolean; badges: CalendarBadge[] }>) {
  return (
    <section className={`${desktop ? "space-y-4 pb-8" : "space-y-2.5 pt-1"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`${desktop ? "text-2xl" : "text-sm"} font-bold text-[#1C3127]`}>Cột mốc & Huy hiệu đồng hành</h3>
          <p className={`${desktop ? "text-base" : "text-[11px]"} text-[#6C8377]`}>Phần thưởng cho sự kiên trì gieo mầm hạnh phúc tự thân.</p>
        </div>
        <span className="shrink-0 text-xs font-bold text-[#0f7652]">Tất cả {desktop ? `${badges.length} huy hiệu` : `(${badges.length})`} →</span>
      </div>
      <div className={`${desktop ? "grid grid-cols-4 gap-4" : "no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1"}`}>
        {badges.map((badge) => (
          <article className={`${desktop ? "" : "w-44 shrink-0"} flex flex-col justify-between rounded-2xl border border-[#E3EFE9] bg-white p-3.5 shadow-[0_4px_16px_rgba(22,60,42,0.05)]`} key={badge.title}>
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dcfce8] bg-[#f0fdf6] text-lg">{badge.emoji}</div>
              <span className="rounded-full bg-[#dcfce8] px-2 py-0.5 text-[10px] font-bold text-[#145C34]">{badge.status}</span>
            </div>
            <div className="mt-3">
              <h5 className="text-xs font-bold text-[#1C3127]">{badge.title}</h5>
              <p className="mt-1 text-[10px] leading-tight text-[#6C8377]">{badge.description}</p>
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
    <Link className={`${desktop ? "h-14 items-start p-1.5" : "h-10 items-center justify-center"} flex flex-col rounded-xl ${day.isToday ? "bg-[#145C34] text-white shadow-md ring-2 ring-[#bbf7d1] ring-offset-1" : streak ? "border border-[#bbf7d1] bg-[#f0fdf6] text-[#145C34]" : faded ? "bg-gray-50/60 text-gray-400" : "bg-gray-50/60 text-gray-600"} ${desktop ? "justify-between" : ""}`} href={day.href}>
      <span className={`${streak || day.isToday ? "font-bold" : ""} ${desktop ? "text-xs" : "text-[11px]"}`}>{day.day}</span>
      {streak ? <span className={`${desktop ? "text-[11px]" : "text-[9px]"} font-bold ${day.isToday ? "text-amber-300" : "text-amber-600"}`}>🌱{day.count}{day.isToday ? " Nay" : ""}</span> : null}
      {!streak && day.count > 0 ? <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#00a86b]" /> : null}
    </Link>
  );
}

function entryToMoment(entry: CalendarEntry, index: number) {
  return {
    time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date(entry.createdAt)),
    tag: entry.metadata.sticker ?? (entry.visibility === "private" ? "Riêng tư" : "Chia sẻ"),
    text: entry.metadata.quote ?? entry.metadata.reflection ?? entry.content,
    night: index % 2 === 1,
    image: entry.metadata.imageUrl ?? undefined,
  };
}

function Moment({ time, tag, text, night, image }: Readonly<{ time: string; tag: string; text: string; night?: boolean; image?: boolean | string }>) {
  return (
    <article className={`space-y-2 rounded-2xl border p-3.5 ${night ? "border-teal-100/70 bg-teal-50/30" : "border-[#dcfce8]/70 bg-[#f0fdf6]/40"}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-[#1C3127]">{night ? "🌙" : "☀️"} {time}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${night ? "bg-teal-100 text-teal-800" : "bg-[#dcfce8] text-[#0f7652]"}`}>{tag}</span>
      </div>
      <p className="text-xs leading-relaxed text-[#1C3127]">{text}</p>
      <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-[#6C8377]">
        {typeof image === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-12 w-12 rounded-lg object-cover shadow-sm" src={image} />
        ) : image ? <Image alt="Cà phê buổi sáng" className="h-12 w-12 rounded-lg object-cover shadow-sm" height={48} unoptimized width={48} src={coffee} /> : <MaterialSymbol className="text-xs" name="lock" />}
        <span>{image ? "Ảnh lưu khoảnh khắc bình yên" : "Riêng tư • Tâm trạng: Bình an, phấn chấn"}</span>
      </div>
    </article>
  );
}
