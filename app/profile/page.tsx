import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";
import { ProfileScreen } from "./_components/ProfileScreen";
import { toProfileView } from "./_components/profile-view";

export default async function ProfilePage() {
  const dashboard = await loadOwnProfileDashboard();
  const view = toProfileView(dashboard);

  return <ProfileScreen view={view} />;
}
