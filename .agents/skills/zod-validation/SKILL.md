---
name: zod-validation
description: Use when handling external input in Next.js routes, Server Actions, forms, params, or search params so validation is consistent and explicit.
---

# Zod Validation

## Purpose

Validate all external inputs consistently with Zod before data reaches business logic or database code.

## Triggers

Use this skill when work touches:
- request bodies
- route params
- search params
- Server Action inputs
- form submissions
- webhook payloads
- external API payloads
- any user-controlled value

## Workflow

1. Identify every external input crossing the trust boundary.
2. Create or reuse a Zod schema near the feature.
3. Validate request body, params, search params, or Server Action input before service calls.
4. Pass parsed values forward instead of raw input.
5. Convert validation failures into the repo's existing error response pattern.

## Best Practices

- Use Zod consistently.
- Validate request body.
- Validate params.
- Validate search params.
- Validate Server Action inputs.
- Never trust user input.
- Prefer typed parsed values from schemas.
- Keep schemas named around domain intent.
- Use coercion intentionally for URL-derived values.

## Anti-Patterns

- Passing raw `request.json()` data into services.
- Trusting params because they come from the framework.
- Trusting search params because they look optional.
- Duplicating inline validation logic across handlers.
- Using TypeScript types as runtime validation.
- Coercing values silently without bounds or allowed values.

## Examples

```ts
const createPostSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1),
});
```

```ts
const listPostsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().trim().max(80).optional(),
});
```

```ts
const input = createPostSchema.parse(await request.json());
await postService.createPost(input);
```

## Verification Checklist

- Request body is validated.
- Params are validated.
- Search params are validated.
- Server Action inputs are validated.
- Parsed values, not raw values, reach services.
- Validation errors are handled consistently.
- Zod schemas cover required bounds and allowed values.
