import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <main aria-busy="true" className="mx-auto w-full max-w-[1200px] space-y-6 px-5 py-8">
    <Skeleton className="h-20 rounded-2xl" />
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"><Skeleton className="h-80 rounded-2xl" /><Skeleton className="h-80 rounded-2xl" /></div>
  </main>;
}
