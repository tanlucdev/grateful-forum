import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CalendarOverview } from "@/lib/calendar/dto";

export function Metric({
  label,
  icon,
  emoji,
  value,
  unit,
  hint,
  tone,
  progress,
  ring,
  mobile,
}: Readonly<{
  label: string;
  icon?: string;
  emoji?: string;
  value: string;
  unit: string;
  hint: string;
  tone: "rose" | "green" | "teal";
  progress?: number;
  ring?: string;
  mobile?: boolean;
}>) {
  const toneMap = {
    green: ["var(--primary)", "var(--accent)", "var(--primary)"],
    rose: ["var(--fire)", "var(--fire-soft)", "var(--fire)"],
    teal: ["var(--primary)", "var(--accent)", "var(--primary)"],
  }[tone];

  return (
    <article className={`${mobile ? "rounded-2xl p-3.5" : "rounded-xl p-5"} flex flex-col justify-between border border-border bg-card shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className={`${mobile ? "text-[11px]" : "text-xs"} font-bold uppercase tracking-wider text-muted-foreground`}>{label}</span>
        <span className={`${mobile ? "h-6 w-6 text-xs" : "h-8 w-8 text-lg"} flex items-center justify-center rounded-full`} style={{ backgroundColor: toneMap[1], color: toneMap[0] }}>
          {icon ? <MaterialSymbol className={mobile ? "text-sm" : "text-lg"} name={icon} /> : emoji}
        </span>
      </div>
      <div className={`${mobile ? "mt-2" : "mt-3"} ${ring ? "flex items-center justify-between" : ""}`}>
        <div>
          <span className={`${mobile ? "text-2xl" : "text-[32px] leading-10"} font-black`} style={{ color: toneMap[0] }}>{value}</span>
          <span className={`${mobile ? "text-xs" : "text-xl"} ml-1 font-semibold`} style={{ color: toneMap[0] }}>{unit}</span>
          <p className={`${mobile ? "text-[11px]" : "text-xs"} mt-1 text-muted-foreground`}>{hint}</p>
        </div>
        {ring ? <span className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary border-t-accent bg-accent/40 text-[10px] font-bold text-primary">{ring}</span> : null}
      </div>
      {progress ? (
        <div className={`${mobile ? "mt-2.5 h-1" : "mt-3 h-1.5"} w-full overflow-hidden rounded-full`} style={{ backgroundColor: toneMap[1] }}>
          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: toneMap[2] }} />
        </div>
      ) : null}
    </article>
  );
}

export function MascotLevel({ mobile = false, mascot }: Readonly<{ mobile?: boolean; mascot: CalendarOverview["mascot"] }>) {
  return (
    <article className={`${mobile ? "rounded-2xl p-3.5" : "rounded-xl p-5"} flex flex-col justify-between border border-accent bg-gradient-to-br from-accent/30 to-muted shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className={`${mobile ? "text-[11px]" : "text-xs"} font-bold uppercase tracking-wider text-[var(--leaf-deep)]`}>Cấp Bé Mầm</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">Cấp {mascot.level}/{mascot.maxLevel}</span>
      </div>
      <div className="my-2 flex items-center gap-3">
        <div className={`${mobile ? "h-8 w-8" : "h-12 w-12"} flex items-center justify-center rounded-full border border-accent bg-card text-lg shadow-sm`}>🌿</div>
        <div>
          <div className={`${mobile ? "text-xs" : "text-xl"} font-bold text-foreground`}>{mascot.label}</div>
          <p className={`${mobile ? "text-[10px]" : "text-xs"} text-primary`}>Còn {mascot.daysToNextLevel} ngày để nở hoa</p>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent">
        <div className="h-full rounded-full bg-primary" style={{ width: `${mascot.progress * 100}%` }} />
      </div>
    </article>
  );
}
