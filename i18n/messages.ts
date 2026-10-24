import common from "@/messages/vi/common.json";
import landing from "@/messages/vi/landing.json";
import auth from "@/messages/vi/auth.json";
import feed from "@/messages/vi/feed.json";
import calendar from "@/messages/vi/calendar.json";
import write from "@/messages/vi/write.json";
import profile from "@/messages/vi/profile.json";
import moderation from "@/messages/vi/moderation.json";
import reward from "@/messages/vi/reward.json";
import onboarding from "@/messages/vi/onboarding.json";
import enCommon from "@/messages/en/common.json";
import enLanding from "@/messages/en/landing.json";
import enAuth from "@/messages/en/auth.json";
import enFeed from "@/messages/en/feed.json";
import enCalendar from "@/messages/en/calendar.json";
import enWrite from "@/messages/en/write.json";
import enProfile from "@/messages/en/profile.json";
import enModeration from "@/messages/en/moderation.json";
import enReward from "@/messages/en/reward.json";
import enOnboarding from "@/messages/en/onboarding.json";

export const viMessages = { common, landing, auth, feed, calendar, write, profile, moderation, reward, onboarding } as const;
export const enMessages: typeof viMessages = { common: enCommon, landing: enLanding, auth: enAuth, feed: enFeed, calendar: enCalendar, write: enWrite, profile: enProfile, moderation: enModeration, reward: enReward, onboarding: enOnboarding };

export const messages = { vi: viMessages, en: enMessages } as const;
