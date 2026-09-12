import Image from "next/image";
import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function MobileReflectionBanner() {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e5eee9] bg-white p-4 shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06)]">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-emerald-100 bg-[#eef7f3]">
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
            <span className="h-2 w-2 rounded-full bg-[#00a86b]" />
            <p className="text-xs font-bold uppercase leading-4 tracking-wider text-[#00a86b]">Bé Mầm Đồng Hành</p>
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
    <section className="relative flex items-center justify-between gap-3 overflow-hidden rounded-3xl border border-[#e5eee9] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(28,59,44,0.05)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200" />
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#eef7f3] text-[#00a86b]">
          <MaterialSymbol className="text-[18px]" fill name="edit_note" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold leading-5 text-[#1c3b2c]">
            Bạn đang biết ơn điều gì?
          </h2>
          <p className="truncate text-[11px] font-medium leading-[14px] text-[#6b7a74]">
            Gieo một điều lành cho ngày hôm nay
          </p>
        </div>
      </div>
      <Link
        className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#00a86b] px-3 text-xs font-bold leading-4 text-white"
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
    <section className="group relative overflow-hidden rounded-3xl border border-[#e5eee9] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(28,59,44,0.05)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200" />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-[#eef7f3] text-[#00a86b]">
          <MaterialSymbol className="text-[22px]" fill name="psychiatry" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            className="block rounded-2xl border border-[#e2ece6] bg-[#f8faf8] px-4 py-3 text-sm text-[#6b7a74] hover:border-emerald-300 hover:bg-[#f0fdf4]"
            href="/write"
          >
            Hôm nay điều giản dị gì đã sưởi ấm trái tim bạn? Nhấn để ghi lại...
          </Link>
          <div className="mt-3 flex flex-col items-start justify-between gap-3 border-t border-[#f0f4f2] pt-3 text-xs xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
                <span>✨</span>
                72 Sticker Bé Mầm
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
                <span>📷</span>
                Đính kèm ảnh kỷ niệm
              </span>
              <span className="hidden items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 font-medium text-teal-800 lg:inline-flex">
                <span>🍵</span>
                Viết tự do hoặc theo 3 điều
              </span>
            </div>
            <Link
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-[#00a86b] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0e5f3c]"
              href="/write"
            >
              <span>Viết ngay</span>
              <MaterialSymbol className="text-sm" name="arrow_forward" />
            </Link>
          </div>
        </div>
      </div>
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
      <p className="text-sm font-bold leading-5 text-[#1c3b2c]">
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
    <aside className="flex flex-col gap-6 md:col-span-5 lg:col-span-4">
      <section className="relative overflow-hidden rounded-3xl border border-[#e5eee9] bg-white p-6 shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06)]">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="relative flex items-center justify-between border-b border-[#f0f4f2] pb-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c3b2c]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Bé Mầm Đồng Hành
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            Buổi sáng lành
          </span>
        </div>
        <div className="relative z-10 mt-5 flex flex-col items-center text-center">
          <Image
            alt="Mascot Mầm"
            className="my-1 h-28 w-28 rounded-full object-cover drop-shadow-sm"
            height={112}
            src="/stitch/landing/mascot.png"
            width={112}
          />
          <div className="relative mt-3 w-full rounded-2xl border border-emerald-100 bg-[#f4fbf8] px-4 py-3">
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-emerald-100 bg-[#f4fbf8]" />
            <p className="relative z-10 text-base leading-snug text-[#3d4a41]">
              “Mỗi ngày dừng lại 3 phút ghi chép điều nhỏ bé sẽ giúp tâm trí bạn được tưới mát.”
            </p>
          </div>
          <Link className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00a86b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0e5f3c]" href="/write">
            <MaterialSymbol className="text-base" name="edit_note" />
            Viết trang nhật ký hôm nay
          </Link>
        </div>
      </section>
      <section className="rounded-3xl border border-[#e5eee9] bg-white p-6 shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06)]">
        <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#1c3b2c]">
            <span>🌱</span>
            Nhịp điệu tuần này
          </h3>
          <Link className="text-xs font-bold text-[#00a86b] hover:underline" href="/calendar">
            Vườn hoa 365
          </Link>
        </div>
        <p className="mt-3 text-xs text-[#6b7a74]">Duy trì thói quen viết để tâm trí thêm vững vàng:</p>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
            <div className="flex flex-col items-center gap-1.5" key={day}>
              <span className={`text-[10px] font-semibold ${index === 3 ? "text-emerald-800" : "text-[#85978f]"}`}>
                {day}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                  index < 3
                    ? "bg-emerald-500 text-white shadow-[0_1px_2px_rgba(26,47,43,0.04)]"
                    : index === 3
                      ? "bg-emerald-100 text-emerald-800 ring-2 ring-[#00a86b] ring-offset-2"
                      : "bg-[#f4f8f6] text-[#b0c0b8]"
                }`}
              >
                {index < 2 ? "🌸" : index === 2 ? "🌷" : index === 3 ? "✎" : "·"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f2] pt-3 text-xs text-[#6b7a74]">
          <span>
            Đã tưới mát: <strong className="text-emerald-800">18 ngày</strong>
          </span>
          <span className="font-semibold text-emerald-700">Tỷ lệ: 82%</span>
        </div>
      </section>
      <section className="relative rounded-3xl border border-[#eedfc9]/70 bg-[#fbfaf5] p-6 shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06)]">
        <span className="absolute -top-2.5 right-6 flex h-5 w-20 items-center justify-center bg-[rgba(184,225,205,0.78)] text-[9px] font-bold text-emerald-900 [clip-path:polygon(3%_0%,97%_0%,100%_50%,97%_100%,3%_100%,0%_50%)]">
          Trích dẫn
        </span>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
          <span>🌿</span>
          Gieo Vào Tâm Thức
        </p>
        <blockquote className="mt-3 font-serif text-[15px] italic leading-relaxed text-[#3a4740]">
          “Hạnh phúc không phải là có tất cả những gì bạn muốn, mà là trân trọng tất cả những gì bạn đang có.”
        </blockquote>
        <div className="mt-4 flex items-center justify-between border-t border-[#eedfc9]/50 pt-2 text-xs text-[#7a8880]">
          <span className="font-medium">BeGrateful Radio</span>
          <span className="rounded-full border border-[#eedfc9]/80 bg-white px-2 py-0.5 text-[11px] text-amber-900">
            Mỗi sớm mai
          </span>
        </div>
      </section>
      <section className="space-y-2 rounded-2xl border border-[#e5eee9] bg-white/80 p-4 text-xs text-[#6b7a74]">
        <p className="flex items-center gap-1.5 font-bold text-[#1c3b2c]">
          <MaterialSymbol className="text-sm text-emerald-600" name="verified_user" />
          Cam kết mạng xã hội an lành
        </p>
        <p className="leading-relaxed">
          Không thuật toán câu tương tác. Không hiển thị người theo dõi. Không gian riêng tư được bảo vệ.
        </p>
      </section>
    </aside>
  );
}

export function DesktopFooter() {
  return (
    <footer className="mt-auto hidden w-full border-t border-[#e5eee9] bg-white/70 py-6 backdrop-blur-sm md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 text-xs text-[#6b7a74]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-700">BeGrateful</span>
          <span>•</span>
          <span>Nuôi dưỡng tâm hồn an yên mỗi ngày</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className="hover:text-[#00a86b]" href="/calendar">Vườn hoa 365</Link>
          <Link className="hover:text-[#00a86b]" href="/profile?tab=moments">Huy hiệu</Link>
          <Link className="hover:text-[#00a86b]" href="/feed">Cộng đồng</Link>
        </div>
        <p className="text-[#85978f]">
          © 2026 Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.
        </p>
      </div>
    </footer>
  );
}
