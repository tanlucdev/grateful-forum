import { hasSupabaseEnv } from "@/lib/supabase/env";
import { AuthPanelClient } from "./_components/AuthPanelClient";

export default async function AuthPage() {
  return (
    <main className="auth-stitch flex min-h-dvh w-full items-center justify-center bg-[var(--bg)] px-5 py-10">
      <AuthPanelClient configured={hasSupabaseEnv()} />
    </main>
  );
}
