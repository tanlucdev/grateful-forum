import Image from "next/image";
import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-[#eefcf9]/80 pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.02)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-6">
        <h1 className="text-[22px] font-semibold leading-7 text-[#111e1c]">Feed</h1>
        <Link
          aria-label="Cá nhân"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#456461] text-white"
          href="/profile"
        >
          <MaterialSymbol className="text-[18px]" name="person" />
        </Link>
      </div>
    </header>
  );
}

export function WritePrompt() {
  return (
    <section className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-[#eef5f2] p-6 shadow-sm sm:flex-row sm:items-center">
      <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-[#d1e9e0]/30 blur-2xl" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#006d43] shadow-sm">
          <MaterialSymbol className="text-2xl" fill name="edit_note" />
        </div>
        <div>
          <h2 className="text-xl font-semibold leading-7 text-[#161d1b]">
            Hôm nay điều gì khiến bạn mỉm cười?
          </h2>
          <p className="mt-0.5 text-xs font-medium leading-4 text-[#3d4a41]">
            Dành 1 phút ghi dấu lại niềm vui giản dị
          </p>
        </div>
      </div>
      <Link
        className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#006d43] px-5 py-2.5 text-sm font-semibold leading-5 text-white shadow-md shadow-[#006d43]/20"
        href="/write"
      >
        Viết ngay
        <MaterialSymbol className="text-lg" name="arrow_forward" />
      </Link>
    </section>
  );
}

export function DesktopAside() {
  return (
    <aside className="flex flex-col gap-6 lg:col-span-4">
      <section className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(26,47,43,0.04)]">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#d1e9e0]/40 blur-2xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            alt="Mascot Mầm"
            className="mb-3 h-28 w-28 object-contain drop-shadow-sm"
            height={112}
            src="/stitch/feed/mascot.jpg"
            width={112}
          />
          <div className="relative mb-4 w-full rounded-2xl bg-[#eef5f2] px-4 py-3">
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[#eef5f2]" />
            <p className="relative z-10 text-base leading-snug text-[#3d4a41]">
              “Chào Minh! Mỗi ngày ghi lại 3 điều biết ơn giúp tâm trí bạn nhẹ nhàng và thư thái hơn đấy.”
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8efec] px-3 py-1 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006d43]" />
            Bạn đồng hành Mầm
          </span>
        </div>
      </section>
      <HabitCard />
      <section className="relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-[#eef5f2] p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#006d43]">
          <MaterialSymbol className="text-xl" fill name="format_quote" />
          <span className="text-[11px] font-bold uppercase leading-[14px] tracking-wider">
            Cảm hứng hôm nay
          </span>
        </div>
        <blockquote className="text-base italic leading-6 text-[#161d1b]">
          “Hạnh phúc không phải là có tất cả những gì bạn muốn, mà là trân trọng tất cả những gì bạn đang có.”
        </blockquote>
        <div className="flex items-center justify-between pt-2 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
          <span>BeGrateful Radio</span>
          <span className="inline-flex items-center gap-1 text-[#006d43]">
            <MaterialSymbol className="text-sm" name="wb_sunny" />
            Mỗi sớm mai
          </span>
        </div>
      </section>
    </aside>
  );
}

export function HabitCard() {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(26,47,43,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffdad8]/60 text-[#a5393e]">
            <MaterialSymbol className="text-lg" fill name="local_fire_department" />
          </span>
          <h2 className="text-xl font-semibold leading-7 text-[#161d1b]">Chuỗi thói quen</h2>
        </div>
        <span className="rounded-full bg-[#ffdad8]/50 px-2.5 py-1 text-xs font-medium leading-4 text-[#852229]">
          3 ngày liên tiếp
        </span>
      </div>
      <p className="text-xs font-medium leading-4 text-[#3d4a41]">
        Duy trì thói quen viết để tâm trí thêm vững vàng.
      </p>
      <div className="grid grid-cols-7 gap-2 pt-2">
        {days.map((day, index) => {
          const doneDay = index >= 2 && index <= 4;
          const icon = doneDay ? "check" : index === 5 ? "edit" : index === 6 ? "lock" : "remove";

          return (
            <div className="flex flex-col items-center gap-1.5" key={day}>
              <span className={`text-[11px] font-medium leading-[14px] ${doneDay ? "font-bold text-[#006d43]" : "text-[#6d7a70]"}`}>
                {day}
              </span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${doneDay ? "bg-[#006d43] text-white shadow-sm" : "bg-[#e8efec] text-[#6d7a70]"}`}>
                <MaterialSymbol className="text-sm" fill={doneDay} name={icon} />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DesktopFooter() {
  return (
    <footer className="mt-auto hidden w-full bg-[#eef5f2] py-8 shadow-[0_-1px_6px_rgba(0,0,0,0.02)] md:block">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <MaterialSymbol className="text-xl text-[#006d43]" name="eco" />
          <span className="text-xl font-semibold leading-7 text-[#006d43]">BeGrateful</span>
          <span className="ml-2 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            Nuôi dưỡng tâm hồn an yên
          </span>
        </div>
        <p className="text-xs font-medium leading-4 text-[#3d4a41]">
          © 2026 BeGrateful. Lan tỏa lòng biết ơn mỗi ngày.
        </p>
      </div>
    </footer>
  );
}
