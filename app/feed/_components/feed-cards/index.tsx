import Image from "next/image";
import Link from "next/link";
import { ReportEntryButton } from "@/components/moderation/report-entry-button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { DisplayItem } from "../feed-data";
import { toneClasses } from "../feed-data";
import { MindfulActionsClient } from "../feed-actions-client";

export function MobileFeedCard({ item }: Readonly<{ item: DisplayItem }>) {
  const tone = toneClasses(item.tone);

  return (
    <article className="relative w-full min-w-0 rounded-3xl border border-[#e5eee9] bg-white p-5 shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06)]">
      <Tape tone={item.tone} />
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar item={item} />
          <div className="min-w-0 flex-1">
            <Author item={item} mobile />
            <p className="truncate text-[11px] font-medium leading-[14px] text-[#85978f]">
              {item.time} • {item.detail}
            </p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone.badge}`}>
          {item.isAnonymous ? "Ẩn danh" : "Công khai"}
        </span>
      </div>
      <EntryBody item={item} mobile />
      <Tags item={item} />
      <MindfulActionsClient item={item} compact />
    </article>
  );
}

export function DesktopFeedCard({ item }: Readonly<{ item: DisplayItem }>) {
  const tone = toneClasses(item.tone);

  return (
    <article className="relative w-full min-w-0 rounded-3xl border border-[#e5eee9] bg-white p-7 shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06),0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_20px_-2px_rgba(28,59,44,0.05)]">
      <Tape tone={item.tone} />
      <div className="mt-2 flex flex-col items-start justify-between gap-3 xl:flex-row xl:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar item={item} />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Author item={item} />
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.badge}`}>
                {item.isAnonymous ? "Chia sẻ ẩn danh" : "Thành viên gieo hạt"}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-[#85978f]">
              {item.time} • {item.detail}
            </p>
          </div>
        </div>
        <span className={`flex max-w-full shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone.badge}`}>
          <span>{tone.moodIcon}</span>
          <span>{item.metadata.mood || (item.isAnonymous ? "Lắng đọng" : "An yên")}</span>
        </span>
      </div>
      <EntryBody item={item} />
      <Tags item={item} />
      <MindfulActionsClient item={item} />
      <ReportEntryButton entryId={item.id} />
    </article>
  );
}

