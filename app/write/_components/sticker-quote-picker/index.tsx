import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  writeQuotes,
  type WriteQuote,
} from "../composer-data";

export function QuotePicker({
  onSelect,
  quote,
}: Readonly<{
  onSelect: (value: WriteQuote) => void;
  quote: WriteQuote;
}>) {
  return (
    <div className="space-y-2">
      {writeQuotes.map((item) => {
        const active = quote === item;
        return (
          <button
            aria-pressed={active}
            className={`flex w-full items-start gap-2 rounded-xl p-3 text-left text-[13px] font-medium leading-5 outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
              active ? "bg-accent/80 text-primary ring-1 ring-primary/30" : "bg-muted/60 text-muted-foreground hover:bg-card"
            }`}
            key={item}
            onClick={() => onSelect(item)}
            type="button"
          >
            <MaterialSymbol className="mt-0.5 shrink-0 text-[16px]" name="format_quote" />
            <span>“{item}”</span>
          </button>
        );
      })}
    </div>
  );
}
