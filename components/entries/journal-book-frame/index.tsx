import "./journal.css";
import { washiStyle } from "@/lib/entries/washi";
import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function JournalBookFrame({ children, label, mobile = false, washi = null, single = false }: Readonly<{
  children: ReactNode;
  label: string;
  mobile?: boolean;
  single?: boolean;
  washi?: string | null;
}>) {
  return <div className={`@container relative min-w-0 pt-4 ${mobile ? "" : "sm:pt-0"}`}>
    <div aria-hidden="true" className="absolute -top-1 left-12 z-20 flex flex-col items-center drop-shadow-sm">
      <div className="flex h-8 w-5 items-center justify-center rounded-t-sm bg-gradient-to-b from-primary to-[var(--leaf-deep)] text-accent"><MaterialSymbol className="text-sm" name="spa" /></div>
      <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-[var(--leaf-deep)]" />
    </div>
    {washi ? <div style={washiStyle(washi)} className="absolute -top-1 right-6 z-20 max-w-[60%] rotate-3 break-words px-3 py-1 text-xs font-semibold text-[#1a2f2b] shadow-sm">{label}</div> : null}
    <div className="rounded-[24px] bg-[#e2ede8] p-2.5 shadow-sm sm:p-3">
      <div className="relative overflow-hidden rounded-[18px] bg-[#fdfbf7] shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-2 top-0 z-10 flex w-3 flex-col justify-around py-8">
          {Array.from({ length: 5 }, (_, index) => <span className="h-2.5 w-2.5 rounded-full border border-[#968774]/40 bg-[#b8a896] shadow-inner" key={index} />)}
        </div>
        <div className={`grid min-w-0 py-5 pl-6 pr-2 ${single ? "" : "@min-[800px]:grid-cols-2"} @min-[800px]:py-6 @min-[800px]:pl-0 @min-[800px]:pr-0`}>{children}</div>
        <div aria-hidden="true" className="h-2 w-full bg-gradient-to-t from-[#ede6d8]/50 to-transparent" />
      </div>
    </div>
  </div>;
}

export function JournalBookPage({ children, index = 0, single = false }: Readonly<{ children: ReactNode; index?: number; single?: boolean }>) {
  return <section className={`relative flex min-w-0 flex-col justify-between from-[#fdfbf7] to-[#f6f1e7] p-3 [overflow-wrap:anywhere] @min-[390px]:p-5 @min-[800px]:p-8 ${single ? "bg-gradient-to-r" : index === 0 ? "border-b border-[#e5dccf] bg-gradient-to-r @min-[800px]:border-b-0 @min-[800px]:border-r" : "bg-gradient-to-l"}`}>{children}</section>;
}
