import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function HeroActions() {
  return (
    <section className="flex flex-col justify-between gap-4 pt-4 lg:flex-row lg:items-end">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.04em] text-[#3d4a41]">
          <MaterialSymbol className="text-base text-[#006d43]" name="calendar_today" />
          <span>Theo dõi chánh niệm & thói quen</span>
          <span>•</span>
          <span className="font-semibold text-[#006d43]">Nhật ký nhịp điệu</span>
        </div>
        <h1 className="mt-1.5 text-[32px] font-bold leading-10 tracking-tight text-[#1A2F2B]">Nhịp điệu biết ơn</h1>
        <p className="mt-1 max-w-2xl text-base leading-6 text-[#3d4a41]">Mỗi ngày ghi lại một điều nhỏ bé để nuôi dưỡng tâm hồn bình an. Dõi theo hành trình gieo hạt cùng Bé Mầm.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <FilterPills />
        <Link className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006d43] to-[#006d3d] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,109,67,0.18)]" href="/write">
          <MaterialSymbol className="text-lg" name="edit_note" />
          Viết nhật ký hôm nay
        </Link>
      </div>
    </section>
  );
}

export function FilterPills({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div className={`${compact ? "mt-4 text-xs" : "text-sm"} flex items-center rounded-full bg-[#e8efec] p-1 font-semibold text-[#3d4a41]`}>
      {["Năm 2024", "6 tháng qua", "Tháng này", "Tuần này"].map((item, index) => (
        <button className={`${compact ? "flex-1 rounded-xl py-1.5" : "rounded-full px-3.5 py-1.5"} ${index === 0 ? "bg-white text-[#006d43] shadow-sm" : ""}`} key={item}>
          {item}
        </button>
      ))}
    </div>
  );
}

export function DesktopFooter() {
  return (
    <footer className="w-full bg-[#eef5f2]/60 py-8 shadow-[0_-1px_8px_rgba(26,47,43,0.02)]">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-6 text-center text-[#3d4a41] sm:flex-row sm:text-left lg:px-16">
        <div><p className="text-xl font-semibold text-[#006d43]">Grateful Forum</p><p>Nuôi dưỡng tâm hồn an yên qua từng điều giản dị mỗi ngày.</p></div>
        <div className="text-xs">© 2025 Grateful Forum. Cùng Bé Mầm gieo mầm hạnh phúc.</div>
      </div>
    </footer>
  );
}

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 z-50 flex w-full max-w-[420px] items-center justify-between border-t border-[#E3EFE9] bg-white/95 px-6 py-2.5 shadow-lg backdrop-blur-md">
      <BottomItem href="/feed" label="Bảng tin" name="article" />
      <Link aria-label="Viết nhật ký ngay" className="-mt-7 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-[#145C34] to-[#00a86b] text-2xl text-white shadow-[0_10px_30px_rgba(0,168,107,0.28)]" href="/write">+</Link>
      <BottomItem active href="/calendar" label="Lịch biết ơn" name="calendar_today" />
      <BottomItem href="/profile" label="Cá nhân" name="person" />
    </nav>
  );
}

function BottomItem({ href, label, name, active }: Readonly<{ href: string; label: string; name: string; active?: boolean }>) {
  return (
    <Link className={`flex w-16 flex-col items-center justify-center text-[10px] font-semibold ${active ? "font-bold text-[#145C34]" : "text-[#6C8377]"}`} href={href}>
      <MaterialSymbol className="mb-0.5 text-xl" name={name} />
      <span>{label}</span>
    </Link>
  );
}
