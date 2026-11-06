export function profileTourName(desktop: boolean) {
  return desktop ? "profile-desktop" : "profile-mobile";
}

export function profileTourSelectors(desktop: boolean) {
  const prefix = profileTourName(desktop);
  return ["edit", "rhythm", "entries"].map((target) => `[data-tour="${prefix}-${target}"]`);
}

export function scrollProfileTourTarget(step: number, desktop: boolean) {
  const selector = profileTourSelectors(desktop)[step];
  if (selector) document.querySelector(selector)?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
}
