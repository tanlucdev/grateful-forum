import Image from "next/image";
import Link from "next/link";
import { ReportEntryButton } from "@/components/moderation/report-entry-button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { DisplayItem } from "./feed-data";
import { toneClasses } from "./feed-data";

export function MobileFeedCard({ item }: Readonly<{ item: DisplayItem }>) {
  return (
    <article className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_8px_30px_rgba(26,47,43,0.04)]">
      <div className="flex items-center gap-3">
        <Avatar item={item} />
        <div className="min-w-0 flex-1">
          <Author item={item} mobile />
          <p className="text-[13px] font-semibold leading-[18px] text-[#717877]">
            {item.time}
          </p>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-[22px] text-[#414847]">
        {item.content}
      </p>
      {item.isSample ? null : <ReportEntryButton entryId={item.id} />}
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
      {item.imageSrc ? (
        <div className="h-72 overflow-hidden rounded-2xl shadow-inner">
          <Image
            alt=""
            className="h-full w-full object-cover"
            height={288}
            src={item.imageSrc}
            width={720}
          />
        </div>
      ) : null}
      <div className="flex items-center gap-2 text-[#3d4a41]">
        <MaterialSymbol className={`text-base ${tone.text}`} fill name={item.tone === "tertiary" ? "favorite" : item.tone === "mint" ? "yard" : "spa"} />
        <span className="text-[11px] font-medium leading-[14px]">{item.detail}</span>
      </div>
      {item.isSample ? null : <ReportEntryButton entryId={item.id} />}
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
      <Link className="h-10 w-10 shrink-0 overflow-hidden rounded-full" href={item.profileHref}>
        {avatar}
      </Link>
    ) : (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">{avatar}</div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7e6e2] text-[#717877]">
      <MaterialSymbol className="text-xl" name="person" />
    </div>
  );
}

export function Author({ item, mobile = false }: Readonly<{ item: DisplayItem; mobile?: boolean }>) {
  const className = `${mobile ? "text-[13px] leading-[18px]" : "text-sm leading-5"} truncate font-semibold text-[#111e1c] ${
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
