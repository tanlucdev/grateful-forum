export type EntrySaveOutcome =
  | "text-synced"
  | "text-local"
  | "text-saved-without-image"
  | "handwriting-synced"
  | "handwriting-local";

export type EntrySaveFeedback = {
  tone: "success" | "warning";
  messageKey: `toast.${string}`;
};

export function getEntrySaveFeedback(outcome: EntrySaveOutcome): EntrySaveFeedback {
  const feedback: Record<EntrySaveOutcome, EntrySaveFeedback> = {
    "text-synced": { tone: "success", messageKey: "toast.textSaved" },
    "text-local": { tone: "success", messageKey: "toast.textSavedLocal" },
    "text-saved-without-image": { tone: "warning", messageKey: "toast.textSavedWithoutImage" },
    "handwriting-synced": { tone: "success", messageKey: "toast.handwritingSaved" },
    "handwriting-local": { tone: "success", messageKey: "toast.handwritingSavedLocal" },
  };
  return feedback[outcome];
}
