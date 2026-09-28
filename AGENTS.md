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

## I18n

- New or changed UI requires symmetric `vi/en` catalog keys. Do not add raw user-facing copy.
- Format dates, times, and numbers with the active locale. Keep API contracts and error codes locale-neutral.
- Do not translate user-generated content.
- Before handoff, run catalog parity through `npm run test:logic`, then `npm run typecheck`, `npm run lint`, and `npm run build`.
