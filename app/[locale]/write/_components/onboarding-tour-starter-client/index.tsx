"use client";

import { useEffect, useRef } from "react";
import { useNextStep } from "nextstepjs";
import { firstEntryTourSelectors } from "@/lib/onboarding/first-entry-tour";

const tourSeenKey = "onboarding:first-entry:seen";

function didSeeTourOnThisDevice() {
  try {
    return window.localStorage.getItem(tourSeenKey) === "1";
  } catch {
    return false;
  }
}

function rememberTourOnThisDevice() {
  try {
    window.localStorage.setItem(tourSeenKey, "1");
  } catch {
    // The server-side seen state remains the cross-device fallback.
  }
}

export function OnboardingTourStarterClient({ replay, shouldStart }: Readonly<{ replay: boolean; shouldStart: boolean }>) {
  const { startNextStep } = useNextStep();
  const started = useRef(false);

  useEffect(() => {
    if (!shouldStart || started.current || (!replay && didSeeTourOnThisDevice())) return;

    let frame = 0;
    let attempts = 0;
    const startWhenReady = () => {
      if (firstEntryTourSelectors.every((selector) => document.querySelector(selector))) {
        started.current = true;
        if (!replay) rememberTourOnThisDevice();
        startNextStep("first-entry");
        const url = new URL(window.location.href);
        url.searchParams.delete("tour");
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
        return;
      }
      if (attempts++ < 30) frame = window.requestAnimationFrame(startWhenReady);
    };

    frame = window.requestAnimationFrame(startWhenReady);
    return () => window.cancelAnimationFrame(frame);
  }, [replay, shouldStart, startNextStep]);

  return null;
}
