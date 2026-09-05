import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";
import { ProfileScreen } from "./_components/ProfileScreen";
import { toProfileView } from "./_components/profile-view";

export default async function ProfilePage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ tab?: string }>;
}>) {
  const dashboard = await loadOwnProfileDashboard();
  const view = toProfileView(dashboard);
  const resolvedSearchParams = await searchParams;
  const requestedTab = resolvedSearchParams?.tab;
  const initialTab =
    requestedTab === "public" || requestedTab === "moments" ? requestedTab : "all";

  return <ProfileScreen initialTab={initialTab} view={view} />;
}
