import { MaterialSymbol } from "@/components/ui/material-symbol";

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
    green: ["#006d43", "#dcfce8", "#10b981"],
    rose: ["#e11d48", "#fff1f2", "#f43f5e"],
    teal: ["#0f766e", "#f0fdfa", "#14b8a6"],
  }[tone];

  return (
    <article className={`${mobile ? "rounded-2xl p-3.5" : "rounded-xl p-5"} flex flex-col justify-between border border-[#E3EFE9] bg-white shadow-[0_4px_16px_rgba(22,60,42,0.05)]`}>
      <div className="flex items-center justify-between">
        <span className={`${mobile ? "text-[11px]" : "text-xs"} font-bold uppercase tracking-wider text-[#6C8377]`}>{label}</span>
        <span className={`${mobile ? "h-6 w-6 text-xs" : "h-8 w-8 text-lg"} flex items-center justify-center rounded-full`} style={{ backgroundColor: toneMap[1], color: toneMap[0] }}>
          {icon ? <MaterialSymbol className={mobile ? "text-sm" : "text-lg"} name={icon} /> : emoji}
        </span>
      </div>
      <div className={`${mobile ? "mt-2" : "mt-3"} ${ring ? "flex items-center justify-between" : ""}`}>
        <div>
          <span className={`${mobile ? "text-2xl" : "text-[32px] leading-10"} font-black`} style={{ color: toneMap[0] }}>{value}</span>
          <span className={`${mobile ? "text-xs" : "text-xl"} ml-1 font-semibold`} style={{ color: toneMap[0] }}>{unit}</span>
          <p className={`${mobile ? "text-[11px]" : "text-xs"} mt-1 text-[#6C8377]`}>{hint}</p>
        </div>
        {ring ? <span className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#14b8a6] border-t-[#ccfbf1] bg-[#f0fdfa] text-[10px] font-bold text-[#0f766e]">{ring}</span> : null}
      </div>
      {progress ? (
        <div className={`${mobile ? "mt-2.5 h-1" : "mt-3 h-1.5"} w-full overflow-hidden rounded-full`} style={{ backgroundColor: toneMap[1] }}>
          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: toneMap[2] }} />
        </div>
      ) : null}
    </article>
  );
}

export function MascotLevel({ mobile = false }: Readonly<{ mobile?: boolean }>) {
  return (
    <article className={`${mobile ? "rounded-2xl p-3.5" : "rounded-xl p-5"} flex flex-col justify-between border border-[#bbf7d1] bg-gradient-to-br from-[#f0fdf6] to-[#ccfbf1]/70 shadow-[0_4px_16px_rgba(22,60,42,0.05)]`}>
      <div className="flex items-center justify-between">
        <span className={`${mobile ? "text-[11px]" : "text-xs"} font-bold uppercase tracking-wider text-[#145C34]`}>Cấp Bé Mầm</span>
        <span className="rounded-full bg-[#00a86b] px-2 py-0.5 text-[10px] font-bold text-white">Cấp 3/5</span>
      </div>
      <div className="my-2 flex items-center gap-3">
        <div className={`${mobile ? "h-8 w-8" : "h-12 w-12"} flex items-center justify-center rounded-full border border-[#dcfce8] bg-white text-lg shadow-sm`}>🌿</div>
        <div>
          <div className={`${mobile ? "text-xs" : "text-xl"} font-bold text-[#1C3127]`}>Mầm Căng Tràn</div>
          <p className={`${mobile ? "text-[10px]" : "text-xs"} text-[#0f7652]`}>Còn 8 ngày để nở hoa</p>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#bbf7d1]">
        <div className="h-full w-[65%] rounded-full bg-[#00a86b]" />
      </div>
    </article>
  );
}
