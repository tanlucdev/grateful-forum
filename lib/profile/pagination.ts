import { z } from "zod";

export const journalCursorSchema = z.object({ time: z.iso.datetime({ offset: true }), id: z.uuid(), backwards: z.boolean() });
export type JournalCursor = z.infer<typeof journalCursorSchema>;
const cursorString = z.string().max(300).transform((value, context) => {
  try { return JSON.parse(value) as unknown; }
  catch { context.addIssue({ code: "custom", message: "invalid_cursor" }); return z.NEVER; }
}).pipe(journalCursorSchema);
export const profileQuerySchema = z.object({
  tab: z.enum(["all", "public", "moments"]).default("all"),
  cursor: cursorString.optional(),
  layout: z.enum(["grid", "journal", "list"]).optional(),
  entry: z.uuid().optional(),
  edge: z.enum(["first", "last"]).optional(),
});
export type ProfileQuery = z.infer<typeof profileQuerySchema>;
export type JournalPagination = { previous: JournalCursor | null; next: JournalCursor | null; total: number; start: number };

export function journalPageHref(path: string, search: string, cursor: JournalCursor, edge?: "last") {
  const params = new URLSearchParams(search);
  params.delete("entry"); params.delete("edge");
  params.set("cursor", JSON.stringify(cursor));
  if (edge) params.set("edge", edge);
  return `${path}?${params}`;
}
