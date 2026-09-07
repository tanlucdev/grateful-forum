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
