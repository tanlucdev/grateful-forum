import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeLocalizedAuthRedirect } from "@/lib/auth/redirects";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { AuthPanelClient } from "./_components/auth-panel-client";

export default async function AuthPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ next?: string }>;
}>) {
  const { locale } = await params;
  const query = await searchParams;

  return (
    <main className="auth-stitch journal-write-theme app-garden-bg relative flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <LocaleSwitcher className="absolute top-5 right-5 hidden lg:grid" />
      <AuthPanelClient configured={hasSupabaseEnv()} locale={locale} returnTo={safeLocalizedAuthRedirect(query?.next, locale)} />
    </main>
  );
}