function EntryBody({ item, mobile = false }: Readonly<{ item: DisplayItem; mobile?: boolean }>) {
  const hasMetadata = item.metadata.gratitudes.length || item.metadata.reflection || item.metadata.quote || item.metadata.imageUrl;

  if (!hasMetadata) {
    return <p className="mt-4 whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-[#2d4237]">{item.content}</p>;
  }

  return (
    <div className={`${mobile ? "mt-4 gap-3" : "mt-4 gap-4"} flex flex-col`}>
      {item.metadata.quote ? (
        <p className={`${mobile ? "text-sm" : "text-[15px]"} whitespace-pre-wrap border-l-2 border-emerald-300 pl-4 italic leading-relaxed text-[#2d4237]`}>
          “{item.metadata.quote}”
        </p>
      ) : null}
      {item.metadata.gratitudes.length ? (
        <ul className="space-y-2.5">
          {item.metadata.gratitudes.map((text, index) => (
            <li className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#e5eee9] bg-[#f8faf8] p-3.5" key={`${index}-${text}`}>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                {index + 1}
              </span>
              <p className={`${mobile ? "text-[14px]" : "text-sm"} min-w-0 whitespace-pre-wrap leading-relaxed text-[#264234]`}>
                {text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {item.metadata.reflection ? (
        <p className={`${mobile ? "text-[15px]" : "text-[15px]"} whitespace-pre-wrap font-medium leading-relaxed text-[#2d4237]`}>
          {item.metadata.reflection}
        </p>
      ) : null}
      {item.metadata.imageUrl || !item.metadata.gratitudes.length ? <Polaroid item={item} mobile={mobile} /> : null}
    </div>
  );
}

function Polaroid({ item, mobile }: Readonly<{ item: DisplayItem; mobile: boolean }>) {
  const imageUrl = item.metadata.imageUrl;
  const fallback = item.tone === "tertiary" ? "/stitch/feed/succulent.jpg" : "/stitch/feed/breakfast.jpg";
  const caption = item.metadata.space || (item.tone === "tertiary" ? "Chồi non sau mưa" : "Góc nhỏ bình yên");

  return (
    <div className="flex justify-center sm:justify-start">
      <div className={`${mobile ? "max-w-[260px]" : "max-w-sm"} w-full rounded-xl border border-[#e5eee9]/70 bg-white p-[10px] pb-6 shadow-[0_12px_28px_-6px_rgba(45,60,50,0.12),0_2px_6px_rgba(0,0,0,0.04)]`}>
        <div
          className={`${mobile ? "h-40" : "aspect-[4/3]"} relative overflow-hidden rounded-lg bg-amber-50 bg-cover bg-center`}
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        >
          {imageUrl ? null : (
            <Image alt="" className="object-cover" fill sizes={mobile ? "260px" : "384px"} src={fallback} />
          )}
          <span className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            📷 {caption}
          </span>
        </div>
        <p className="pt-2 text-center font-serif text-sm italic text-[#4a5752]">“{caption}”</p>
      </div>
    </div>
  );
}

export function Avatar({ item }: Readonly<{ item: DisplayItem }>) {
  if (item.avatarUrl) {
    const avatar = (
      <span
        aria-hidden="true"
        className="block h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${item.avatarUrl})` }}
      />
    );

    return item.profileHref ? (
      <Link className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-100 bg-[#d1e9e0]" href={item.profileHref}>
        {avatar}
      </Link>
    ) : (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-100 bg-[#d1e9e0]">{avatar}</div>
    );
  }

  return item.initial ? (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-[#dcfce7] text-sm font-bold text-emerald-900">
      {item.initial}
    </div>
  ) : (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg text-emerald-800">
      🍃
    </div>
  );
}

export function Author({ item, mobile = false }: Readonly<{ item: DisplayItem; mobile?: boolean }>) {
  const className = `${mobile ? "text-[13px] leading-[18px]" : "text-sm leading-5"} truncate font-bold text-[#1c3b2c] ${
    item.isAnonymous ? "italic" : ""
  }`;

  if (item.profileHref) {
    return (
      <Link className={className} href={item.profileHref}>
        {item.authorName}
      </Link>
    );
  }

  return <p className={className}>{item.authorName}</p>;
}

export function FeedSentinel({
  refEl,
  status,
}: Readonly<{
  refEl: React.RefObject<HTMLDivElement | null>;
  status: string;
}>) {
  return (
    <>
      <div className="h-6" ref={refEl} />
      <p className="pb-4 text-center text-sm font-medium text-[#6b7a74]" role="status">
        {status}
      </p>
    </>
  );
}

export function FeedEmptyState() {
  return (
    <section className="flex flex-col items-center gap-3 rounded-3xl border border-[#e5eee9] bg-white px-5 py-10 text-center shadow-[0_2px_14px_-1px_rgba(60,80,70,0.06)]">
      <MaterialSymbol className="text-2xl text-[#00a86b]" name="auto_stories" />
      <div className="space-y-1">
        <p className="text-sm font-bold leading-5 text-[#1c3b2c]">Chưa có chia sẻ công khai</p>
        <p className="text-xs leading-4 text-[#6b7a74]">Các bài viết public hoặc anonymous sẽ xuất hiện tại đây.</p>
      </div>
      <Link className="inline-flex items-center gap-2 rounded-full bg-[#00a86b] px-4 py-2 text-sm font-bold leading-5 text-white" href="/write">
        <MaterialSymbol className="text-sm" name="edit" />
        <span>Viết ngay</span>
      </Link>
    </section>
  );
}

function Tape({ tone }: Readonly<{ tone: DisplayItem["tone"] }>) {
  const toneClass = toneClasses(tone).tape;
  const label = tone === "tertiary" ? "🌸 Lặng lẽ gieo hạt" : tone === "mint" ? "🌾 Khoảnh khắc nhỏ" : "☀️ Biết ơn hôm nay";

  return (
    <div className={`absolute -top-2.5 left-8 flex h-6 w-32 items-center justify-center text-[10px] font-bold tracking-wider [clip-path:polygon(3%_0%,97%_0%,100%_50%,97%_100%,3%_100%,0%_50%)] ${toneClass}`}>
      {label}
    </div>
  );
}

function Tags({ item }: Readonly<{ item: DisplayItem }>) {
  const tags = [item.metadata.mood, item.metadata.sticker, item.metadata.space].filter(Boolean);

  if (!tags.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((label) => (
        <span className="max-w-full truncate rounded-lg bg-[#f0f6f3] px-2.5 py-1 text-xs font-medium text-[#466657]" key={label}>
          #{String(label).replace(/\s+/g, "_").toLowerCase()}
        </span>
      ))}
    </div>
  );
}
