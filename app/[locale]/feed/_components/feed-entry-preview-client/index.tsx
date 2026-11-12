"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

export function FeedEntryPreviewClient({ children }: Readonly<{ children: ReactNode }>) {
  const t = useTranslations("feed");
  const id = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || expanded) return;
    const observer = new ResizeObserver(() => {
      setOverflows(Boolean(content.querySelector("li:nth-child(n+3)")) ||
        Array.from(content.querySelectorAll("p")).some((paragraph) => paragraph.scrollHeight > paragraph.clientHeight + 1));
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [children, expanded]);

  return (
    <div className="mt-3 min-w-0">
      <div
        className={expanded ? "" : "[&_li:nth-child(n+3)]:hidden [&_p]:line-clamp-2"}
        id={id}
        ref={contentRef}
      >
        {children}
      </div>
      {overflows || expanded ? (
        <button
          aria-controls={id}
          aria-expanded={expanded}
          className="mt-1 inline-flex min-h-11 min-w-11 items-center rounded-lg text-sm font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {t(expanded ? "entryPreview.showLess" : "entryPreview.showMore")}
        </button>
      ) : null}
    </div>
  );
}
