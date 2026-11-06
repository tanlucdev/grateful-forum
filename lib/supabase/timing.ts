import { cache } from "react";

const requestMetrics = cache(() => ({ id: crypto.randomUUID(), queries: 0 }));

// Only operation names and numeric metrics; never headers, query values or bodies.
export const timedSupabaseFetch: typeof fetch = async (input, init) => {
  if (process.env.GRATEFUL_TIMING !== "1") return fetch(input, init);
  const metrics = requestMetrics();
  const url = new URL(input instanceof Request ? input.url : String(input));
  const operation = url.pathname.replace(/\/[0-9a-f-]{36}(?=\/|$)/gi, "/id");
  const started = performance.now();
  const query = ++metrics.queries;
  const response = await fetch(input, init);
  const bytes = (await response.clone().arrayBuffer()).byteLength;
  console.info(JSON.stringify({ timing: "supabase", request: metrics.id, query, operation, ms: performance.now() - started, bytes, status: response.status }));
  return response;
};

export async function timeLoader<T>(operation: string, run: () => Promise<T>): Promise<T> {
  if (process.env.GRATEFUL_TIMING !== "1") return run();
  const started = performance.now();
  try { return await run(); }
  finally { console.info(JSON.stringify({ timing: "loader", request: requestMetrics().id, operation, ms: performance.now() - started })); }
}

export function recordRenderTiming(operation: string, started: number, payload: unknown) {
  if (process.env.GRATEFUL_TIMING !== "1") return;
  const metrics = requestMetrics();
  console.info(JSON.stringify({ timing: "render.prepare", request: metrics.id, operation, ms: performance.now() - started, queriesStarted: metrics.queries, payloadBytes: Buffer.byteLength(JSON.stringify(payload)) }));
}

export function startRenderTiming() { return process.env.GRATEFUL_TIMING === "1" ? performance.now() : 0; }
