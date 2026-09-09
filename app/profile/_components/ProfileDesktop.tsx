import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileEditModalButton } from "./ProfileModalsClient";
import {
  Avatar,
  MilestoneCard,
  Pill,
} from "./ProfileDesktopCards";
import { ProfileDesktopTabs } from "./ProfileDesktopTabsClient";
import type { ProfileView } from "./profile-view";

export function DesktopProfile({
  initialTab,
  view,
}: Readonly<{ initialTab: "all" | "public" | "moments"; view: ProfileView }>) {
  return (
    <div className="hidden min-h-svh flex-col bg-[#f4fbf8] md:flex">
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
    <section className="relative overflow-hidden rounded-xl bg-white p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#d1e9e0]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#99f3b6]/30 blur-2xl" />
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#006d43] to-[#99f3b6] p-1 shadow-md">
              <Avatar className="h-full w-full" src={view.avatarDesktop} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex rounded-full bg-[#006d43] p-1 text-white shadow-sm">
              <MaterialSymbol className="text-sm" fill name="eco" />
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold leading-8 text-[#161d1b]">
                {view.displayName}
              </h1>
              <span className="rounded-full bg-[#99f3b6] px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-[#0b7141]">
                Tâm Hồn An Yên
              </span>
            </div>
            <p className="max-w-md text-base leading-6 text-[#3d4a41]">{view.bio}</p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Pill icon="spa" text={`${view.entryCount} điều biết ơn đã ghi`} />
              <Pill icon="local_fire_department" text={`${view.streak} ngày liên tiếp`} tone="fire" />
              <Pill icon="nest_eco_leaf" text="Đồng hành cùng Bé Mầm 14 ngày" />
            </div>
          </div>
        </div>
        <div className="self-end md:self-center">
          <ProfileEditModalButton view={view} />
        </div>
      </div>
    </section>
  );
}

function RhythmCard() {
  return (
    <section className="flex items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5f2] text-[#006d43]">
          <MaterialSymbol fill name="calendar_month" />
        </span>
        <div>
          <h3 className="text-xl font-semibold leading-7 text-[#161d1b]">Nhịp điệu biết ơn</h3>
          <p className="text-xs font-medium leading-4 text-[#3d4a41]">
            Bạn đã hoàn thành 85% mục tiêu tháng 10
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] ${index < 3 ? "bg-[#006d43] font-bold text-white" : "bg-[#e3eae7] text-[#3d4a41]"}`}
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
    <footer className="mt-auto w-full bg-[#eef5f2] py-8 shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <MaterialSymbol className="text-xl text-[#006d43]" name="eco" />
          <span className="text-xl font-semibold leading-7 text-[#006d43]">Grateful Forum</span>
          <span className="ml-2 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            Nuôi dưỡng tâm hồn an yên
          </span>
        </div>
        <div className="text-xs font-medium leading-4 text-[#3d4a41]">
          © 2026 Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.
        </div>
      </div>
    </footer>
  );
}
