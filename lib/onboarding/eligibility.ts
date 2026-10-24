export type FirstEntryTourEligibility = {
  onboardingCompletedAt: string | null;
  tourSeenAt: string | null;
  replay: boolean;
  signedIn: boolean;
};

export function shouldStartFirstEntryTour({
  onboardingCompletedAt,
  replay,
  signedIn,
  tourSeenAt,
}: FirstEntryTourEligibility) {
  return replay || (signedIn && !tourSeenAt && !onboardingCompletedAt);
}
