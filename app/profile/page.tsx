import { redirect } from "next/navigation";
import { loginHref } from "@/lib/auth/redirects";
import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";
import { ProfileScreen } from "./_components/profile-screen";
import { toProfileView } from "./_components/profile-view";

export default async function ProfilePage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ tab?: string }>;
}>) {
  const dashboard = await loadOwnProfileDashboard();
  if (!dashboard) {
    redirect(loginHref("/profile"));
  }

  const view = toProfileView(dashboard);
  const resolvedSearchParams = await searchParams;
  const requestedTab = resolvedSearchParams?.tab;
  const initialTab =
    requestedTab === "public" || requestedTab === "moments" ? requestedTab : "all";

  return <ProfileScreen initialTab={initialTab} view={view} />;
}
