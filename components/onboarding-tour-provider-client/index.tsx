"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { NextStepProvider, useNextStep } from "nextstepjs";

const TourEngine = dynamic(() => import("./tour-engine").then((module) => module.OnboardingTours), { ssr: false });

export function OnboardingTourProviderClient({ children }: Readonly<{ children: ReactNode }>) {
  return <NextStepProvider>{children}<ActiveTour /></NextStepProvider>;
}

function ActiveTour() {
  const { currentTour } = useNextStep();
  return currentTour ? <TourEngine /> : null;
}
