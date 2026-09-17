import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileEditModalButton } from "../profile-modals-client";
import { Avatar, MilestoneCard, Pill } from "../profile-desktop-cards";
import { ProfileDesktopTabs } from "../profile-desktop-tabs-client";
import type { ProfileView } from "../profile-view";

export function DesktopProfile({
  initialTab,
  view,
}: Readonly<{ initialTab: "all" | "public" | "moments"; view: ProfileView }>) {
  return (
    <div className="hidden min-h-svh flex-col md:flex">
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pt-20">
        <div className="flex w-full flex-col space-y-8 py-8">
          <DesktopHero view={view} />
          <ProfileDesktopTabs initialTab={initialTab} view={view} />
          <MilestoneCard view={view} />
          <RhythmCard />
        </div>
      </main>
      <DesktopFooter />
    </div>
  );
}

function DesktopHero({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-card p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/30 blur-2xl" />
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-md">
              <Avatar className="h-full w-full" src={view.avatarDesktop} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
              <MaterialSymbol className="text-sm" fill name="eco" />
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold leading-8 text-foreground">
                {view.displayName}
              </h1>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-primary">
                Tâm Hồn An Yên
              </span>
            </div>
            <p className="max-w-md text-base leading-6 text-muted-foreground">{view.bio}</p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Pill icon="spa" text={`${view.entryCount} điều biết ơn đã ghi`} />
              <Pill icon="local_fire_department" text={`${view.streak} ngày liên tiếp`} tone="fire" />
              <Pill icon="nest_eco_leaf" text="Đồng hành cùng Bé Mầm 14 ngày" />
            </div>
            <WeeklyRhythm compact={false} view={view} />
          </div>
        </div>
        <div className="self-end md:self-center">
          <ProfileEditModalButton view={view} />
        </div>
      </div>
    </section>
  );
}

function WeeklyRhythm({ compact, view }: Readonly<{ compact: boolean; view: ProfileView }>) {
  const activeCount = view.weeklyRhythm.filter((day) => day.active).length;

  return (
    <div className={`${compact ? "rounded-xl bg-card p-3.5 shadow-sm" : "mt-4 rounded-2xl border border-primary/10 bg-muted/70 p-3 sm:px-4"} flex flex-col gap-3`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent/60 text-primary">
            <MaterialSymbol className="text-base" fill name="potted_plant" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground">Nhịp điệu tuần này</span>
              <span className="rounded-full bg-accent/50 px-2 py-0.5 text-[11px] font-bold text-[var(--leaf-deep)]">{activeCount}/7 chồi xanh thắp sáng</span>
            </div>
            {!compact ? <p className="text-[11px] font-medium text-muted-foreground">{activeCount ? `Tuần này bạn đã viết nhật ký ${activeCount} ngày` : "Tuần này chưa có ngày viết nhật ký"}</p> : null}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {view.weeklyRhythm.map((day) => (
          <div className={`${day.active ? "bg-accent/35" : "bg-muted opacity-70"} flex flex-col items-center gap-1 rounded-lg py-1.5`} key={day.date}>
            <span className={`text-[10px] ${day.isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day.label}</span>
            <span aria-label={`${day.label} ${day.count} nhật ký`} className={`${day.active ? "bg-primary text-primary-foreground" : day.isToday ? "bg-card text-primary ring-1 ring-primary/35" : "bg-input text-muted-foreground"} flex h-6 w-6 items-center justify-center rounded-full text-[12px]`} title={`${day.date}: ${day.count} nhật ký`}>
              {day.active ? <MaterialSymbol className="text-base" fill name={day.isToday ? "local_florist" : "psychiatry_alt"} /> : "·"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RhythmCard() {
  return (
    <section className="flex items-center justify-between gap-4 rounded-xl bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
          <MaterialSymbol fill name="calendar_month" />
        </span>
        <div>
          <h3 className="text-xl font-semibold leading-7 text-foreground">Nhịp điệu biết ơn tháng 10</h3>
          <p className="text-xs font-medium leading-4 text-muted-foreground">
            Bạn đã hoàn thành 85% mục tiêu tháng 10
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] ${index < 3 ? "bg-primary font-bold text-primary-foreground" : "bg-input text-muted-foreground"}`}
            key={day}
          >
            {day}
          </span>
        ))}
      </div>
    </section>
  );
}

function DesktopFooter() {
  return (
    <footer className="mt-auto w-full bg-muted py-8 shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <MaterialSymbol className="text-xl text-primary" name="eco" />
          <span className="text-xl font-semibold leading-7 text-primary">Grateful Forum</span>
          <span className="ml-2 text-[11px] font-medium leading-[14px] text-muted-foreground">
            Nuôi dưỡng tâm hồn an yên
          </span>
        </div>
        <div className="text-xs font-medium leading-4 text-muted-foreground">
          © 2026 Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.
        </div>
      </div>
    </footer>
  );
}
