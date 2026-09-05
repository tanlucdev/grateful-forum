import Image from "next/image";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { moods, prompts } from "./composer-data";

export function MobileComposerHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#f4fbf8]/85 shadow-[0_1px_8px_rgba(26,47,43,0.02)] backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center gap-3 px-4 pt-[env(safe-area-inset-top)]">
        <button
          aria-label="Quay lại"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#3d4a41] hover:bg-[#e8efec]"
          onClick={() => history.back()}
          type="button"
        >
          <MaterialSymbol name="arrow_back" />
        </button>
        <Image
          alt="Mascot Bé Mầm"
          className="mr-2 h-8 w-8 rounded-full border border-emerald-100 object-cover shadow-sm"
          height={32}
          src="/stitch/landing/mascot.jpg"
          width={32}
        />
        <h1 className="text-[20px] font-semibold leading-7 text-[#006d43]">
          Write
        </h1>
      </div>
    </header>
  );
}

export function MoodPicker({ mood, setMood }: Readonly<{ mood: string; setMood: (value: string) => void }>) {
  return (
    <div className="hidden flex-col justify-between gap-3 pb-6 sm:flex-row sm:items-center md:flex">
      <span className="text-[11px] font-semibold uppercase leading-[14px] text-[#3d4a41]">
        Cảm xúc hiện tại của bạn:
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {moods.map((item) => (
          <button
            aria-pressed={mood === item}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium leading-4 ${mood === item ? "bg-[#4ca374]/30 font-semibold text-[#00331d]" : "bg-[#eef5f2] text-[#3d4a41] hover:bg-[#d1e9e0]/40"}`}
            key={item}
            onClick={() => setMood(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptChips({ appendPrompt }: Readonly<{ appendPrompt: (text: string) => void }>) {
  return (
    <div className="mt-4 w-full overflow-x-auto pb-4 md:mt-6 md:flex md:items-center md:gap-2.5 md:overflow-visible md:pb-0">
      <span className="hidden shrink-0 items-center gap-1.5 text-[12px] font-medium leading-4 text-[#3d4a41] md:flex">
        <MaterialSymbol className="text-base text-[#006d43]" name="tips_and_updates" />
        Gợi ý suy ngẫm:
      </span>
      <div className="flex w-max gap-3 md:w-auto md:flex-wrap md:gap-2">
        {prompts.map((prompt) => (
          <button
            className="rounded-full bg-[#d1e9e0]/30 px-4 py-2 text-left text-[14px] font-semibold leading-5 text-[#0b7141] shadow-sm hover:bg-[#d1e9e0]/50 md:px-3.5 md:py-1.5 md:text-[12px] md:font-medium md:leading-4 md:text-[#3d4a41]"
            key={prompt.label}
            onClick={() => appendPrompt(prompt.text)}
            type="button"
          >
            <span className="md:hidden">{prompt.mobileLabel}</span>
            <span className="hidden md:inline">{prompt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MascotHint() {
  return (
    <div className="mt-10 hidden items-center gap-5 overflow-hidden rounded-2xl bg-[#d1e9e0]/30 p-6 shadow-sm md:flex">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center">
        <Image alt="Bé Mầm" className="h-full w-full select-none object-contain drop-shadow-sm" height={80} src="/stitch/landing/mascot.jpg" width={80} />
      </div>
      <div className="flex flex-col pr-4">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-[20px] font-bold leading-7 text-[#006d43]">
            Bé Mầm nhắc nhỏ
          </span>
          <MaterialSymbol className="text-base text-[#006d43]" name="arrow_back_ios_new" />
        </div>
        <p className="text-[16px] leading-snug text-[#1a2f2b]">
          Không cần là điều gì to tát, chỉ một ngụm nước mát hay một nụ cười ấm áp cũng đáng để trân quý và ghi lại.
        </p>
      </div>
    </div>
  );
}

export function DesktopComposerFooter() {
  return (
    <footer className="mt-auto hidden w-full bg-[#eef5f2] py-8 shadow-[0_-1px_6px_rgba(0,0,0,0.02)] md:block">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <MaterialSymbol className="text-xl text-[#006d43]" name="eco" />
          <span className="text-[20px] font-semibold leading-7 text-[#006d43]">
            BeGrateful
          </span>
          <span className="ml-2 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
            Nuôi dưỡng tâm hồn an yên
          </span>
        </div>
        <div className="text-[12px] font-medium leading-4 text-[#3d4a41]">
          © 2026 BeGrateful. Lan tỏa lòng biết ơn mỗi ngày.
        </div>
      </div>
    </footer>
  );
}
