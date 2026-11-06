import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }: Readonly<{ className?: string }>) {
  return <div aria-hidden="true" className={cn("animate-pulse motion-reduce:animate-none rounded-md bg-muted", className)} />;
}
