import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <main className="auth-stitch app-garden-bg flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-[440px] space-y-4 rounded-[24px] bg-card p-6 shadow-sm">
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-5 w-56 rounded-full" />
        <div className="space-y-3 pt-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
