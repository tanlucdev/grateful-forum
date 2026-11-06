"use client";

import { useTranslations } from "next-intl";
import { useNextStep } from "nextstepjs";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { profileTourName } from "@/lib/onboarding/profile-tour";
import { calendarTourName } from "@/lib/onboarding/calendar-tour";

export function OnboardingTourReplayButton({ tour }: Readonly<{ tour: "calendar" | "first-entry" | "profile" }>) {
  const t = useTranslations("onboarding");
  const { startNextStep } = useNextStep();
  const label = t(tour === "first-entry" ? "replay.firstEntry" : `replay.${tour}`);

  function replay() {
    if (tour === "profile") {
      startNextStep(profileTourName(window.matchMedia("(min-width: 768px)").matches));
      return;
    }
    startNextStep(tour === "calendar" && window.matchMedia("(min-width: 768px)").matches ? calendarTourName(true) : tour === "calendar" ? calendarTourName(false) : tour);
  }

  return (
    <button aria-label={label} className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:bottom-6 md:right-6" onClick={replay} title={label} type="button">
      <MaterialSymbol name="help" />
    </button>
  );
}
