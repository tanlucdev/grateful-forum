import { loadJournalContext } from "./load-journal-context";

export async function loadShellStreak() {
  const context = await loadJournalContext();
  return context && !context.user.is_anonymous ? context.statistics.streak : 0;
}
