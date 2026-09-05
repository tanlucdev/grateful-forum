---
name: code-review
description: Use before completing generated code or when asked for review so issues are actionable across architecture, maintainability, backend, performance, and security.
---

# Code Review

## Purpose

Review generated code before completion and output actionable improvements.

## Triggers

Use this skill when:
- finishing generated code
- reviewing a diff
- the user asks for a review, audit, or critique
- backend architecture changed
- route handlers, services, repositories, validation, or Prisma usage changed

## Workflow

1. Inspect the changed files and relevant neighboring patterns.
2. Check architecture first, then maintainability, backend layering, performance, and security.
3. Prioritize concrete bugs, regressions, and risks over style.
4. Provide actionable improvements with file and line references where possible.
5. If no issues are found, say so and note residual test gaps or risk.

## Best Practices

- Lead with findings.
- Order findings by severity.
- Tie each finding to a specific file and line when possible.
- Explain the user-visible or operational impact.
- Suggest the smallest practical fix.
- Verify generated code against the requested architecture rules before final response.

## Anti-Patterns

- Summarizing before listing important findings.
- Reporting vague preferences without impact.
- Treating formatting-only comments as high priority.
- Ignoring missing validation, authorization, or secret handling.
- Approving code that bypasses service or repository layers.
- Claiming tests passed without running them.

## Examples

```text
Finding: app/api/orders/route.ts:18 imports Prisma directly.
Impact: The route handler now owns data access, bypassing service and repository boundaries.
Fix: Move the query into features/orders/repositories/order-repository.ts and call it through orderService.
```

```text
Finding: features/posts/services/post-service.ts:42 accepts raw form data.
Impact: Invalid input can reach business logic.
Fix: Parse with the feature Zod schema before invoking the service, or make the service accept a parsed DTO only.
```

## Verification Checklist

Architecture:
- Correct feature boundary.
- Correct layer.

Maintainability:
- Naming is clear.
- Duplication is avoided.
- File size remains reasonable.

Backend:
- Services own business logic.
- Repositories own database access.

Performance:
- Unnecessary queries are removed.
- Unnecessary re-renders are avoided.

Security:
- External input is validated.
- Authorization is checked where needed.
- Secrets are not exposed or logged.
