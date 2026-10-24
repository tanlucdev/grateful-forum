import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { OnboardingTourProviderClient } from "@/components/onboarding-tour-provider-client";
import { isAppLocale, routing } from "@/i18n/routing";
import { loadOwnShellProfile } from "@/lib/profile/load-own-profile";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("common");

  const profile = await loadOwnShellProfile();
  const authenticated = Boolean(profile);

  return (
    <NextIntlClientProvider>
      <OnboardingTourProviderClient>
        <AppShell
          locale={locale}
          profile={{
            avatarUrl: profile?.avatarUrl || "",
            displayName: profile?.displayName || t("navigation.account"),
            email: profile?.email || "",
            signedIn: authenticated,
            streak: profile?.streak || 0,
          }}
        >
          {children}
        </AppShell>
      </OnboardingTourProviderClient>
    </NextIntlClientProvider>
  );
}
