# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js App Router, TypeScript, Tailwind, Supabase; inferred from the explicit implementation brief

## Users

People joining a mobile-first gratitude community. They can read gratitude posts from others, write their own, share publicly or anonymously, and keep private entries for later review.

## Product Purpose

Help people practice and spread gratitude through a community where daily gratitude entries can encourage others, while private writing and personal history remain first-class.

## Positioning

A gratitude community that combines public feed discovery, daily writing, optional anonymous sharing, private journaling, and account-backed history in one flow.

## Operating Context

Mobile web first. Users write short entries, choose visibility, browse a feed, edit profiles, and report content.

## Capabilities and Constraints

- Gratitude entries can be public, anonymous, or account-linked.
- Guests can preview up to five real public entries without pagination. Writing (text, handwriting, images) requires a verified session for a non-anonymous account.
- Existing guest entries still migrate to an account after authentication; no new guest entries are created.
- Supabase is the backend foundation.
- MVP must support moderation, profile pages, and responsive navigation.

## Brand Commitments

Product name: Grateful Forum.

## Evidence on Hand

Only the user brief and repository scaffold. No existing content, assets, or claims to preserve beyond the requested product scope.

## Product Principles

- Keep writing fast.
- Treat privacy as a first-class choice.
- Make public sharing optional, not forced, while making community discovery welcoming.
- Preserve legacy guest work through signup. Keep in-progress writing and selected images on session expiry; sign in in a separate tab and retry.

## Accessibility & Inclusion

Mobile-friendly, keyboard-safe, and readable in preview without an account; writing requires sign-in.
