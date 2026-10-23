"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { markCalendarTourSeen, markOnboardingTourSeen } from "@/lib/api/onboarding";
import {
  NextStep,
  NextStepProvider,
  type CardComponentProps,
  type Tour,
} from "nextstepjs";

function FirstEntryTourCard({
  arrow,
  currentStep,
  nextStep,
  prevStep,
  skipTour,
  step,
  totalSteps,
}: Readonly<CardComponentProps>) {
  const t = useTranslations("onboarding");
  const atStart = currentStep === 0;

  return (
    <section
      aria-label={t("card.label")}
      className="relative w-[min(17.5rem,calc(100vw-1.5rem))] rounded-xl border border-primary/15 bg-card px-5 py-3.5 text-foreground shadow-xl"
    >
      {arrow}
      <p className="origin-left scale-75 text-xs font-bold tracking-wide text-primary">
        {t("card.progress", { current: currentStep + 1, total: totalSteps })}
      </p>
      <h2 className="mt-1.5 text-sm font-bold">{step.title}</h2>
      <div className="mt-1.5 text-xs leading-4 text-muted-foreground">{step.content}</div>
      <div className="mt-3 flex items-center justify-between gap-1">
        <button
          className="relative min-h-9 shrink-0 rounded-lg border border-border bg-card/80 px-3 text-xs font-semibold text-muted-foreground before:absolute before:-inset-x-1 before:-inset-y-1.5 disabled:opacity-40"
          disabled={atStart}
          onClick={prevStep}
          type="button"
        >
          <span className="block scale-75 whitespace-nowrap leading-none">{t("card.back")}</span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            className="relative min-h-9 shrink-0 rounded-lg border border-border bg-card/80 px-3 text-xs font-semibold text-muted-foreground before:absolute before:-inset-x-1 before:-inset-y-1.5"
            onClick={skipTour}
            type="button"
          >
            <span className="block scale-75 whitespace-nowrap leading-none">{t("card.skip")}</span>
          </button>
          <button
            className="relative min-h-9 shrink-0 rounded-lg border border-primary-foreground/40 bg-primary px-4 text-xs font-bold text-primary-foreground before:absolute before:-inset-x-1 before:-inset-y-1.5"
            onClick={nextStep}
            type="button"
          >
            <span className="block scale-75 whitespace-nowrap leading-none">{t("card.next")}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export function OnboardingTourProviderClient({ children }: Readonly<{ children: ReactNode }>) {
  const t = useTranslations("onboarding");
  const steps = useMemo<Tour[]>(() => [
    {
      tour: "first-entry",
      steps: [
        {
          content: t("firstEntry.gratitude.content"),
          pointerPadding: 12,
          pointerRadius: 16,
          selector: '[data-tour="gratitude-input"]',
          selectorRetryAttempts: 20,
          selectorRetryDelay: 100,
          side: "bottom",
          title: t("firstEntry.gratitude.title"),
        },
        {
          content: t("firstEntry.visibility.content"),
          pointerPadding: 12,
          pointerRadius: 16,
          selector: '[data-tour="visibility"]',
          selectorRetryAttempts: 20,
          selectorRetryDelay: 100,
          side: "top",
          title: t("firstEntry.visibility.title"),
        },
        {
          content: t("firstEntry.save.content"),
          pointerPadding: 12,
          pointerRadius: 16,
          selector: '[data-tour="save"]',
          selectorRetryAttempts: 20,
          selectorRetryDelay: 100,
          side: "bottom",
          title: t("firstEntry.save.title"),
        },
      ],
    },
    {
      tour: "calendar-desktop",
      steps: [
        { content: t("calendar.desktop.filter.content"), pointerPadding: 12, pointerRadius: 16, scrollOffset: 112, selector: '[data-tour="calendar-desktop-filter"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "bottom", title: t("calendar.desktop.filter.title") },
        { content: t("calendar.desktop.garden.content"), pointerPadding: 12, pointerRadius: 16, scrollOffset: 112, selector: '[data-tour="calendar-desktop-garden"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "bottom", title: t("calendar.desktop.garden.title") },
        { content: t("calendar.desktop.month.content"), pointerPadding: 12, pointerRadius: 16, scrollOffset: 112, selector: '[data-tour="calendar-desktop-month"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "top", title: t("calendar.desktop.month.title") },
        { content: t("calendar.desktop.moments.content"), pointerPadding: 12, pointerRadius: 16, scrollOffset: 112, selector: '[data-tour="calendar-desktop-moments"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "left", title: t("calendar.desktop.moments.title") },
      ],
    },
    {
      tour: "calendar-mobile",
      steps: [
        { content: t("calendar.mobile.filter.content"), pointerPadding: 10, pointerRadius: 16, selector: '[data-tour="calendar-mobile-filter"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "bottom", title: t("calendar.mobile.filter.title") },
        { content: t("calendar.mobile.garden.content"), pointerPadding: 10, pointerRadius: 20, selector: '[data-tour="calendar-mobile-garden"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "bottom", title: t("calendar.mobile.garden.title") },
        { content: t("calendar.mobile.month.content"), pointerPadding: 10, pointerRadius: 20, selector: '[data-tour="calendar-mobile-month"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "top", title: t("calendar.mobile.month.title") },
        { content: t("calendar.mobile.moments.content"), pointerPadding: 10, pointerRadius: 20, selector: '[data-tour="calendar-mobile-moments"]', selectorRetryAttempts: 20, selectorRetryDelay: 100, side: "top", title: t("calendar.mobile.moments.title") },
      ],
    },
  ], [t]);

  function recordSeen(tourName: string | null) {
    if (tourName === "first-entry") void markOnboardingTourSeen();
    if (tourName === "calendar-desktop" || tourName === "calendar-mobile") void markCalendarTourSeen();
  }

  return (
    <NextStepProvider>
      <NextStep
        cardComponent={FirstEntryTourCard}
        clickThroughOverlay={false}
        disableConsoleLogs
        onComplete={recordSeen}
        onStart={recordSeen}
        onSkip={(_, tourName) => recordSeen(tourName)}
        overlayZIndex={2000}
        shadowOpacity="0.48"
        steps={steps}
      >
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
