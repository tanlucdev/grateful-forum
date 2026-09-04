import Image from "next/image";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { badges, coffee, monthDays } from "./calendar-data";

export function MonthCalendar({ desktop = false }: Readonly<{ desktop?: boolean }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-6" : "rounded-3xl p-4"} border border-[#E3EFE9] bg-white shadow-[0_4px_16px_rgba(22,60,42,0.05)]`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>📅</span>
          <h2 className={`${desktop ? "text-2xl" : "text-base"} font-bold text-[#1C3127]`}>Tháng 10, 2024</h2>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">‹</button>
          <span className="rounded-full bg-[#f0fdf6] px-3 py-1 text-xs font-bold text-[#145C34]">Hôm nay</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">›</button>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-bold text-[#6C8377]">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span className={day === "CN" ? "text-rose-400" : ""} key={day}>{day}</span>)}
      </div>
      <div className={`grid grid-cols-7 ${desktop ? "gap-2" : "gap-1"} text-xs`}>
        {monthDays.map((day, index) => <MonthCell day={day} desktop={desktop} index={index} key={`${day}-${index}`} />)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[#E3EFE9] pt-2.5 text-[11px] text-[#6C8377]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00a86b]" />Ghi chép cá nhân</span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">🔥 Chuỗi 14 ngày đang kích hoạt</span>
      </div>
    </section>
  );
}

export function TodayMoments({ desktop = false }: Readonly<{ desktop?: boolean }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-6" : "rounded-3xl p-4"} space-y-3 border border-[#E3EFE9] bg-white shadow-[0_4px_16px_rgba(22,60,42,0.05)]`}>
      <div className="flex items-center justify-between border-b border-[#E3EFE9]/70 pb-2">
        <div>
          <span className="text-[11px] font-medium text-[#6C8377]">Thứ Năm, 24 Tháng 10, 2024</span>
          <h3 className={`${desktop ? "text-xl" : "text-base"} font-bold text-[#1C3127]`}>Khoảnh khắc hôm nay</h3>
        </div>
        <span className="rounded-full border border-[#bbf7d1] bg-[#dcfce8]/70 px-2.5 py-1 text-xs font-bold text-[#145C34]">2 điều đã gieo</span>
      </div>
      <Moment time="08:30 • Buổi sáng" tag="#giadinh" text="“Biết ơn ly cà phê sáng mẹ pha thơm lừng và luồng ánh nắng ấm áp chiếu qua bậu cửa sổ phòng làm việc...”" image={desktop} />
      <Moment time="21:15 • Buổi tối" tag="#suckhoe" text="“Hoàn thành buổi chạy bộ 5km nhẹ nhàng quanh công viên và hít thở bầu không khí mùa thu se se lạnh đầy tươi mới.”" night />
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#86efac] bg-[#f5faf7] px-3 py-2.5 text-xs font-semibold text-[#0f7652]">⊕ Ghi thêm điều biết ơn cho hôm nay</button>
    </section>
  );
}

