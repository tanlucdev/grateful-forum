import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileEditModalButton } from "../profile-modals-client";
import { ProfileJournalBook } from "../profile-journal-book";
import type { ProfileView } from "../profile-view";

export function MobileProfile({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="min-h-svh md:hidden">
      <main className="relative w-full overflow-hidden px-5 pb-8 pt-6">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
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
    <section className="relative z-10 flex flex-col gap-3 rounded-xl bg-card/85 p-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-full bg-accent p-1 shadow-sm">
            <span className="block h-full w-full overflow-hidden rounded-full bg-card bg-cover bg-center" style={{ backgroundImage: `url(${view.avatarMobile})` }} />
          </div>
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground shadow-sm">
            <MaterialSymbol className="text-xs" fill name="spa" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-semibold leading-7 text-foreground">{view.displayName}</h1>
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <MaterialSymbol className="text-xs" fill name="eco" />
              Tâm Hồn An Yên
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted-foreground">{view.bio || "Tìm niềm vui trong những điều nhỏ bé mỗi ngày 🌿"}</p>
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
  const color = tone === "primary" ? "text-primary" : tone === "secondary" ? "text-[var(--leaf-deep)]" : "text-[var(--fire)]";

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-muted/70 px-2 py-1.5 text-center">
      <div className={`flex items-center gap-0.5 text-lg font-bold leading-6 ${color}`}>
        <span>{value}</span>
        {suffix ? <span className="text-[13px] leading-none">{suffix}</span> : null}
      </div>
      <span className="truncate text-[10px] leading-[14px] text-muted-foreground">{label}</span>
    </div>
  );
}

function WeeklyRhythm({ view }: Readonly<{ view: ProfileView }>) {
  const activeCount = view.weeklyRhythm.filter((day) => day.active).length;

  return (
    <section className="relative z-10 mt-3 flex flex-col gap-2 rounded-xl bg-card p-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MaterialSymbol className="text-lg text-primary" fill name="potted_plant" />
          <span className="text-xs font-semibold text-foreground">Nhịp điệu tuần này</span>
        </div>
        <span className="text-[10px] font-medium text-primary">{activeCount}/7 chồi xanh thắp sáng</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {view.weeklyRhythm.map((day) => (
          <div className={`${day.active ? "bg-accent/30" : "bg-muted opacity-60"} flex flex-col items-center gap-1 rounded-lg py-1.5`} key={day.date}>
            <span className={`text-[10px] ${day.isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day.label}</span>
            <span aria-label={`${day.label} ${day.count} nhật ký`} className={`${day.active ? "bg-primary text-primary-foreground" : day.isToday ? "bg-card text-primary ring-1 ring-primary/35" : "bg-input text-muted-foreground"} flex h-6 w-6 items-center justify-center rounded-full text-[12px]`} title={`${day.date}: ${day.count} nhật ký`}>
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
      <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm" type="button">
        Tất cả ({view.entryCount})
      </button>
      <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-[var(--leaf-deep)] px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm" type="button">
        <MaterialSymbol className="text-base" name="auto_stories" />
        Cuốn sổ ký ức
      </button>
      <button className="inline-flex shrink-0 rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm" type="button">
        Công khai ({view.publicCount})
      </button>
      <button className="inline-flex shrink-0 rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm" type="button">
        Khoảnh khắc ({4})
      </button>
    </div>
  );
}

function MobileControls() {
  return (
    <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
      <div className="flex items-center rounded-xl bg-muted p-1 shadow-sm">
        <button aria-label="Dạng lưới" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground" title="Dạng lưới" type="button">
          <MaterialSymbol className="text-lg" name="grid_view" />
        </button>
        <button aria-label="Dạng danh sách" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground" title="Dạng danh sách" type="button">
          <MaterialSymbol className="text-lg" name="stream" />
        </button>
        <button aria-label="Cuốn sổ tay" className="flex h-7 w-7 items-center justify-center rounded-lg bg-card text-primary shadow-sm" title="Cuốn sổ tay" type="button">
          <MaterialSymbol className="text-lg" name="auto_stories" />
        </button>
      </div>
      <div className="flex min-w-0 gap-1.5 overflow-x-auto">
        {["Tất cả", "#giadinh", "#congviec", "#thiennhien"].map((tag, index) => (
          <span className={`${index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"} shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium shadow-sm`} key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobilePageControls({ total }: Readonly<{ total: number }>) {
  return (
    <div className="relative z-10 mt-4 flex flex-col gap-2.5 rounded-xl bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <button className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground" type="button">
          <MaterialSymbol className="text-sm" name="arrow_back" />
          Trang trước
        </button>
        <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground" type="button">
          Trang kế
          <MaterialSymbol className="text-sm" name="arrow_forward" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-bold text-foreground">Trang 24 / {Math.max(total, 1)} trang</span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Tháng 9</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-input">
            <div className="h-full w-[65%] bg-primary" />
          </div>
          <span className="font-bold text-primary">Tháng 10</span>
        </div>
      </div>
    </div>
  );
}
