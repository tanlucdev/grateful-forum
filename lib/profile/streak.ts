function dayKey(value: string) {
  return value.slice(0, 10);
}

export function getStreak(dates: string[]) {
  const uniqueDates = [...new Set(dates.map(dayKey))].sort().reverse();

  if (uniqueDates.length === 0) {
    return 0;
  }

  const today = dayKey(new Date().toISOString());
  let current = today;
  let streak = 0;

  for (const date of uniqueDates) {
    if (date !== current) {
      break;
    }

    streak += 1;
    const expected = new Date(`${current}T00:00:00Z`);
    expected.setUTCDate(expected.getUTCDate() - 1);
    current = expected.toISOString().slice(0, 10);
  }

  return streak;
}
