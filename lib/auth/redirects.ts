export function safeAuthRedirect(value: string | null | undefined, fallback = "/feed") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function loginHref(next: string) {
  return `/auth?next=${encodeURIComponent(safeAuthRedirect(next))}`;
}
