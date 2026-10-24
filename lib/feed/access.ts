export class FeedLoginRequiredError extends Error {
  constructor() {
    super("Sign in to read more posts.");
  }
}

export function feedAccess(signedIn: boolean, cursor?: string | null) {
  if (!signedIn && cursor) throw new FeedLoginRequiredError();
  return { pageSize: signedIn ? 8 : 5, requiresLogin: !signedIn };
}
