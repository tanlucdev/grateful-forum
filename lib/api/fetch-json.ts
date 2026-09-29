type ApiError = { code?: string; error?: string };

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
  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new ApiClientError(data.code ?? "unknown", data.error ?? fallback);
  }

  return data;
}
