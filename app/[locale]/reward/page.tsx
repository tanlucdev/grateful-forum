import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { loadRewardOverview, RewardAuthError } from "@/lib/rewards/service";
import { RewardCollectionClient } from "./_components/reward-collection-client";
import { RewardOverview } from "./_components/reward-overview";
import { RewardStory } from "./_components/reward-story";

export default async function RewardPage() {
  const locale = await getLocale();
  let overview;
  try {
    overview = await loadRewardOverview();
  } catch (error) {
    if (error instanceof RewardAuthError) redirect(localizedLoginHref("/reward", locale));
    throw error;
  }
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 font-body-md text-foreground md:px-6 lg:py-7">
      <RewardOverview overview={overview} />
      <RewardCollectionClient badges={overview.badges} timezone={overview.timezone} />
      <RewardStory overview={overview} />
    </main>
  );
}
