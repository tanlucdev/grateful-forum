"use client";

import { useTranslations } from "next-intl";
import { useNextStep } from "nextstepjs";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { profileTourName } from "@/lib/onboarding/profile-tour";
import { replayFirstEntryTour, firstEntryTourName, type WritingMethod } from "@/lib/onboarding/first-entry-tour";
import { calendarTourName } from "@/lib/onboarding/calendar-tour";

export function OnboardingTourReplayButton({ tour, writeMethod = "text", inline = false, disabled = false, onBeforeReplay }: Readonly<{ disabled?: boolean; writeMethod?: WritingMethod; onBeforeReplay?: () => void; inline?: boolean; tour: "calendar" | "first-entry" | "profile" }>) {
  const t = useTranslations("onboarding");
  const { startNextStep } = useNextStep();
  const label = t(tour === "first-entry" ? "replay.firstEntry" : `replay.${tour}`);

  function replay() {
    if (tour === "first-entry") {
      replayFirstEntryTour(() => startNextStep(firstEntryTourName(writeMethod)), onBeforeReplay, writeMethod);
      return;
    }
    if (tour === "profile") {
      startNextStep(profileTourName(window.matchMedia("(min-width: 768px)").matches));
      return;
    }
    startNextStep(tour === "calendar" && window.matchMedia("(min-width: 768px)").matches ? calendarTourName(true) : tour === "calendar" ? calendarTourName(false) : tour);
  }

  return (
    <button disabled={disabled} aria-label={label} className={inline ? "flex min-h-11 min-w-11 items-center justify-center rounded-xl text-primary disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring" : "fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform disabled:opacity-40 enabled:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:bottom-6 md:right-6"} onClick={replay} title={label} type="button">
      <MaterialSymbol name="help" />
    </button>
  );
}
