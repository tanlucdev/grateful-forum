"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Tooltip } from "radix-ui";
import { Button } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function FeedLikeClient({ count, liked, onToggle }: Readonly<{
  count: number;
  liked: boolean;
  onToggle: () => void;
}>) {
  const t = useTranslations("feed");
  const format = useFormatter();
  const label = t(liked ? "favorite.unlike" : "favorite.like");

  return (
    <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            aria-label={label}
            aria-pressed={liked}
            className={`min-h-11 min-w-11 gap-1.5 rounded-full px-2.5 text-xs! leading-4! ${liked ? "bg-accent/60 text-primary hover:bg-accent" : "text-muted-foreground hover:bg-muted/50 hover:text-primary"}`}
            onClick={onToggle}
            type="button"
            variant="ghost"
          >
            <MaterialSymbol className="text-base" fill={liked} name="favorite" strokeWidth={1.8} />
            {count > 0 ? <span className="tabular-nums">{format.number(count)}</span> : null}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="z-50 rounded-lg bg-foreground px-2.5 py-1.5 text-xs leading-4 text-background shadow-sm" collisionPadding={12} side="top" sideOffset={6}>
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
