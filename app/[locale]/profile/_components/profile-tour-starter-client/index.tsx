"use client";

import { useEffect, useRef } from "react";
import { useNextStep } from "nextstepjs";
import { profileTourName, profileTourSelectors } from "@/lib/onboarding/profile-tour";

export function ProfileTourStarterClient({ userId }: Readonly<{ userId: string }>) {
  const { startNextStep } = useNextStep();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    // ponytail: device-local tracking; add server persistence if cross-device sync is needed.
    const seenKey = `onboarding:profile:${userId}:seen`;
    try {
      if (window.localStorage.getItem(seenKey) === "1") return;
    } catch {
      // Continue when browser storage is unavailable.
    }

    let frame = 0;
    let attempts = 0;
    const startWhenReady = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      if (profileTourSelectors(desktop).every((selector) => document.querySelector(selector))) {
        started.current = true;
        try {
          window.localStorage.setItem(seenKey, "1");
        } catch {
          // The guide remains available through the replay button.
        }
        startNextStep(profileTourName(desktop));
        return;
      }
      if (attempts++ < 30) frame = window.requestAnimationFrame(startWhenReady);
    };
    frame = window.requestAnimationFrame(startWhenReady);
    return () => window.cancelAnimationFrame(frame);
  }, [startNextStep, userId]);

  return null;
}
