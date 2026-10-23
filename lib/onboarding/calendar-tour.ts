export const calendarTourSeenKey = "onboarding:calendar:seen";

export const calendarTourSelectors = {
  desktop: [
    '[data-tour="calendar-desktop-filter"]',
    '[data-tour="calendar-desktop-garden"]',
    '[data-tour="calendar-desktop-month"]',
    '[data-tour="calendar-desktop-moments"]',
  ],
  mobile: [
    '[data-tour="calendar-mobile-filter"]',
    '[data-tour="calendar-mobile-garden"]',
    '[data-tour="calendar-mobile-month"]',
    '[data-tour="calendar-mobile-moments"]',
  ],
} as const;

export function calendarTourName(isDesktop: boolean) {
  return isDesktop ? "calendar-desktop" : "calendar-mobile";
}

export function shouldStartCalendarTour({ hasLocalSeen, tourSeenAt }: Readonly<{ hasLocalSeen: boolean; tourSeenAt: string | null }>) {
  return !hasLocalSeen && !tourSeenAt;
}
