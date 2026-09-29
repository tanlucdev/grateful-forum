"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { migrateGuestData, registerAccount } from "@/lib/api/auth";
import { normalizeAuthErrorCode } from "@/lib/auth/errors";
import {
  type AuthFieldErrors,
  hasAuthErrors,
  validateAuthInput,
} from "@/lib/auth/validation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CredentialsPanelClient } from "./credentials-panel-client";
import { RecoveryPanelClient } from "./recovery-panel-client";
import type { AuthBanner, AuthView } from "./types";

type AuthApiErrorCode =
  | "auth_invalid_input"
  | "auth_invalid_session"
  | "auth_unconfigured"
  | "email_already_registered"
  | "email_rate_limit"
  | "guest_migration_failed"
  | "auth_failed";
type AuthApiMessageKey =
  | "authFailed"
  | "emailAlreadyRegistered"
  | "emailRateLimit"
  | "invalidInput"
  | "invalidSession"
  | "migrationFailed"
  | "unconfigured"
  | "unknown";

export function AuthPanelClient({
  configured,
  returnTo,
}: Readonly<{ configured: boolean; returnTo: string }>) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [view, setView] = useState<AuthView>("signin");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [banner, setBanner] = useState<AuthBanner | null>(null);
  const supabase = useMemo(
    () => (configured ? createSupabaseBrowserClient() : null),
    [configured],
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(returnTo);
    });
  }, [returnTo, router, supabase]);

  function clearFieldError(field: keyof AuthFieldErrors) {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function changeView(next: AuthView) {
    setView(next);
    setBanner(null);
    setFieldErrors({});
    setResetSent(false);
  }

  function showFailure(title: string, code?: string) {
    setBanner({ tone: "error", title, body: authApiMessage(t, code) });
  }

  async function submitAuth() {
    if (!supabase) return;

    const cleanEmail = email.trim();
    if (view === "forgot") {
      if (!cleanEmail) {
        setFieldErrors({ email: "emailRequired" });
        return;
      }
    } else {
      const errors = validateAuthInput({ displayName, email, password, signingUp: view === "signup" });
      setFieldErrors(errors);
      setBanner(null);
      if (hasAuthErrors(errors)) return;
    }

    setLoading(true);
    setBanner(null);

    try {
      const redirect = new URL("/auth/callback", window.location.origin);
      redirect.searchParams.set("next", returnTo);

      if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: redirect.toString(),
        });
        if (error) {
          showFailure(t("banners.recoveryFailed"), normalizeAuthErrorCode(error.message));
          return;
        }
        setResetSent(true);
        return;
      }

      if (view === "signup") {
        const createError = await registerAccount({
          displayName: displayName.trim(),
          email: cleanEmail,
          password,
        });
        if (createError) {
          showFailure(t("banners.signupFailed"), createError);
          return;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) {
        showFailure(
          t(view === "signin" ? "banners.signinFailed" : "banners.signupFailed"),
          normalizeAuthErrorCode(error.message),
        );
        return;
      }
      if (!data.session) {
        showFailure(t("banners.sessionFailed"), "auth_failed");
        return;
      }

      const migrationError = await migrateGuestData(data.session.access_token);
      if (migrationError) {
        showFailure(t("banners.migrationFailed"), migrationError);
        return;
      }
      toast.success(t(view === "signup" ? "toasts.signupSuccess" : "toasts.signinSuccess"));
      router.replace(returnTo);
      router.refresh();
    } catch {
      showFailure(t("banners.processingFailed"), "auth_failed");
    } finally {
      setLoading(false);
    }
  }

  if (view === "forgot") {
    return (
      <RecoveryPanelClient
        banner={banner}
        configured={configured}
        email={email}
        emailError={fieldErrors.email}
        loading={loading}
        onChangeView={changeView}
        onClearEmailError={() => clearFieldError("email")}
        onDismissBanner={() => setBanner(null)}
        onEmailChange={setEmail}
        onSubmit={() => void submitAuth()}
        resetSent={resetSent}
      />
    );
  }

  return (
    <CredentialsPanelClient
      banner={banner}
      configured={configured}
      displayName={displayName}
      email={email}
      fieldErrors={fieldErrors}
      loading={loading}
      onChangeView={changeView}
      onClearFieldError={clearFieldError}
      onDismissBanner={() => setBanner(null)}
      onDisplayNameChange={setDisplayName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={() => void submitAuth()}
      onTogglePassword={() => setShowPassword((current) => !current)}
      password={password}
      showPassword={showPassword}
      view={view}
    />
  );
}

function authApiMessage(t: ReturnType<typeof useTranslations<"auth">>, code?: string) {
  const key: Record<AuthApiErrorCode, AuthApiMessageKey> = {
    auth_failed: "authFailed",
    auth_invalid_input: "invalidInput",
    auth_invalid_session: "invalidSession",
    auth_unconfigured: "unconfigured",
    email_already_registered: "emailAlreadyRegistered",
    email_rate_limit: "emailRateLimit",
    guest_migration_failed: "migrationFailed",
  };
  return t(`apiErrors.${key[code as AuthApiErrorCode] ?? "unknown"}`);
}
