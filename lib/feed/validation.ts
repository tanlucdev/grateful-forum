import { z } from "zod";
import { feedReactionTypes } from "./constants.ts";

export const feedReactionSchema = z.enum(feedReactionTypes);

export const feedReactionRequestSchema = z.object({
  entryId: z.string().uuid(),
  reactionType: feedReactionSchema,
});

export const feedEntryIdQuerySchema = z.object({
  entryId: z.string().uuid(),
});

export const feedPageQuerySchema = z.object({
  cursor: z.string().trim().min(1).max(80).nullable(),
});

export type FeedReactionType = z.infer<typeof feedReactionSchema>;
