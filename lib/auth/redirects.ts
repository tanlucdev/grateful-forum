const locales = ["vi", "en"] as const;

export function safeAuthRedirect(value: string | null | undefined, fallback = "/feed") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function withLocalePath(path: string, locale: string) {
  const safePath = safeAuthRedirect(path);
  const firstSegment = safePath.split(/[/?#]/)[1];
  return locales.includes(firstSegment as (typeof locales)[number]) ? safePath : `/${locale}${safePath}`;
}

export function safeLocalizedAuthRedirect(value: string | null | undefined, locale: string, fallback = "/feed") {
  return withLocalePath(safeAuthRedirect(value, fallback), locale);
}

export function loginHref(next: string, locale?: string) {
  const safeNext = locale ? withLocalePath(next, locale) : safeAuthRedirect(next);
  return `/auth?next=${encodeURIComponent(safeNext)}`;
}

export function localizedLoginHref(next: string, locale: string) {
  return withLocalePath(loginHref(next, locale), locale);
}
