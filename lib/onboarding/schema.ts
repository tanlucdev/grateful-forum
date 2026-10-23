import { z } from "zod";

export const firstEntryTourSearchSchema = z.object({
  tour: z.literal("first-entry").optional(),
}).passthrough();

export const markOnboardingTourSeenSchema = z.object({}).strict();
export const markCalendarTourSeenSchema = z.object({}).strict();
