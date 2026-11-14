"use client";

import { useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { motionDuration, motionEaseOut } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { markCalendarTourSeen, markOnboardingTourSeen } from "@/lib/api/onboarding";
import { profileTourName, profileTourSelectors, scrollProfileTourTarget } from "@/lib/onboarding/profile-tour";
import { firstEntryTourName, writingTourSelectors, scrollFirstEntryTourTarget } from "@/lib/onboarding/first-entry-tour";
import {
  NextStep,
  useNextStep,
  type CardComponentProps,
  type Tour,
} from "nextstepjs";

function WriteTourCard({ arrow, currentStep, nextStep, prevStep, skipTour, step, totalSteps }: Readonly<CardComponentProps>) {
  const t = useTranslations("onboarding");
  if (!step) return null;
  return <section aria-label={t("card.label")} className="relative w-[min(21rem,calc(100vw-1.5rem))] rounded-xl border border-primary/15 bg-card p-4 text-sm text-foreground shadow-xl">
    {arrow}
    <div className="flex items-center gap-2"><Image alt="" src="/stitch/profile/mascot.jpg" width={32} height={32} className="size-8 shrink-0 rounded-full object-cover" /><p className="font-bold text-primary">{t("card.progress", { current: currentStep + 1, total: totalSteps })}</p></div>
    <h2 className="mt-2 text-base font-bold">{step.title}</h2>
    <div className="mt-2 leading-5 text-muted-foreground">{step.content}</div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-1">
      <Button variant="ghost" disabled={currentStep === 0} onClick={prevStep} type="button">{t("card.back")}</Button>
      <Button variant="ghost" onClick={skipTour} type="button">{t("card.skip")}</Button>
      <Button onClick={nextStep} type="button">{t("card.next")}</Button>
    </div>
  </section>;
}

export function OnboardingTours() {
  const t = useTranslations("onboarding");
  const { currentTour } = useNextStep();
  const reducedMotion = useReducedMotion();
  const firstEntry = currentTour === "first-entry" || currentTour === "first-entry-handwritten";
  const returnFocus = useRef<HTMLElement | null>(null);
  const profile = currentTour === "profile-desktop" || currentTour === "profile-mobile";
  const startTour = useCallback((tourName: string | null) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (tourName === "first-entry" || tourName === "first-entry-handwritten") scrollFirstEntryTourTarget(0, tourName === "first-entry" ? "text" : "handwritten");
    if (tourName === "profile-desktop" || tourName === "profile-mobile") scrollProfileTourTarget(0, tourName === "profile-desktop");
    recordSeen(tourName);
  }, []);
  const steps = useMemo<Tour[]>(() => [
    ...(["text", "handwritten"] as const).map((method): Tour => ({
      tour: firstEntryTourName(method),
      steps: ([0, 1, 2] as const).map((index) => ({
        content: t(`writing.${method}.${(["step1", "step2", "step3"] as const)[index]}.content`),
        title: t(`writing.${method}.${(["step1", "step2", "step3"] as const)[index]}.title`),
        selector: writingTourSelectors(method)[index],
        pointerPadding: 8, pointerRadius: 16, selectorRetryAttempts: 20, selectorRetryDelay: 100,
        side: index === 0 ? "bottom" : "top",
      })),
    })),
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
    ...[true, false].map((desktop): Tour => ({
      tour: profileTourName(desktop),
      steps: (["edit", "rhythm", "entries"] as const).map((target, index) => ({
        content: t(`profile.${target}.content`),
        pointerPadding: desktop ? 12 : 8,
        pointerRadius: 16,
        scrollOffset: 112,
        selector: profileTourSelectors(desktop)[index],
        selectorRetryAttempts: 20,
        selectorRetryDelay: 100,
        side: index === 0 ? "bottom-right" : "top",
        title: t(`profile.${target}.title`),
      })),
    })),
  ], [t]);

  function finishTour(tourName: string | null) {
    recordSeen(tourName);
    requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLElement>('[data-write-method="text"] [data-tour="gratitude-input"], [data-write-method="handwritten"] [data-tour="ink-paper"] [tabindex]');
      (returnFocus.current?.isConnected ? returnFocus.current : fallback)?.focus({ preventScroll: true });
    });
  }
  return (
      <NextStep
        cardComponent={WriteTourCard}
        cardTransition={{ duration: reducedMotion ? 0 : motionDuration.enter, ease: [...motionEaseOut] }}
        clickThroughOverlay={false}
        disableConsoleLogs
        noInViewScroll={firstEntry || profile}
        onComplete={finishTour}
        onStart={startTour}
        onStepChange={(step, tourName) => {
          if (tourName === "first-entry" || tourName === "first-entry-handwritten") scrollFirstEntryTourTarget(step, tourName === "first-entry" ? "text" : "handwritten");
          if (tourName === "profile-desktop" || tourName === "profile-mobile") scrollProfileTourTarget(step, tourName === "profile-desktop");
        }}
        onSkip={(_, tourName) => finishTour(tourName)}
        overlayZIndex={2000}
        scrollToTop={!firstEntry && !profile}
        shadowOpacity="0.48"
        steps={steps}
      >
        {null}
      </NextStep>
  );
}

function recordSeen(tourName: string | null) {
  if (tourName === "first-entry" || tourName === "first-entry-handwritten") void markOnboardingTourSeen();
  if (tourName === "calendar-desktop" || tourName === "calendar-mobile") void markCalendarTourSeen();
}
