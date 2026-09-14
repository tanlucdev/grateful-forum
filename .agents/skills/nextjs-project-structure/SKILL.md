---
name: nextjs-project-structure
description: Use when organizing or refactoring this Next.js app's file structure, page-local components, shared UI, data loaders, and server/client boundaries.
---

# Next.js Project Structure

Use this skill when adding or refactoring code in this repo.

Core rules:
- Keep code close to where it is used.
- Prefer page-local `_components/` for one-page-only UI.
- Promote to `components/` only when two or more surfaces reuse it.
- Keep page files thin: fetch data, shape props, compose layout.
- Keep server code on the server; client code only where state, effects, or events exist.
- Do not call `fetch` directly from React components. Put data access in `lib/`.
- Keep shared utilities pure and small.

Placement:
- `app/[route]/page.tsx`: server entry, data loading, composition only.
- `app/[route]/_components/`: page-local React components.
- `components/ui/`: app-wide primitives with no business logic.
- `components/<domain>/`: shared domain components used across multiple routes.
- `lib/`: loaders, API wrappers, transforms, and non-React helpers.
- `types/`: shared DTOs and domain types when they are used in more than one file.

Refactor shape:
- Split by route before splitting by abstraction.
- Move one-page-only chunks next to that route.
- Extract repeated chrome, cards, and controls only after reuse is real.
- Keep each file comfortably below 300 lines.
- Prefer a small number of obvious files over deep helper layers.

Naming:
- Use `Client` suffix for client components.
- Use `Section`, `Card`, `Modal`, `Loader`, or `Skeleton` when the role is clear.
- Use kebab-case folders.
- Keep Next reserved route files as `page.tsx`, `route.ts`, `layout.tsx`, `loading.tsx`, and related App Router names.
- Put component entries in `kebab-case/index.tsx`; keep the exported symbol `PascalCase`.
- Keep non-component modules as `kebab-case.ts`.
- Keep `components/ui/*.tsx` flat for primitive/shadcn-style components.

When the repo already has a working pattern, follow it. Do not introduce `src/`, new global state, or a new abstraction layer unless the current code genuinely needs it.
