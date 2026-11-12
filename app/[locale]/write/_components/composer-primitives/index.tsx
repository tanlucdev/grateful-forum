import { Button } from "@/components/ui/button";
import type { EntryVisibility } from "@/lib/entries/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function MethodButton({ active, disabled = false, icon, label, onClick }: Readonly<{ active: boolean; disabled?: boolean; icon: string; label: string; onClick: () => void }>) {
  return <Button disabled={disabled} aria-pressed={active} variant="ghost" className="write-method-option min-w-0 rounded-full px-2 text-xs sm:px-3 sm:text-sm" onClick={onClick} type="button"><MaterialSymbol className="text-lg" name={icon} />{label}</Button>;
}

export function Visibility({ disabled, onChange, t, value }: Readonly<{ disabled: boolean; value: EntryVisibility; onChange: (value: EntryVisibility) => void; t: (key: string) => string }>) {
  return <div className="write-visibility grid min-w-0 gap-1 text-xs font-semibold sm:flex sm:flex-wrap sm:items-center sm:gap-2" data-tour="visibility">
    <label htmlFor="entry-visibility">{t("visibility.label")}</label>
    <Select disabled={disabled} onValueChange={(next) => { if (next === "private" || next === "public" || next === "anonymous") onChange(next); }} value={value}>
      <SelectTrigger className="min-h-11 w-full min-w-0 rounded-xl bg-muted px-3 sm:w-auto sm:min-w-40" id="entry-visibility"><SelectValue /></SelectTrigger>
      <SelectContent align="start" className="max-w-[calc(100vw-2rem)] rounded-xl p-1" position="popper" sideOffset={4}>
        {(["private", "public", "anonymous"] as const).map((item) => <SelectItem className="min-h-11 rounded-lg px-3 pr-9" key={item} value={item}>{t(`visibility.${item}`)}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>;
}
