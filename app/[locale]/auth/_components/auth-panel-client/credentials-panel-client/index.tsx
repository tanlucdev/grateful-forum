"use client";

import { ArrowRight, Eye, EyeOff, Info, Leaf, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFieldErrors } from "@/lib/auth/validation";
import { AuthField } from "../auth-field";
import type { AuthBanner, AuthView } from "../types";

export function CredentialsPanelClient({
  banner,
  configured,
  displayName,
  email,
  fieldErrors,
  loading,
  googleLoading,
  onGoogleSignIn,
  onChangeView,
  onClearFieldError,
  onDismissBanner,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onTogglePassword,
  password,
  showPassword,
  view,
}: Readonly<{
  banner: AuthBanner | null;
  configured: boolean;
  displayName: string;
  email: string;
  fieldErrors: AuthFieldErrors;
  loading: boolean;
  googleLoading: boolean;
  onGoogleSignIn: () => void;
  onChangeView: (view: AuthView) => void;
  onClearFieldError: (field: keyof AuthFieldErrors) => void;
  onDismissBanner: () => void;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onTogglePassword: () => void;
  password: string;
  showPassword: boolean;
  view: Exclude<AuthView, "forgot">;
}>) {
  const t = useTranslations("auth");
  const isSignup = view === "signup";

  return (
    <section className="w-full max-w-[400px] font-[family-name:var(--font-quicksand)]">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Leaf className="h-7 w-7" fill="currentColor" strokeWidth={1.5} /></div>
        <h1 className="mb-2 text-[28px] leading-9 font-bold text-foreground">{t("productName")}</h1>
        <p className="text-base leading-6 text-muted-foreground">{t("title")}</p>
      </div>
      <div className="rounded-[24px] bg-card p-6 shadow-sm">
        <form className="flex w-full flex-col gap-5" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          {banner?.tone === "error" ? (
            <div className="relative flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-3.5 shadow-sm" role="alert">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"><Info className="h-[17px] w-[17px]" /></div>
              <div className="min-w-0 pr-8 [overflow-wrap:anywhere]"><p className="text-[13px] font-semibold leading-5 text-destructive">{banner.title}</p><p className="mt-0.5 text-[12px] leading-[17px] text-destructive/80">{banner.body}</p></div>
              <button aria-label={t("a11y.dismissBanner")} className="absolute top-0 right-0 flex h-11 w-11 items-center justify-center rounded-full text-destructive/70" onClick={onDismissBanner} type="button"><X className="h-[15px] w-[15px]" /></button>
            </div>
          ) : null}
          {isSignup ? <div className="rounded-2xl bg-accent/30 p-4"><p className="text-sm leading-5 font-semibold text-foreground">{t("signupNotice")}</p></div> : null}
          {isSignup ? (
            <AuthField
              disabled={!configured || loading}
              error={fieldErrors.displayName}
              id="display-name"
              label={t("labels.displayName")}
              onChange={(value) => { onDisplayNameChange(value); onClearFieldError("displayName"); }}
              placeholder={t("placeholders.displayName")}
              value={displayName}
            />
          ) : null}
          <AuthField
            disabled={!configured || loading}
            error={fieldErrors.email}
            id="email"
            inputMode="email"
            label={t("labels.email")}
            onChange={(value) => { onEmailChange(value); onClearFieldError("email"); }}
            placeholder={t("placeholders.email")}
            type="email"
            value={email}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label className="ml-1 text-xs leading-4 text-muted-foreground" htmlFor="password">{t("labels.password")}</Label>
              {!isSignup ? <button className="min-h-11 rounded-xl px-2 text-[13px] font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring" onClick={() => onChangeView("forgot")} type="button">{t("forgot")}</button> : null}
            </div>
            <div className="relative">
              <Input
                aria-describedby={fieldErrors.password ? "password-help password-error" : "password-help"}
                aria-invalid={Boolean(fieldErrors.password)}
                className="h-12 rounded-xl bg-input/50 px-4 py-3 pr-12 text-base leading-6 text-foreground shadow-inner focus-visible:bg-card"
                disabled={!configured || loading}
                id="password"
                onChange={(event) => { onPasswordChange(event.target.value); onClearFieldError("password"); }}
                placeholder={t("placeholders.password")}
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button aria-label={t(showPassword ? "a11y.hidePassword" : "a11y.showPassword")} className="absolute top-1/2 right-3 flex min-h-11 w-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-primary" onClick={onTogglePassword} type="button">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
            </div>
            <p className="ml-1 text-[11px] leading-4 font-medium text-muted-foreground" id="password-help">{t("passwordHint")}</p>
            {fieldErrors.password ? <p className="ml-1 text-sm leading-5 font-semibold text-destructive" id="password-error" role="alert">{t(`fieldErrors.${fieldErrors.password}`)}</p> : null}
          </div>
          <Button className="mt-1 w-full shadow-sm hover:shadow-sm disabled:shadow-none" disabled={!configured || loading} size="lg" type="submit"><span>{loading ? t("loading.credentials") : t(isSignup ? "signUp" : "signIn")}</span>{loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowRight className="h-[18px] w-[18px]" />}</Button>
        </form>
        <Button className="mt-5 w-full whitespace-normal" variant="outline" size="lg" type="button" disabled={!configured || loading} aria-busy={googleLoading} onClick={onGoogleSignIn}>
          {googleLoading ? <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : (
            <svg className="size-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.67-.35-3.92H24.4v7.42h10.77a9.21 9.21 0 0 1-3.99 6.05v5.03h6.46c3.78-3.48 5.97-8.61 5.97-14.58Z" />
              <path fill="#34A853" d="M24.4 44c5.4 0 9.92-1.79 13.23-4.86l-6.46-5.03c-1.79 1.2-4.07 1.93-6.77 1.93-5.21 0-9.63-3.52-11.21-8.26H6.52v5.18A19.99 19.99 0 0 0 24.4 44Z" />
              <path fill="#FBBC05" d="M13.19 27.78a12 12 0 0 1 0-7.56v-5.18H6.52a20 20 0 0 0 0 17.92l6.67-5.18Z" />
              <path fill="#EA4335" d="M24.4 11.96c2.95 0 5.59 1.02 7.67 3.02l5.75-5.75A19.26 19.26 0 0 0 24.4 4 19.99 19.99 0 0 0 6.52 15.04l6.67 5.18c1.58-4.74 6-8.26 11.21-8.26Z" />
            </svg>
          )}
          {t(googleLoading ? "google.loading" : "google.continue")}
        </Button>
        <button className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-1 text-base leading-6 text-muted-foreground hover:text-primary" onClick={() => onChangeView(isSignup ? "signin" : "signup")} type="button">{t(isSignup ? "switch.hasAccount" : "switch.noAccount")}<span className="font-semibold text-primary underline-offset-4 hover:underline">{t(isSignup ? "signIn" : "signUp")}</span></button>
      </div>
    </section>
  );
}
