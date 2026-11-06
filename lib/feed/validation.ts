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
  visibility: z.enum(["all", "anonymous", "public"]).default("all"),
});

export type FeedVisibilityFilter = "all" | "anonymous" | "public";

export type FeedReactionType = z.infer<typeof feedReactionSchema>;
