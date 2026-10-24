"use client";

import { useEffect, useRef } from "react";
import { useNextStep } from "nextstepjs";
import { calendarTourName, calendarTourSeenKey, calendarTourSelectors, shouldStartCalendarTour } from "@/lib/onboarding/calendar-tour";

function hasLocalCalendarTourSeen() {
  try {
    return window.localStorage.getItem(calendarTourSeenKey) === "1";
  } catch {
    return false;
  }
}

function rememberCalendarTour() {
  try {
    window.localStorage.setItem(calendarTourSeenKey, "1");
  } catch {
    // Server state remains the cross-device fallback.
  }
}

export function CalendarTourStarterClient({ tourSeenAt }: Readonly<{ tourSeenAt: string | null }>) {
  const { startNextStep } = useNextStep();
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !shouldStartCalendarTour({ hasLocalSeen: hasLocalCalendarTourSeen(), tourSeenAt })) return;

    let frame = 0;
    let attempts = 0;
    const startWhenReady = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const selectors = calendarTourSelectors[desktop ? "desktop" : "mobile"];
      if (selectors.every((selector) => document.querySelector(selector))) {
        started.current = true;
        rememberCalendarTour();
        startNextStep(calendarTourName(desktop));
        return;
      }
      if (attempts++ < 30) frame = window.requestAnimationFrame(startWhenReady);
    };

    frame = window.requestAnimationFrame(startWhenReady);
    return () => window.cancelAnimationFrame(frame);
  }, [startNextStep, tourSeenAt]);

  return null;
}
