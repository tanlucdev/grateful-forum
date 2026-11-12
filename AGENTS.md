# Agent Rules

- When a task involves Next.js file structure, page-local components, shared UI, data loaders, or server/client boundaries, read `./.agents/skills/nextjs-project-structure/SKILL.md` before editing.
- When a task asks for Stitch MCP exactness, read `./.agents/skills/stitch-exact/SKILL.md` before editing. If you meant `stitch-exect`, the intended skill is `stitch-exact`.
- When a task edits the `/write` gratitude journal surface, read `./.agents/skills/journal-write-native/SKILL.md` before editing.
- Do not read these skills on unrelated turns.

- Branch names must use one of these prefixes:
  - `feature/` for new features
  - `bugfix/` for bug fixes
  - `hotfix/` for critical bug fixes
  - `refactor/` for code improvements
  - `docs/` for documentation updates
  - `chore/` for maintenance tasks
  - `test/` for adding or modifying tests
- Do not create or push branches with unlisted prefixes such as `polish/`.

- After creating or updating a branch and commit, push it to `https://github.com/tanlucdev/begrateful.git` using the GitHub account `tanlucdev`; do not push with another GitHub identity.
- Before every `git push origin`, verify the GitHub credential owner through `https://api.github.com/user`; continue only when its `login` is exactly `tanlucdev`. Git `user.name` and `user.email` do not prove the pushing account.

## I18n

- New or changed UI requires symmetric `vi/en` catalog keys. Do not add raw user-facing copy.
- Format dates, times, and numbers with the active locale. Keep API contracts and error codes locale-neutral.
- Do not translate user-generated content.
- Before handoff, run catalog parity through `npm run test:logic`, then `npm run typecheck`, `npm run lint`, and `npm run build`.

## Responsive UI

- Treat tablet widths as a separate layout constraint. Do not enable desktop rows at `md` unless all children fit with both `vi/en` labels.
- Prefer CSS flex/grid, `min-w-0`, wrapping, and content-driven sizing. Keep actions readable; move them to another row before squeezing content. Avoid device detection, fixed content heights, and hiding overflow to mask layout bugs.
- User-generated names, bios, and journal text must handle long unbroken strings without widening the page. Only intentional horizontal controls may scroll inside their own container.
- Group controls by purpose: keep content filters together, view-mode controls together. Use deliberate tablet rows instead of allowing unrelated actions to wrap between tabs. Keep summary modules independent of avatar/text columns so they can use the available width.
- Keep interactive targets at least 44×44 CSS pixels; preserve visible keyboard focus.
- Verify affected routes at 320, 390, 768×1024 (iPad Mini), 820, 1024×768, 1280, and 1440 CSS pixels, plus breakpoint boundaries and both locales. Check page overflow, overlapping controls, long content, and empty states. Report any browser verification blockers explicitly.

## Motion

- Use [Motion UI](https://motion-ui.200lab.io/#agents) as the motion reference. When available, use the 200Lab MCP `search` with `types: ["motion"]`, then `get` with `entity: "motion"` to read the full pattern and reduced-motion guidance.
- Reuse `lib/motion.ts` for Motion transitions and `--motion-*` tokens in `app/globals.css` for CSS. Project defaults: feedback 150ms, menus 220ms, panels 300ms, exits 150ms; ease-out `(0.23, 1, 0.32, 1)` for entry, ease-in for exit.
- Animate feedback, state, and spatial continuity. Keep repeated typing and keyboard actions instant. Keep initial above-the-fold content visible.
- Use explicit transition properties; never `transition-all`. Prefer transform and opacity; use grid rows for intrinsic-height disclosure.
- Respect `prefers-reduced-motion` in CSS and JavaScript. Preserve the state change; remove spatial movement and autonomous loops. Loops longer than five seconds need an accessible pause control and must pause offscreen.
