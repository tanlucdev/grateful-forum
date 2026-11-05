import { RewardCollectionClient } from "./_components/reward-collection-client";
import { RewardOverview } from "./_components/reward-overview";
import { RewardStory } from "./_components/reward-story";

export default function RewardPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-7 px-5 py-6 font-body-md text-foreground md:px-8 lg:py-9">
      <RewardOverview />
      <RewardCollectionClient />
      <RewardStory />
    </main>
  );
}
