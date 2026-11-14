import { z } from "zod";
import { soulTitles } from "./soul-titles.ts";

export const updateProfileSchema = z.object({
  displayName: z.string().trim().max(120).default(""),
  username: z.string().trim().toLowerCase().regex(/^$|^[a-z0-9_]{3,24}$/).default(""),
  avatarUrl: z.string().trim().max(2048).refine((value) => !value || value.startsWith("/") && !value.startsWith("//") || /^https?:\/\//i.test(value)).default(""),
  bio: z.string().trim().max(120).default(""),
  soulTitle: z.enum(soulTitles).optional(),
});
