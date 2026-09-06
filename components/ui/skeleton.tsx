export function Skeleton({ className = "" }: Readonly<{ className?: string }>) {
  return <div aria-hidden="true" className={`animate-pulse bg-[#dde4e1] ${className}`} />;
}

