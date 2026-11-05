import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";

export default async function RewardLoading() {
  const t = await getTranslations("reward");
  return (
    <main aria-busy="true" aria-label={t("loading")} className="mx-auto max-w-7xl space-y-5 px-5 py-7">
      <Skeleton className="h-7 w-2/3" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-40 rounded-2xl" key={index} />)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 12 }, (_, index) => <Skeleton className="h-64 rounded-2xl" key={index} />)}</div>
    </main>
  );
}
