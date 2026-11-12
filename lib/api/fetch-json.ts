import { z } from "zod";

const apiErrorSchema = z.object({ code: z.string().optional(), error: z.string().optional() });

export class ApiClientError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
  }
}

export async function fetchJson<T>(input: RequestInfo | URL, init: RequestInit, fallback: string) {
  const response = await fetch(input, init);
  if (!response.ok) {
    const result = apiErrorSchema.safeParse(await response.json().catch(() => null));
    throw new ApiClientError(result.data?.code ?? "unknown", result.data?.error ?? fallback);
  }

  return (await response.json()) as T;
}
