import { redirect } from "next/navigation";

import { LandingClient } from "./_components/landing";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isAppLocale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isAppLocale(locale)) redirect("/vi");

  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/feed`);

  return <LandingClient />;
}