export function MascotWhisper({ desktop = false }: Readonly<{ desktop?: boolean }>) {
  return (
    <section className={`${desktop ? "rounded-xl p-5" : "rounded-3xl p-4"} flex items-start gap-3 border border-[#bbf7d1] bg-gradient-to-r from-[#f0fdf6] via-[#ecfdf5] to-[#ccfbf1] shadow-[0_8px_24px_-4px_rgba(0,168,107,0.08)]`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#86efac] bg-white text-2xl shadow-sm">🌱</div>
      <div className="space-y-1">
        <h4 className={`${desktop ? "text-xl" : "text-xs"} font-bold text-[#0b381f]`}>Lời thì thầm của Bé Mầm <span className="text-[10px]">🍃</span></h4>
        <p className={`${desktop ? "text-base" : "text-xs"} leading-relaxed text-[#0b381f]/90 italic`}>“Hôm nay bạn đã hoàn thành xuất sắc mục tiêu nuôi dưỡng tâm hồn! Hãy ôm lấy giấc ngủ thật sâu và giữ nhịp điệu tươi vui này vào ngày mai nhé.”</p>
      </div>
    </section>
  );
}

export function Badges({ desktop = false }: Readonly<{ desktop?: boolean }>) {
  return (
    <section className={`${desktop ? "space-y-4 pb-8" : "space-y-2.5 pt-1"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`${desktop ? "text-2xl" : "text-sm"} font-bold text-[#1C3127]`}>Cột mốc & Huy hiệu đồng hành</h3>
          <p className={`${desktop ? "text-base" : "text-[11px]"} text-[#6C8377]`}>Phần thưởng cho sự kiên trì gieo mầm hạnh phúc tự thân.</p>
        </div>
        <a className="shrink-0 text-xs font-bold text-[#0f7652]" href="#">Xem tất cả {desktop ? "12 huy hiệu" : "(12)"} →</a>
      </div>
      <div className={`${desktop ? "grid grid-cols-4 gap-4" : "no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1"}`}>
        {badges.map(([emoji, title, body, status]) => (
          <article className={`${desktop ? "" : "w-44 shrink-0"} flex flex-col justify-between rounded-2xl border border-[#E3EFE9] bg-white p-3.5 shadow-[0_4px_16px_rgba(22,60,42,0.05)]`} key={title}>
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dcfce8] bg-[#f0fdf6] text-lg">{emoji}</div>
              <span className="rounded-full bg-[#dcfce8] px-2 py-0.5 text-[10px] font-bold text-[#145C34]">{status}</span>
            </div>
            <div className="mt-3">
              <h5 className="text-xs font-bold text-[#1C3127]">{title}</h5>
              <p className="mt-1 text-[10px] leading-tight text-[#6C8377]">{body}</p>
            </div>
            {status.includes("/") ? <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-rose-100"><div className="h-full w-[66%] rounded-full bg-rose-500" /></div> : <span className="mt-2.5 block text-[9px] font-semibold text-emerald-600">Mở khóa: 17/10/2024</span>}
          </article>
        ))}
      </div>
    </section>
  );
}

function MonthCell({ day, index, desktop }: Readonly<{ day: number; index: number; desktop?: boolean }>) {
  const inMonth = index > 0 && index < 32;
  const streak = day >= 11 && day <= 24 && inMonth;
  const today = day === 24 && inMonth;
  const faded = !inMonth || (day > 24 && inMonth);
  return (
    <div className={`${desktop ? "h-14 items-start p-1.5" : "h-10 items-center justify-center"} flex flex-col rounded-xl ${today ? "bg-[#145C34] text-white shadow-md ring-2 ring-[#bbf7d1] ring-offset-1" : streak ? "border border-[#bbf7d1] bg-[#f0fdf6] text-[#145C34]" : faded ? "bg-gray-50/60 text-gray-400" : "bg-gray-50/60 text-gray-600"} ${desktop ? "justify-between" : ""}`}>
      <span className={`${streak || today ? "font-bold" : ""} ${desktop ? "text-xs" : "text-[11px]"}`}>{day}</span>
      {streak ? <span className={`${desktop ? "text-[11px]" : "text-[9px]"} font-bold ${today ? "text-amber-300" : "text-amber-600"}`}>🔥{day - 10}{today ? " Nay" : ""}</span> : null}
      {!streak && [2, 3, 5].includes(day) ? <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#00a86b]" /> : null}
    </div>
  );
}

function Moment({ time, tag, text, night, image }: Readonly<{ time: string; tag: string; text: string; night?: boolean; image?: boolean }>) {
  return (
    <article className={`space-y-2 rounded-2xl border p-3.5 ${night ? "border-teal-100/70 bg-teal-50/30" : "border-[#dcfce8]/70 bg-[#f0fdf6]/40"}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-[#1C3127]">{night ? "🌙" : "☀️"} {time}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${night ? "bg-teal-100 text-teal-800" : "bg-[#dcfce8] text-[#0f7652]"}`}>{tag}</span>
      </div>
      <p className="text-xs leading-relaxed text-[#1C3127]">{text}</p>
      <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-[#6C8377]">
        {image ? <Image alt="Cà phê buổi sáng" className="h-12 w-12 rounded-lg object-cover shadow-sm" height={48} unoptimized width={48} src={coffee} /> : <MaterialSymbol className="text-xs" name="lock" />}
        <span>{image ? "Ảnh lưu khoảnh khắc bình yên" : "Riêng tư • Tâm trạng: Bình an, phấn chấn"}</span>
      </div>
    </article>
  );
}
