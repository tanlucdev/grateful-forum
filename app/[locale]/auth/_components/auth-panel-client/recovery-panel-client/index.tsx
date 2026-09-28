"use client";

import { ArrowLeft, ArrowRight, Heart, Info, Leaf, Loader2, Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { AuthFieldErrors } from "@/lib/auth/validation";
import { AuthField } from "../auth-field";
import type { AuthBanner, AuthView } from "../types";

export function RecoveryPanelClient({
  banner,
  configured,
  email,
  emailError,
  loading,
  onChangeView,
  onClearEmailError,
  onDismissBanner,
  onEmailChange,
  onSubmit,
  resetSent,
}: Readonly<{
  banner: AuthBanner | null;
  configured: boolean;
  email: string;
  emailError?: AuthFieldErrors["email"];
  loading: boolean;
  onChangeView: (view: AuthView) => void;
  onClearEmailError: () => void;
  onDismissBanner: () => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  resetSent: boolean;
}>) {
  const t = useTranslations("auth");

  return (
    <section className="w-full max-w-[400px] font-[family-name:var(--font-quicksand)]">
      <div className="mb-3 flex items-center justify-between">
        <Button aria-label={t("a11y.backToSignIn")} className="rounded-full bg-card/80 text-primary shadow-sm" onClick={() => onChangeView("signin")} size="icon" type="button" variant="outline"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm backdrop-blur"><Heart className="h-3.5 w-3.5 fill-current text-primary" /> {t("care")}</div>
        <span className="h-10 w-10" />
      </div>
      <div className="rounded-[28px] bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 scale-105 rounded-full bg-accent/40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-inner"><Leaf className="h-10 w-10 text-primary" fill="currentColor" /></div>
            <div className="absolute top-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-primary shadow-sm"><Info className="h-3 w-3" /></div>
          </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">{t("productName")}</p>
          <h1 className="mt-1 text-[24px] leading-8 font-bold text-foreground">{t("recoveryPanel.heading")}</h1>
          <p className="mt-2 text-[16px] leading-6 text-muted-foreground">{t("recoveryPanel.description")}</p>
        </div>
        <form className="mt-6 flex flex-col gap-4" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <AuthField disabled={!configured || loading} error={emailError} id="recovery-email" inputMode="email" label={t("labels.recoveryEmail")} onChange={(value) => { onEmailChange(value); onClearEmailError(); }} placeholder={t("placeholders.recoveryEmail")} type="email" value={email} />
          <div className="rounded-xl bg-accent/30 p-3"><p className="text-[11px] leading-4 font-medium text-muted-foreground">{t("recoveryPanel.securityNote")}</p></div>
          <Button className="mt-1 w-full shadow-sm disabled:shadow-none" disabled={!configured || loading || !email.trim()} size="lg" type="submit"><span>{loading ? t("loading.recovery") : t("recovery")}</span>{loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowRight className="h-[18px] w-[18px]" />}</Button>
        </form>
        {resetSent ? <div className="mt-4 rounded-xl bg-accent/40 p-3.5 text-center"><div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary"><Mail className="h-[18px] w-[18px]" /></div><p className="text-[12px] font-semibold text-primary">{t("recoveryPanel.successTitle")}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{t("recoveryPanel.successDescription")}</p></div> : null}
        {banner?.tone === "error" ? <div className="relative mt-4 rounded-xl bg-destructive/5 p-3 text-destructive" role="alert"><p className="text-sm font-semibold">{banner.title}</p><p className="mt-0.5 text-sm">{banner.body}</p><button aria-label={t("a11y.dismissBanner")} className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center" onClick={onDismissBanner} type="button"><X className="h-4 w-4" /></button></div> : null}
        <div className="mt-5 rounded-xl bg-muted/70 p-3 text-center"><p className="text-[11px] leading-4 text-muted-foreground">{t("recoveryPanel.spamNote")}</p></div>
        <div className="mt-5 text-center"><p className="text-[12px] leading-4 text-muted-foreground">{t("recoveryPanel.remembered")}<button className="ml-1 font-semibold text-primary hover:underline" onClick={() => onChangeView("signin")} type="button">{t("recoveryPanel.signInNow")}</button></p></div>
        <div className="mt-6 flex justify-center"><div className="h-1 w-24 rounded-full bg-input" /></div>
      </div>
    </section>
  );
}
