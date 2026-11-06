import type { FeedPage } from "./dto.ts";

export const GUEST_FEED_LIMIT = 5;

export class FeedLoginRequiredError extends Error {
  constructor() {
    super("Sign in to read more posts.");
  }
}

export function feedAccess(signedIn: boolean, cursor?: string | null) {
  if (!signedIn && cursor) throw new FeedLoginRequiredError();
  return { pageSize: signedIn ? 8 : GUEST_FEED_LIMIT, requiresLogin: !signedIn };
}

export function toFeedPreview<T>(items: readonly T[]) {
  return { items: items.slice(0, GUEST_FEED_LIMIT), nextCursor: null, requiresLogin: true };
}

export function appendFeedPage(current: FeedPage, next: FeedPage): FeedPage {
  if (current.requiresLogin || next.requiresLogin) return toFeedPreview(current.items);
  return { ...next, items: [...current.items, ...next.items] };
}
