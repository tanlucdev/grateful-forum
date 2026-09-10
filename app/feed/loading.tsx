import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <div className="min-h-svh bg-[#f4fbf8] text-[#161d1b]">
      <main className="min-h-svh md:mx-auto md:max-w-[1200px] md:px-6 md:pt-20">
        <section className="flex w-full min-w-0 flex-col gap-5 px-5 pt-4 md:hidden">
          <Skeleton className="h-24 rounded-[24px]" />
          <Skeleton className="h-24 rounded-[24px]" />
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-[24px]" />
            <Skeleton className="h-40 rounded-[24px]" />
            <Skeleton className="h-40 rounded-[24px]" />
          </div>
        </section>
        <section className="hidden w-full py-8 md:block">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <div className="space-y-3">
                <Skeleton className="h-3 w-40 rounded-full" />
                <Skeleton className="h-10 w-[min(28rem,70%)] rounded-full" />
                <Skeleton className="h-5 w-[min(36rem,88%)] rounded-full" />
              </div>
              <Skeleton className="h-36 rounded-[24px]" />
              <div className="space-y-5">
                <Skeleton className="h-40 rounded-[24px]" />
                <Skeleton className="h-40 rounded-[24px]" />
                <Skeleton className="h-40 rounded-[24px]" />
              </div>
            </div>
            <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:col-span-4">
              <Skeleton className="h-48 rounded-[24px]" />
              <Skeleton className="h-60 rounded-[24px]" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
