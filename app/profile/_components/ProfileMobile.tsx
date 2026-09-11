import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileEditModalButton } from "./ProfileModalsClient";
import { ProfileJournalBook } from "./ProfileJournalBook";
import type { ProfileView } from "./profile-view";

export function MobileProfile({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="min-h-svh bg-[#f4fbf8] md:hidden">
      <main className="relative w-full overflow-hidden bg-[#f4fbf8] px-5 pb-8 pt-6">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#d1e9e0]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 top-10 h-48 w-48 rounded-full bg-[#9cf5c0]/30 blur-3xl" />
        <ProfileBrief view={view} />
        <WeeklyRhythm view={view} />
        <MobileTabs view={view} />
        <MobileControls />
        <ProfileJournalBook mobile view={view} />
        <MobilePageControls total={view.entryCount} />
      </main>
    </div>
  );
}

function ProfileBrief({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <section className="relative z-10 flex flex-col gap-3 rounded-xl bg-white/85 p-4 shadow-[0_4px_20px_rgba(26,47,43,0.04)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-full bg-[#d1e9e0] p-1 shadow-[0_2px_10px_rgba(0,109,67,0.15)]">
            <span className="block h-full w-full overflow-hidden rounded-full bg-white bg-cover bg-center" style={{ backgroundImage: `url(${view.avatarMobile})` }} />
          </div>
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#006d43] text-[11px] text-white shadow-sm">
            <MaterialSymbol className="text-xs" fill name="spa" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-semibold leading-7 text-[#161d1b]">{view.displayName}</h1>
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#d1e9e0]/60 px-2 py-0.5 text-[10px] font-semibold text-[#006d43]">
              <MaterialSymbol className="text-xs" fill name="eco" />
              Tâm Hồn An Yên
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-[#3d4a41]">{view.bio || "Tìm niềm vui trong những điều nhỏ bé mỗi ngày 🌿"}</p>
        </div>
        <ProfileEditModalButton variant="icon" view={view} />
      </div>
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <MobileStat value={view.entryCount} label="Điều biết ơn" tone="primary" />
        <MobileStat value={view.streak} label="Ngày liên tiếp" suffix="🔥" tone="tertiary" />
        <MobileStat value={14} label="Với Bé Mầm" suffix="🌱" tone="secondary" />
      </div>
    </section>
  );
}

function MobileStat({
  label,
  suffix,
  tone,
  value,
}: Readonly<{ label: string; suffix?: string; tone: "primary" | "secondary" | "tertiary"; value: number }>) {
  const color = tone === "primary" ? "text-[#006d43]" : tone === "secondary" ? "text-[#006d3d]" : "text-[#a5393e]";

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-[#eef5f2]/70 px-2 py-1.5 text-center">
      <div className={`flex items-center gap-0.5 text-lg font-bold leading-6 ${color}`}>
        <span>{value}</span>
        {suffix ? <span className="text-[13px] leading-none">{suffix}</span> : null}
      </div>
      <span className="truncate text-[10px] leading-[14px] text-[#6d7a70]">{label}</span>
    </div>
  );
}

function WeeklyRhythm({ view }: Readonly<{ view: ProfileView }>) {
  const activeCount = view.weeklyRhythm.filter((day) => day.active).length;

  return (
    <section className="relative z-10 mt-3 flex flex-col gap-2 rounded-xl bg-white p-3.5 shadow-[0_2px_12px_rgba(26,47,43,0.03)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MaterialSymbol className="text-lg text-[#006d43]" fill name="potted_plant" />
          <span className="text-xs font-semibold text-[#161d1b]">Nhịp điệu tuần này</span>
        </div>
        <span className="text-[10px] font-medium text-[#006d43]">{activeCount}/7 chồi xanh thắp sáng</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {view.weeklyRhythm.map((day) => (
          <div className={`${day.active ? "bg-[#d1e9e0]/30" : "bg-[#eef5f2] opacity-60"} flex flex-col items-center gap-1 rounded-lg py-1.5`} key={day.date}>
            <span className={`text-[10px] ${day.isToday ? "font-bold text-[#006d43]" : "text-[#6d7a70]"}`}>{day.label}</span>
            <span aria-label={`${day.label} ${day.count} nhật ký`} className={`${day.active ? "bg-[#006d43] text-white" : day.isToday ? "bg-white text-[#006d43] ring-1 ring-[#006d43]/35" : "bg-[#dde4e1] text-[#6d7a70]"} flex h-6 w-6 items-center justify-center rounded-full text-[12px]`} title={`${day.date}: ${day.count} nhật ký`}>
              {day.active ? <MaterialSymbol className="text-base" fill name={day.isToday ? "local_florist" : "psychiatry_alt"} /> : "·"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileTabs({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="relative z-10 -mx-1 mt-4 flex gap-2 overflow-x-auto py-1">
      <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eef5f2] px-3.5 py-1.5 text-xs font-medium text-[#3d4a41] shadow-sm" type="button">
        Tất cả ({view.entryCount})
      </button>
      <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#006d43] to-[#006d3d] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_10px_rgba(0,109,67,0.2)]" type="button">
        <MaterialSymbol className="text-base" name="auto_stories" />
        Cuốn sổ ký ức
      </button>
      <button className="inline-flex shrink-0 rounded-full bg-[#eef5f2] px-3.5 py-1.5 text-xs font-medium text-[#3d4a41] shadow-sm" type="button">
        Công khai ({view.publicCount})
      </button>
      <button className="inline-flex shrink-0 rounded-full bg-[#eef5f2] px-3.5 py-1.5 text-xs font-medium text-[#3d4a41] shadow-sm" type="button">
        Khoảnh khắc ({4})
      </button>
    </div>
  );
}

function MobileControls() {
  return (
    <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
      <div className="flex items-center rounded-xl bg-[#eef5f2] p-1 shadow-sm">
        <button aria-label="Dạng lưới" className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6d7a70]" title="Dạng lưới" type="button">
          <MaterialSymbol className="text-lg" name="grid_view" />
        </button>
        <button aria-label="Dạng danh sách" className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6d7a70]" title="Dạng danh sách" type="button">
          <MaterialSymbol className="text-lg" name="stream" />
        </button>
        <button aria-label="Cuốn sổ tay" className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#006d43] shadow-sm" title="Cuốn sổ tay" type="button">
          <MaterialSymbol className="text-lg" name="auto_stories" />
        </button>
      </div>
      <div className="flex min-w-0 gap-1.5 overflow-x-auto">
        {["Tất cả", "#giadinh", "#congviec", "#thiennhien"].map((tag, index) => (
          <span className={`${index === 0 ? "bg-[#006d43] text-white" : "bg-white text-[#3d4a41]"} shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium shadow-sm`} key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobilePageControls({ total }: Readonly<{ total: number }>) {
  return (
    <div className="relative z-10 mt-4 flex flex-col gap-2.5 rounded-xl bg-white p-3 shadow-[0_2px_10px_rgba(26,47,43,0.03)]">
      <div className="flex items-center justify-between">
        <button className="inline-flex items-center gap-1 rounded-lg bg-[#eef5f2] px-3 py-1.5 text-xs font-medium text-[#3d4a41]" type="button">
          <MaterialSymbol className="text-sm" name="arrow_back" />
          Trang trước
        </button>
        <button className="inline-flex items-center gap-1 rounded-lg bg-[#006d43] px-3 py-1.5 text-xs font-bold text-white" type="button">
          Trang kế
          <MaterialSymbol className="text-sm" name="arrow_forward" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-bold text-[#1a2f2b]">Trang 24 / {Math.max(total, 1)} trang</span>
        <div className="flex items-center gap-2 text-[10px] text-[#6d7a70]">
          <span>Tháng 9</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e3eae7]">
            <div className="h-full w-[65%] bg-[#006d43]" />
          </div>
          <span className="font-bold text-[#006d43]">Tháng 10</span>
        </div>
      </div>
    </div>
  );
}
