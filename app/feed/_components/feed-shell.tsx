import Image from "next/image";
import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function MobileReflectionBanner() {
  return (
    <section className="overflow-hidden rounded-xl bg-[#eef5f2] p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#d1e9e0]/40">
          <Image
            alt="Bé Mầm"
            className="h-full w-full object-cover"
            height={56}
            src="/stitch/landing/mascot.png"
            width={56}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <MaterialSymbol className="text-base text-[#006d43]" fill name="psychiatry" />
            <p className="text-xs font-semibold leading-4 text-[#006d43]">
              Lời nhắn từ Bé Mầm
            </p>
          </div>
          <p className="mt-0.5 line-clamp-2 text-base italic leading-6 text-[#3d4a41]">
            “Mỗi lời biết ơn được gieo xuống là một mầm xanh hy vọng được nảy mầm.”
          </p>
        </div>
      </div>
    </section>
  );
}

export function MobileWritePrompt() {
  return (
    <section className="flex items-center justify-between gap-3 rounded-xl bg-[#d1e9e0]/30 p-3.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006d43] text-white">
          <MaterialSymbol className="text-[18px]" fill name="edit_note" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold leading-5 text-[#161d1b]">
            Bạn đang biết ơn điều gì?
          </h2>
          <p className="truncate text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            Gieo một điều lành cho ngày hôm nay
          </p>
        </div>
      </div>
      <Link
        className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-white/60 px-2.5 text-xs font-semibold leading-4 text-[#006d43]"
        href="/write"
      >
        Viết
        <MaterialSymbol className="text-base" name="arrow_forward" />
      </Link>
    </section>
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

export function MobileFeedEnd({ status }: Readonly<{ status: string }>) {
  return (
    <section className="flex flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d1e9e0]/30">
        <Image
          alt="Bé Mầm nghỉ ngơi"
          className="h-10 w-10 object-contain"
          height={40}
          src="/stitch/feed/mascot-rest.jpg"
          width={40}
        />
      </div>
      <p className="text-sm font-semibold leading-5 text-[#161d1b]">
        {status || "Bạn đã đọc hết các chia sẻ mới"}
      </p>
      <p className="max-w-60 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
        Hãy hít thở một hơi thật sâu và mang theo sự an yên này vào ngày của bạn nhé.
      </p>
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
            src="/stitch/landing/mascot.png"
            width={112}
          />
          <div className="relative mb-4 w-full rounded-2xl bg-[#eef5f2] px-4 py-3">
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[#eef5f2]" />
            <p className="relative z-10 text-base leading-snug text-[#3d4a41]">
              “Một điều biết ơn ngắn cũng đủ làm ngày hôm nay dịu lại.”
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8efec] px-3 py-1 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006d43]" />
            Bạn đồng hành Mầm
          </span>
        </div>
      </section>
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
          <span>Grateful Forum Radio</span>
          <span className="inline-flex items-center gap-1 text-[#006d43]">
            <MaterialSymbol className="text-sm" name="wb_sunny" />
            Mỗi sớm mai
          </span>
        </div>
      </section>
    </aside>
  );
}

export function DesktopFooter() {
  return (
    <footer className="mt-auto hidden w-full bg-[#eef5f2] py-8 shadow-[0_-1px_6px_rgba(0,0,0,0.02)] md:block">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <MaterialSymbol className="text-xl text-[#006d43]" name="eco" />
          <span className="text-xl font-semibold leading-7 text-[#006d43]">Grateful Forum</span>
          <span className="ml-2 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            Nuôi dưỡng tâm hồn an yên
          </span>
        </div>
        <p className="text-xs font-medium leading-4 text-[#3d4a41]">
          © 2026 Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.
        </p>
      </div>
    </footer>
  );
}
