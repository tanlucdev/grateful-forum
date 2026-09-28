import type { viMessages } from "@/i18n/messages";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof viMessages;
  }
}
