export function markOnboardingTourSeen() {
  return fetch("/api/onboarding/seen", {
    body: "{}",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}

export function markCalendarTourSeen() {
  return fetch("/api/onboarding/calendar/seen", {
    body: "{}",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}
