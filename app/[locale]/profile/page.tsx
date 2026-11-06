import { z } from "zod";
import { redirect } from "next/navigation";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";
import { ProfileScreen } from "./_components/profile-screen";
import { toProfileView } from "./_components/profile-view";

export default async function ProfilePage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tab?: string; entry?: string }>;
}>) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const dashboard = await loadOwnProfileDashboard();
  if (!dashboard) {
    redirect(localizedLoginHref("/profile", locale));
  }

  const view = toProfileView(dashboard);
  const requestedTab = resolvedSearchParams?.tab;
  const entry = z.uuid().safeParse(resolvedSearchParams?.entry);
  view.requestedEntry = entry.success ? entry.data : undefined;
  const initialTab =
    requestedTab === "public" || requestedTab === "moments" ? requestedTab : "all";

  return <ProfileScreen initialTab={initialTab} view={view} />;
}
