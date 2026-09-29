import { getRequestConfig } from "next-intl/server";
import { isAppLocale, routing } from "./routing";
import { messages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const safeLocale = isAppLocale(locale) ? locale : routing.defaultLocale;

  return {
    locale: safeLocale,
    messages: messages[safeLocale],
  };
});
