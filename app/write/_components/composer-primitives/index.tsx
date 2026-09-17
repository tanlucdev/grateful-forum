import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function Panel({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  return <section className={`rounded-2xl bg-card p-4 md:p-6 ${className}`}>{children}</section>;
}

export function SectionTitle({ label, helper }: Readonly<{ label: string; helper: string }>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <MaterialSymbol className="text-primary" name="texture" />
        {label}
      </span>
      <span className="hidden shrink-0 text-[11px] font-medium text-muted-foreground sm:inline">{helper}</span>
    </div>
  );
}

export function TinyButton({ bare = false, danger = false, icon, label, onClick }: { bare?: boolean; danger?: boolean; icon: string; label: string; onClick?: () => void }) {
  return (
    <button className={`inline-flex items-center gap-1.5 text-[14px] font-semibold ${bare ? "" : "rounded-lg bg-card px-2.5 py-1 text-[12px] leading-4"} ${danger ? "text-destructive" : "text-muted-foreground"}`} onClick={onClick} type="button">
      <MaterialSymbol name={icon} />
      <span>{label}</span>
    </button>
  );
}

export function NavItem({ icon, label }: Readonly<{ icon: string; label: string }>) {
  return (
    <button className="flex min-h-11 min-w-[56px] flex-col items-center justify-center gap-1 text-muted-foreground" type="button">
      <MaterialSymbol name={icon} />
      <span className="text-[11px]">{label}</span>
    </button>
  );
}
