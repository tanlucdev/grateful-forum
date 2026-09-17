import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeAuthRedirect } from "@/lib/auth/redirects";
import { AuthPanelClient } from "./_components/auth-panel-client";

export default async function AuthPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ next?: string }>;
}>) {
  const params = await searchParams;

  return (
    <main className="auth-stitch journal-write-theme app-garden-bg flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <AuthPanelClient configured={hasSupabaseEnv()} returnTo={safeAuthRedirect(params?.next)} />
    </main>
  );
}
