import type { JournalEntry } from "@/lib/profile/types";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { formatRelative, profileAssets, type ProfileView, visibilityLabel } from "../profile-view";

export function ProfileJournalBook({
  mobile = false,
  view,
}: Readonly<{ mobile?: boolean; view: ProfileView }>) {
  const entries = view.entries.slice(0, mobile ? 1 : 2);

  return (
    <div className={`relative ${mobile ? "pt-4" : ""}`}>
      <div className="absolute -top-1 left-12 z-20 flex flex-col items-center drop-shadow-[0_4px_6px_rgba(0,109,67,0.2)]">
        <div className="flex h-8 w-5 items-center justify-center rounded-t-sm bg-gradient-to-b from-[#006d43] to-[#006d3d] text-[#d1e9e0]">
          <MaterialSymbol className="text-sm" name="spa" />
        </div>
        <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#006d3d]" />
      </div>
      <div className="absolute -top-1 right-8 z-20 rotate-3 bg-[#d1e9e0]/90 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#006d43] shadow-sm">
        🌿 An Yên • 24.10
      </div>
      <div className="rounded-[24px] border border-[#cde0d6] bg-[#e2ede8] p-2.5 shadow-[0_16px_36px_rgba(26,47,43,0.1)] sm:p-3">
        <div className="relative overflow-hidden rounded-[18px] border border-[#ede7dc] bg-[#fdfbf7] shadow-[0_4px_20px_rgba(26,47,43,0.06)]">
          <div className="pointer-events-none absolute bottom-0 left-2.5 top-0 z-10 flex w-4 flex-col justify-around py-8">
            {Array.from({ length: 5 }, (_, index) => (
              <span className="h-2.5 w-2.5 rounded-full border border-[#968774]/40 bg-[#b8a896] shadow-inner" key={index} />
            ))}
          </div>
          <div className={`pl-8 pr-4 ${mobile ? "py-5" : "grid gap-0 py-6 md:grid-cols-2 md:pl-0 md:pr-0"}`}>
            {entries.length ? (
              entries.map((entry, index) => (
                <NotebookPage entry={entry} index={index} key={entry.id} />
              ))
            ) : (
              <EmptyNotebookPage />
            )}
          </div>
          <div className="h-2 w-full bg-gradient-to-t from-[#ede6d8]/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function NotebookPage({
  entry,
  index,
}: Readonly<{ entry: JournalEntry; index: number }>) {
  const gratitudeItems = entry.metadata.gratitudes.length
    ? entry.metadata.gratitudes.slice(0, 3)
    : [entry.content];
  const quote = entry.metadata.quote || entry.metadata.reflection || entry.content;
  const date = formatRelative(entry.createdAt);

  return (
    <section className={`relative flex flex-col justify-between ${index === 0 ? "border-b border-[#e5dccf] bg-gradient-to-r md:border-b-0 md:border-r" : "bg-gradient-to-l"} from-[#fdfbf7] to-[#f6f1e7] p-5 sm:p-8`}>
      {index === 1 ? (
        <div className="absolute right-5 top-4 z-10 flex h-12 w-12 rotate-6 flex-col items-center justify-center rounded-full border-2 border-white/60 bg-gradient-to-br from-[#c84b4f] to-[#9b2a2e] p-2 text-white shadow-lg">
          <span className="w-full rounded-full border border-dashed border-white/70 py-1 text-center text-[8px] font-bold tracking-widest">TÂM AN</span>
        </div>
      ) : null}
      <div>
        <div className={`mb-4 flex items-start justify-between border-b border-[#ebdcca] pb-3 ${index === 1 ? "pr-12" : ""}`}>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#006d43]/80">
              BEGRATEFUL DIARY • P.{24 + index}
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <MaterialSymbol className="text-sm text-[#6d7a70]" name="calendar_today" />
              <span className="text-xs font-semibold text-[#161d1b]">{date}</span>
            </div>
            <span className="mt-0.5 block text-[10px] text-[#6d7a70]">Mùa Thu Tĩnh Lặng 🍃</span>
          </div>
        </div>
        <div className="mb-4 rounded-2xl border border-[#ede3d4] bg-[#f5f1e8] p-3 shadow-[0_1px_4px_rgba(26,47,43,0.03)]">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border border-[#eae3d5] bg-white px-2 py-0.5 text-[10px] font-bold text-[#006d43] shadow-sm">
              {entry.metadata.mood || "Bình thản & Ấm áp"}
            </span>
            <span className="text-[10px] text-[#6d7a70]">{index === 0 ? "06:45 AM" : visibilityLabel(entry.visibility)}</span>
          </div>
          <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-xs italic leading-relaxed text-[#3d4a41]">“{quote}”</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[#006d43]">
            <MaterialSymbol className="text-lg" name="favorite" />
            <span className="text-xs font-bold">3 Điều biết ơn hôm nay</span>
          </div>
          {gratitudeItems.map((item, gratitudeIndex) => (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#eee8dc] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" key={`${entry.id}-${gratitudeIndex}`}>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d1e9e0] text-xs font-bold text-[#006d43] shadow-sm">
                {gratitudeIndex + 1}
              </span>
              <p className="line-clamp-3 flex-1 text-xs leading-snug text-[#161d1b]">{item}</p>
            </div>
          ))}
        </div>
        {entry.metadata.imageUrl ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-[#ede5d8] bg-white p-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="h-32 w-full rounded-lg object-cover" src={entry.metadata.imageUrl} />
          </div>
        ) : index === 0 ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-[#ede5d8] bg-white p-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="h-32 w-full rounded-lg object-cover" src={profileAssets.coffeeDesktop} />
          </div>
        ) : null}
        {index === 0 ? (
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#cbe1d5] bg-[#dbeee5] p-2.5 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c2dcd0] bg-white text-base shadow-sm">🌱</span>
            <p className="text-[11px] leading-tight text-[#3d4a41]">
              <strong className="font-semibold text-[#006d43]">Bé Mầm nhắn nhủ:</strong> Mỗi hơi thở chánh niệm là một hạt giống bình an đâm chồi.
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#ebdcca] pt-3 text-[11px] text-[#6d7a70]">
        <span className="flex items-center gap-1">
          <MaterialSymbol className="text-sm text-[#006d43]" name="pin_drop" />
          {entry.metadata.space || "Góc nhỏ bình yên"}
        </span>
        <span className="font-bold text-[#b5a796]">Trang {24 + index}</span>
      </div>
    </section>
  );
}

function EmptyNotebookPage() {
  return (
    <div className="p-8 text-center text-[#3d4a41]">
      <MaterialSymbol className="mx-auto mb-2 block text-3xl text-[#006d43]" name="auto_stories" />
      <p className="text-sm font-semibold">Chưa có nhật ký để mở sổ</p>
    </div>
  );
}
