import Link from "next/link";
import { ReportEntryButton } from "@/components/moderation/report-entry-button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { DisplayItem } from "./feed-data";
import { toneClasses } from "./feed-data";

export function MobileFeedCard({ item }: Readonly<{ item: DisplayItem }>) {
  return (
    <article className="flex flex-col rounded-xl bg-[#ffffff] p-4 shadow-[0_2px_12px_rgba(26,47,43,0.03)]">
      <div className="mb-3 flex items-start gap-2.5">
        <Avatar item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Author item={item} mobile />
              <p className="truncate text-[11px] font-medium leading-[14px] text-[#6d7a70]">
                {item.time}
              </p>
            </div>
            <span className="max-w-[108px] shrink-0 truncate rounded-full bg-[#e8efec] px-2.5 py-0.5 text-[11px] font-medium leading-4 text-[#3d4a41]">
              {item.category}
            </span>
          </div>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-[22px] text-[#161d1b]">
        {item.content}
      </p>
      <div className="mt-3 flex flex-col items-start gap-2 rounded-b-xl bg-[#eef5f2]/40 pt-3 text-[#3d4a41] min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <MaterialSymbol className="text-base text-[#006d43]" name="public" />
          <span className="truncate text-[11px] font-medium leading-4">{item.detail}</span>
        </div>
      </div>
    </article>
  );
}

export function DesktopFeedCard({ item }: Readonly<{ item: DisplayItem }>) {
  const tone = toneClasses(item.tone);

  return (
    <article className="flex flex-col gap-4 rounded-3xl bg-white p-7 shadow-[0_2px_12px_rgba(26,47,43,0.03)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
          <span className={`text-[11px] font-bold uppercase leading-[14px] tracking-wider ${tone.text}`}>
            {item.category}
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-medium leading-[14px] text-[#6d7a70]">
          {item.time}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-lg leading-7 text-[#161d1b]">
        {item.content}
      </p>
      <div className="flex items-center gap-2 text-[#3d4a41]">
        <MaterialSymbol className={`text-base ${tone.text}`} name="public" />
        <span className="text-[11px] font-medium leading-[14px]">{item.detail}</span>
      </div>
      <ReportEntryButton entryId={item.id} />
    </article>
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
      <Link className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#d1e9e0]" href={item.profileHref}>
        {avatar}
      </Link>
    ) : (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#d1e9e0]">{avatar}</div>
    );
  }

  return item.initial ? (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d1e9e0] text-[16px] font-semibold text-[#006d43]">
      {item.initial}
    </div>
  ) : (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7e6e2] text-[#717877]">
      <MaterialSymbol className="text-xl" name="person" />
    </div>
  );
}

export function Author({ item, mobile = false }: Readonly<{ item: DisplayItem; mobile?: boolean }>) {
  const className = `${mobile ? "text-[13px] leading-[18px]" : "text-sm leading-5"} truncate font-semibold text-[#161d1b] ${
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
      <p className="pb-4 text-center text-sm text-[#5e6b68]" role="status">
        {status}
      </p>
    </>
  );
}

export function FeedEmptyState() {
  return (
    <section className="flex flex-col items-center gap-3 rounded-3xl bg-white px-5 py-10 text-center shadow-[0_2px_12px_rgba(26,47,43,0.03)]">
      <MaterialSymbol className="text-2xl text-[#006d43]" name="auto_stories" />
      <div className="space-y-1">
        <p className="text-sm font-semibold leading-5 text-[#161d1b]">Chưa có chia sẻ công khai</p>
        <p className="text-xs leading-4 text-[#3d4a41]">Các bài viết public hoặc anonymous sẽ xuất hiện tại đây.</p>
      </div>
      <Link className="inline-flex items-center gap-2 rounded-full bg-[#006d43] px-4 py-2 text-sm font-semibold leading-5 text-white" href="/write">
        <MaterialSymbol className="text-sm" name="edit" />
        <span>Viết ngay</span>
      </Link>
    </section>
  );
}
