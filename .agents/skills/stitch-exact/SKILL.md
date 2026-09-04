---
name: stitch-exact
description: Recreate Stitch MCP screens when pixel fidelity matters more than redesign or component reuse.
---

# Stitch Exact

When a task asks for a Stitch MCP screen to be "exact", "100%", "giống MCP", or similar, treat the downloaded Stitch output as the visual source of truth.

- First fetch `get_screen`, download the hosted HTML and screenshot with `curl -L`, and keep both in the workspace.
- Prefer the smallest implementation that preserves the Stitch DOM/CSS/assets. A static HTML surface, iframe wrapper, or route rewrite is acceptable when exactness is the requirement.
- Do not hand-convert to local components, icon sets, fonts, or rewritten Tailwind unless integration is explicitly more important than fidelity.
- If converting is unavoidable, compare browser screenshots against the Stitch screenshot before calling the work done.
- For responsive requests, verify the shipped route at desktop and mobile widths, not only by reading classes.
