const AUTH_ERROR_MAP: Array<[RegExp, string]> = [
  [/email rate limit exceeded/i, "Bạn đã yêu cầu email quá nhanh. Chờ một lát rồi thử lại."],
  [/user already registered/i, "Email này đã được dùng."],
];

export function normalizeAuthErrorMessage(message: string) {
  const match = AUTH_ERROR_MAP.find(([pattern]) => pattern.test(message));
  return match?.[1] ?? message;
}
