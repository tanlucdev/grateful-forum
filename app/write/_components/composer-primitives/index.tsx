import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function Panel({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  return <section className={`rounded-2xl bg-white p-4 md:p-6 ${className}`}>{children}</section>;
}

export function SectionTitle({ label, helper }: Readonly<{ label: string; helper: string }>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3d4a41]">
        <MaterialSymbol className="text-[#006d43]" name="texture" />
        {label}
      </span>
      <span className="shrink-0 text-[11px] font-medium text-[#6d7a70]">{helper}</span>
    </div>
  );
}

export function TinyButton({ bare = false, danger = false, icon, label, onClick }: { bare?: boolean; danger?: boolean; icon: string; label: string; onClick?: () => void }) {
  return (
    <button className={`inline-flex items-center gap-1.5 text-[14px] font-semibold ${bare ? "" : "rounded-lg bg-white px-2.5 py-1 text-[12px] leading-4"} ${danger ? "text-[#ba1a1a]" : "text-[#3d4a41]"}`} onClick={onClick} type="button">
      <MaterialSymbol name={icon} />
      <span>{label}</span>
    </button>
  );
}

export function NavItem({ icon, label }: Readonly<{ icon: string; label: string }>) {
  return (
    <button className="flex min-h-11 min-w-[56px] flex-col items-center justify-center gap-1 text-[#3d4a41]" type="button">
      <MaterialSymbol name={icon} />
      <span className="text-[11px]">{label}</span>
    </button>
  );
}
