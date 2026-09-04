import { heatPattern } from "./calendar-data";

export function GardenDesktop() {
  return (
    <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(26,47,43,0.03)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D1E9E0]/60 text-2xl">🌸</span>
          <div>
            <h2 className="text-2xl font-semibold leading-8 text-[#1A2F2B]">Vườn hoa 365 ngày gieo mầm <span className="rounded-full bg-[#006d43]/10 px-2 py-0.5 text-xs font-bold text-[#006d43]">Năm 2024</span></h2>
            <p className="text-sm text-[#3d4a41]">Mỗi ngày một điều biết ơn là một mầm hoa được tưới tắm an lành cùng Bé Mầm 🌱🌸</p>
          </div>
        </div>
        <span className="flex items-center gap-3 rounded-xl border border-[#dde4e1] bg-[#eef5f2] px-4 py-2 text-xs text-[#3d4a41]">
          <span className="text-2xl">🌱</span>
          <span>Hành trình nở rộ<br /><strong className="text-[#006d43]">Đã tưới mát 214 đóa hoa tâm hồn ✨</strong></span>
        </span>
      </div>
      <div className="mb-6 flex items-center justify-between rounded-xl bg-[#D1E9E0]/35 px-4 py-3 text-sm text-[#3d4a41]">
        <span><strong className="text-[#006d43]">Hôm nay, 24/10:</strong> 2 đóa hoa đang bung nở ngát hương • Chuỗi 14 ngày gieo mầm liên tục</span>
        <span>Rê chuột ngắm hoa từng ngày</span>
      </div>
      <div className="rounded-xl border border-[#dde4e1] bg-[#f4fbf8] p-5">
        <div className="mb-2 ml-8 grid grid-cols-12 text-center text-xs font-semibold text-[#3d4a41]">
          {Array.from({ length: 12 }, (_, index) => <span className={index === 9 ? "text-[#006d43]" : ""} key={index}>Th {index + 1}</span>)}
        </div>
        <div className="space-y-1.5">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, row) => (
            <div className="flex items-center gap-2" key={day}>
              <span className={`w-6 shrink-0 text-right text-[10px] font-bold ${day === "T5" ? "text-[#006d43]" : "text-[#3d4a41]"}`}>{day}</span>
              <div className="grid flex-1 grid-cols-[repeat(52,minmax(0,1fr))] items-center gap-1">
                {Array.from({ length: 52 }, (_, col) => <HeatDot col={col} key={col} row={row} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <GardenLegend desktop />
    </section>
  );
}

export function GardenMobile() {
  return (
    <section className="rounded-3xl border border-[#E3EFE9] bg-white p-4 shadow-[0_4px_16px_rgba(22,60,42,0.05)]">
      <div className="flex items-center justify-between border-b border-[#E3EFE9]/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🌸</span>
          <div>
            <h2 className="text-sm font-bold text-[#1C3127]">Vườn hoa 365 ngày gieo mầm</h2>
            <p className="text-[11px] font-medium text-[#0f7652]">Đã tưới mát 214 đóa hoa tâm hồn ✨</p>
          </div>
        </div>
        <span className="rounded-md border border-[#dcfce8] bg-[#f0fdf6] px-2 py-0.5 text-[11px] font-bold text-[#145C34]">2024</span>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {["Mùa Xuân", "Mùa Hạ", "Mùa Thu (Hiện tại)", "Mùa Đông"].map((season, index) => (
          <button className={`whitespace-nowrap rounded-lg px-2.5 py-1 ${index === 2 ? "bg-[#145C34] text-white" : "bg-gray-100 text-gray-500"}`} key={season}>{season}</button>
        ))}
      </div>
      <div className="mt-3.5 rounded-2xl border border-[#bbf7d1]/60 bg-[#f0fdf6]/50 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-[#6C8377]">
          <span>Tháng 8</span><span>Tháng 9</span><span className="text-[#0f7652]">Tháng 10 (Hiện tại)</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 justify-between gap-1.5 py-1">
          {Array.from({ length: 84 }, (_, index) => <MiniHeatDot active={index === 67} future={index > 70} key={index} level={index % 4} />)}
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-[#bbf7d1]/50 pt-2 text-[11px] text-[#1C3127]">
          <span>🌱 Hôm nay (24/10): <strong>2 hạt giống đã gieo</strong></span>
          <span className="font-bold text-[#0f7652]">#14</span>
        </div>
      </div>
      <GardenLegend />
    </section>
  );
}

function HeatDot({ row, col }: Readonly<{ row: number; col: number }>) {
  const future = col > 41;
  const today = row === 3 && col === 41;
  const kind = future ? "empty" : heatPattern[(row + col) % heatPattern.length];
  const classes = {
    bloom: "bg-[#006d43] text-white",
    empty: "bg-[#e8efec]/70",
    seed: "bg-[#D1E9E0]",
    sprout: "bg-[#99f3b6]",
  }[kind];
  const mark = kind === "bloom" ? "🌸" : kind === "seed" ? "🌱" : kind === "sprout" ? "🌿" : "";
  return <span className={`flex h-3.5 items-center justify-center rounded-full text-[8px] transition-transform hover:scale-125 ${classes} ${today ? "animate-pulse ring-2 ring-[#a5393e] ring-offset-1" : ""}`}>{mark}</span>;
}

function MiniHeatDot({ level, active, future }: Readonly<{ level: number; active?: boolean; future?: boolean }>) {
  const bg = future ? "bg-gray-200" : ["bg-[#bbf7d1]", "bg-[#10b981]", "bg-[#00a86b]", "bg-[#0f7652]"][level];
  return <span className={`h-3 w-3 rounded-sm ${bg} ${active ? "ring-2 ring-amber-400 ring-offset-1" : ""}`} />;
}

function GardenLegend({ desktop = false }: Readonly<{ desktop?: boolean }>) {
  return (
    <div className={`${desktop ? "mt-6 border-t border-[#e8efec] pt-3" : "mt-3 pt-1"} flex items-center justify-between gap-2 text-[10px] text-[#6C8377]`}>
      <span>{desktop ? "Cùng Bé Mầm kiên trì gieo mầm mỗi ngày để cả khu vườn luôn ngát hương an lành." : "Gieo ít"}</span>
      <div className="flex items-center gap-1.5">
        {["bg-gray-200", "bg-[#bbf7d1]", "bg-[#10b981]", "bg-[#0f7652]"].map((color) => <span className={`h-2.5 w-2.5 rounded-sm ${color}`} key={color} />)}
      </div>
      <span>{desktop ? "Nở rực rỡ (&gt;2)" : "Nở rộ nhiều"}</span>
    </div>
  );
}
