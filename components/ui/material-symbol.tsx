export function MaterialSymbol({
  className = "",
  fill = false,
  name,
}: Readonly<{ className?: string; fill?: boolean; name: string }>) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{ fontVariationSettings: fill ? "'FILL' 1" : undefined }}
    >
      {name}
    </span>
  );
}
