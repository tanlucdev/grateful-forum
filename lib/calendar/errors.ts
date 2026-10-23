function isMissingProfilesColumn(message: string, column: string) {
  return message.includes(column) && (message.includes("schema cache") || message.includes("column"));
}

export function isMissingTimezoneColumn(message: string) {
  return isMissingProfilesColumn(message, "timezone");
}

export function isMissingCalendarTourColumn(message: string) {
  return isMissingProfilesColumn(message, "calendar_tour_seen_at");
}

export function shouldFallbackCalendarTour(error: { message: string } | null) {
  return Boolean(error && isMissingCalendarTourColumn(error.message));
}
