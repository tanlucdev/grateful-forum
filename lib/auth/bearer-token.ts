import { z } from "zod";

const bearerTokenSchema = z
  .string()
  .trim()
  .regex(/^Bearer\s+\S+$/i)
  .transform((value) => value.replace(/^Bearer\s+/i, ""));

export function parseBearerToken(header: string | null) {
  if (!header) {
    return { ok: true as const, token: null };
  }

  const parsed = bearerTokenSchema.safeParse(header);

  if (!parsed.success) {
    return { ok: false as const, token: null };
  }

  return { ok: true as const, token: parsed.data };
}
