type ApiError = { error?: string };

export async function fetchJson<T>(input: RequestInfo | URL, init: RequestInit, fallback: string) {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.error ?? fallback);
  }

  return data;
}
