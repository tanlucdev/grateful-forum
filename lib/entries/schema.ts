import { z } from "zod";
import { entryVisibilities } from "./types.ts";
import { inkDocumentSchema } from "./ink.ts";

const gratitudeSchema = z.string().trim().min(1).max(1000);

export const createEntryRequestSchema = z.object({
  visibility: z.enum(entryVisibilities),
  gratitudes: z.array(gratitudeSchema).max(10),
  reflection: z.string().trim().min(1).max(5000),
  mood: z.string().trim().min(1).max(80),
  washi: z.string().trim().min(1).max(80),
  space: z.string().trim().min(1).max(160),
  quote: z.string().trim().min(1).max(240),
  sticker: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().url().max(2048).nullable().optional(),
});

export const entryRouteParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateEntryRequestSchema = z.object({
  visibility: z.enum(entryVisibilities),
}).strict();

export type CreateEntryRequestInput = z.infer<typeof createEntryRequestSchema>;

export const createHandwrittenEntryRequestSchema = z.object({
  visibility: z.enum(entryVisibilities),
  document: inkDocumentSchema,
}).strict();
