export const firstEntryTourSelectors = [
  '[data-tour="gratitude-input"]',
  '[data-tour="visibility"]',
  '[data-tour="save"]',
] as const;

export function scrollFirstEntryTourTarget(step: number) {
  const selector = firstEntryTourSelectors[step];
  // Center before NextStep measures; smooth scrolling races its viewport checks.
  if (selector) document.querySelector(selector)?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
}
