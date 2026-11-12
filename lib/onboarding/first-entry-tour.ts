export type WritingMethod = "text" | "handwritten";
export function firstEntryTourName(method: WritingMethod) {
  return method === "handwritten" ? "first-entry-handwritten" : "first-entry";
}
export const firstEntryTourSelectors = [
  '[data-write-method="text"] [data-tour="gratitude-input"]',
  '[data-write-method="text"] [data-tour="text-extras"]',
  '[data-write-method="text"] [data-tour="write-finish"]',
] as const;
export const handwrittenTourSelectors = [
  '[data-write-method="handwritten"] [data-tour="ink-tools"]',
  '[data-write-method="handwritten"] [data-tour="ink-paper"]',
  '[data-write-method="handwritten"] [data-tour="write-finish"]',
] as const;
export function writingTourSelectors(method: WritingMethod) {
  return method === "handwritten" ? handwrittenTourSelectors : firstEntryTourSelectors;
}
export function scrollFirstEntryTourTarget(step: number, method: WritingMethod = "text") {
  const selector = writingTourSelectors(method)[step];
  // Center before NextStep measures; smooth scrolling races its viewport checks.
  if (selector) document.querySelector(selector)?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
}
export function replayFirstEntryTour(start: () => void, prepare?: () => void, method: WritingMethod = "text") {
  prepare?.();
  requestAnimationFrame(() => {
    if (writingTourSelectors(method).every((selector) => document.querySelector(selector))) start();
  });
}
