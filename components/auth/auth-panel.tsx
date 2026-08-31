"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut, Mail } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthPanel({ configured }: Readonly<{ configured: boolean }>) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(
    () => (configured ? createSupabaseBrowserClient() : null),
    [configured],
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signIn() {
    if (!supabase || !email) {
      return;
    }

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    setMessage(error ? error.message : "Check your email for a sign-in link.");
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
        Add Supabase values to `.env.local` to enable authentication.
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-medium text-[var(--text)]">
          Signed in as {user.email}
        </p>
        <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--text)] px-4 text-sm font-medium text-white" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <label className="text-sm font-medium text-[var(--text)]" htmlFor="email">
        Email
      </label>
      <div className="mt-2 flex gap-2">
        <input
          className="min-h-11 min-w-0 flex-1 rounded-full border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-[var(--trust)]"
          id="email"
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--trust)] px-4 text-sm font-medium text-white disabled:opacity-50"
          disabled={loading || !email}
          onClick={signIn}
          type="button"
        >
          <Mail className="h-4 w-4" />
          Sign in
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-[var(--muted)]" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
