import { z } from "zod";
import { entryVisibilities } from "./types.ts";
import { inkDocumentSchema } from "./ink.ts";

const gratitudeSchema = z.string().trim().min(1).max(1000);

export const createEntryRequestSchema = z.object({
  visibility: z.enum(entryVisibilities),
  gratitudes: z.array(gratitudeSchema).min(1).max(10),
  reflection: z.string().trim().max(5000).optional().nullable(),
  mood: z.string().trim().max(80).optional().nullable(),
  washi: z.string().trim().max(80).optional().nullable(),
  space: z.string().trim().max(160).optional().nullable(),
  quote: z.string().trim().max(240).optional().nullable(),
  sticker: z.string().trim().max(120).optional().nullable(),
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
