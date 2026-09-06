import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeAuthRedirect } from "@/lib/auth/redirects";
import { AuthPanelClient } from "./_components/AuthPanelClient";

export default async function AuthPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ next?: string }>;
}>) {
  const params = await searchParams;

  return (
    <main className="auth-stitch journal-write-theme flex min-h-dvh w-full items-center justify-center bg-[var(--bg)] px-5 py-10">
      <AuthPanelClient configured={hasSupabaseEnv()} returnTo={safeAuthRedirect(params?.next)} />
    </main>
  );
}
