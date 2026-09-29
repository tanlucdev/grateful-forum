export type AuthApiErrorCode = "email_rate_limit" | "email_already_registered" | "auth_failed";

const AUTH_ERROR_MAP: Array<[RegExp, AuthApiErrorCode]> = [
  [/email rate limit exceeded/i, "email_rate_limit"],
  [/user already registered/i, "email_already_registered"],
];

export function normalizeAuthErrorCode(message: string): AuthApiErrorCode {
  const match = AUTH_ERROR_MAP.find(([pattern]) => pattern.test(message));
  return match?.[1] ?? "auth_failed";
}
