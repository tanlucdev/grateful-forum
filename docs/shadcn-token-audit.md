# Shadcn Token Cleanup Audit

Status: follow-up needed.

## Context

The app now has real shadcn setup:

- `components.json`
- `lib/utils.ts`
- shadcn primitives in `components/ui`
- semantic tokens in `app/globals.css`

Important: the previous session did not finish converting the whole app away from hard-coded colors. `/feed` was cleaned after a recheck, but many other routes still need audit.

## Goal

Replace app UI hard-coded colors with semantic Tailwind/shadcn token classes:

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `bg-popover`
- `text-popover-foreground`
- `bg-primary`
- `text-primary`
- `text-primary-foreground`
- `bg-secondary`
- `text-secondary-foreground`
- `bg-muted`
- `text-muted-foreground`
- `bg-accent`
- `text-accent-foreground`
- `text-destructive`
- `border-border`
- `border-input`
- `ring-ring`

App-specific CSS variables allowed when semantic tokens are too broad:

- `var(--surface-low)`
- `var(--surface-high)`
- `var(--leaf-deep)`
- `var(--fire)`
- `var(--fire-soft)`

## Current Known Good

`/feed` route was tokenized and visually checked:

- `app/feed/_components/feed-cards/index.tsx`
- `app/feed/_components/feed-shell/index.tsx`
- `app/feed/_components/feed-actions-client/index.tsx`
- `app/feed/_components/public-feed-client/index.tsx`
- `app/feed/_components/feed-data.ts`
- `app/feed/loading.tsx`

Allowed remaining `/feed` false positives:

- `text-[11px]`, `text-[14px]`, etc. are font sizes, not colors.
- `bg-black/40 text-white` on photo caption overlay is intentional image readability overlay.
- `bg-[var(--fire-soft)]`, `text-[var(--fire)]` are allowed app-specific tokens.
- `[clip-path:...]` is shape, not color.

## Recheck Commands

Find hard-coded colors in app/components:

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgba\\(|rgb\\(|bg-\\[|text-\\[|border-\\[|ring-\\[|shadow-\\[" app components -g '*.tsx'
```

Ignore font-size false positives with this narrower color-focused scan:

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgba\\(|rgb\\(|bg-\\[#|text-\\[#|border-\\[#|ring-\\[#|shadow-\\[" app components -g '*.tsx'
```

Check route by route:

```bash
for dir in app/write app/calendar app/profile app/auth app/moderation app/_components/landing components/navigation components/moderation; do
  echo "== $dir =="
  rg -n "#[0-9a-fA-F]{3,8}|rgba\\(|rgb\\(|bg-\\[#|text-\\[#|border-\\[#|ring-\\[#|shadow-\\[" "$dir" -g '*.tsx' || true
done
```

Verify no accidental invalid Tailwind classes after mechanical replacement:

```bash
rg -n "bg-muted0|text-muted0|border-muted0|bg-primary0|text-primary0" app components -g '*.tsx'
```

## Remaining Hot Spots

Likely still has hard-coded color classes:

- `app/write/_components/sticker-picker/index.tsx`
- `app/write/_components/sticker-quote-picker/index.tsx`
- `app/write/_components/composer-ui/index.tsx`
- `app/write/_components/composer-right-rail/index.tsx`
- `app/calendar/_components/*`
- `app/profile/_components/*`
- `app/auth/_components/auth-panel-client/index.tsx`
- `app/moderation/_components/moderation-queue-client/index.tsx`
- `app/moderation/page.tsx`
- `app/_components/landing/*`
- `components/navigation/navigation-header/index.tsx`

Landing may keep more visual flavor, but should still use token-backed classes where possible.

## Cleanup Rules

Do not replace blindly:

- Dynamic swatches from data, e.g. washi/sticker color values, can stay inline.
- Photo overlays may use neutral overlays such as `bg-black/40` when needed for readability.
- Typography arbitrary classes such as `text-[11px]` are okay.
- Shape arbitrary classes such as `[clip-path:...]` are okay.
- Asset-driven gradients may stay only if they are moved into token-backed CSS or clearly local to visual art.

Prefer:

- `Button`, `Input`, `Textarea`, `Dialog`, `DropdownMenu`, `Tabs`, `Badge`, `Label`, `Skeleton`, `Card`
- Token classes over hex/rgb
- Editing `components/ui/button.tsx` variants over creating one-off buttons

Avoid:

- new hard-coded hex/rgb in components
- new one-off wrapper components
- broad redesign while tokenizing

## Verification

Run after each route cleanup:

```bash
npm run typecheck
npm run lint
npm run test:logic
```

Visual QA at minimum:

```bash
npx playwright screenshot --timeout=30000 --viewport-size=390,844 "http://localhost:3000/write" "/tmp/write-mobile.png"
npx playwright screenshot --timeout=30000 --viewport-size=1440,1000 "http://localhost:3000/write" "/tmp/write-desktop.png"
```

Repeat for:

- `/feed`
- `/calendar`
- `/profile`
- `/auth`
- `/moderation`

## Notes For Next Session

Do not claim whole-app token cleanup is complete until the scan output is reviewed and remaining hits are either fixed or explicitly whitelisted.

The fastest next step is route order:

1. `/write`
2. `/calendar`
3. `/profile`
4. `/auth`
5. `/moderation`
6. landing
7. shared chrome/components
