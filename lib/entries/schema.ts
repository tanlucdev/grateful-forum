import { z } from "zod";
import { entryVisibilities } from "./types.ts";

const gratitudeSchema = z.string().trim().min(1).max(1000);

export const createEntryRequestSchema = z.object({
  visibility: z.enum(entryVisibilities),
  gratitudes: z.array(gratitudeSchema).length(3),
  reflection: z.string().trim().min(1).max(5000),
  mood: z.string().trim().min(1).max(80),
  washi: z.string().trim().min(1).max(80),
  space: z.string().trim().min(1).max(160),
  quote: z.string().trim().min(1).max(240),
  sticker: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().url().max(2048).nullable().optional(),
});

export type CreateEntryRequestInput = z.infer<typeof createEntryRequestSchema>;
