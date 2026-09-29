import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "vi",
  localePrefix: "always",
  locales: ["vi", "en"],
});

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string | undefined): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}
