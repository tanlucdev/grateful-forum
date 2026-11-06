---
name: journal-write-native
description: Implement the /write gratitude journal route as native React UI from Stitch references, without iframe/srcDoc wrappers.
---

# Journal Write Native

Use this skill when editing the `app/write` surface in this repo.

- Treat `stitch-artifacts/write/*.html` and `*.png` as the visual reference.
- Rebuild the screen with native React/Tailwind in `app/write/_components/`.
- Keep `app/write/page.tsx` thin.
- Do not use `iframe`, `srcDoc`, or a static HTML wrapper for the shipped route.
- Reuse `public/stitch/*` assets and wire save behavior through the existing journal entry flow.
- Keep the mobile and desktop compositions responsive, but preserve the Stitch layout and copy.

## Controls and focus

- Reuse `components/ui/select` for privacy choices; preserve labels, keyboard navigation, and disabled behavior.
- Each focused control has one visible contour. Never stack a colored border, offset outline, and ring. Text fields use a single border; buttons use an inset outline. Keep the same corner radius on focus.
- A composite field owns its focus indicator on the wrapper; its inner input must not add another. Selected chips must keep their selected state legible during keyboard focus without adding a second contour.
- Check journal fields, optional reflection/location fields, decoration dialogs, sticker search, toolbar controls, and privacy/save actions. Keep targets at least 44px; verify tablet and both locales.
- Keep disclosure triggers separate from their expanded content with an explicit layout gap (at least 8px); check mood chips and location fields while expanded and hovered.
