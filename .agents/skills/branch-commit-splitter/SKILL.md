---
name: branch-commit-splitter
description: Split a dirty git worktree into clean stacked branches and focused commits, preserving user changes and avoiding destructive history operations.
---

# Branch Commit Splitter

Use this skill when the user asks to divide current work into multiple branches, commits, or a stacked PR topology.

Start by inspecting:
- Current branch, HEAD, remotes, and matching local/remote branch names.
- Dirty, staged, untracked, ignored, and deleted files.
- Existing refs for requested branch names.

Workflow:
- Group files by feature, fix, cleanup, or dependency boundary before committing.
- Prefer stacked branches when later changes depend on earlier files or behavior.
- Create each branch from the intended parent branch.
- Use selective `git add` only. Never commit unrelated changes.
- Never create a requested branch unless it receives a unique commit.
- Verify each created branch tip differs from every other created branch tip.
- Handle branch-name collisions by proposing a suffix before creating replacement branches.

Safety:
- Never use destructive commands such as `git reset --hard` or `git checkout --` unless explicitly requested.
- Ask before deleting files unless the user has already named the exact files to delete in the current task.
- Ask before pushing.
- Do not force-push or rewrite existing branch history unless explicitly requested.

Verification:
- Run the checks requested by the user for each code branch.
- For asset work, verify referenced assets exist.
- Finish with `git diff --check` when any diff remains or before reporting completion.
- Use `git for-each-ref` or equivalent to verify branch tips.

Report:
- Branch name, commit hash, parent branch, checks run, and push status.
- Any files intentionally left uncommitted.
