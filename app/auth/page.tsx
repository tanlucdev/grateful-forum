import { AuthPanel } from "@/components/auth/auth-panel";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function AuthPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Sign in to save guest gratitude entries to your account.
        </p>
      </div>
      <AuthPanel configured={hasSupabaseEnv()} />
    </main>
  );
}
