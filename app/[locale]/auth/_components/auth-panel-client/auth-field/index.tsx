import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFieldErrors } from "@/lib/auth/validation";

export function AuthField({
  disabled,
  error,
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: Readonly<{
  disabled?: boolean;
  error?: AuthFieldErrors[keyof AuthFieldErrors];
  id: string;
  inputMode?: "email";
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "email" | "text";
  value: string;
}>) {
  const t = useTranslations("auth");
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label className="ml-1 text-xs leading-4 text-muted-foreground" htmlFor={id}>{label}</Label>
      <Input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="h-12 rounded-xl bg-input/50 px-4 py-3 text-base leading-6 text-foreground shadow-inner focus-visible:bg-card"
        disabled={disabled}
        id={id}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? <p className="ml-1 text-sm leading-5 font-semibold text-destructive" id={errorId} role="alert">{t(`fieldErrors.${error}`)}</p> : null}
    </div>
  );
}
