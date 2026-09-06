---
name: api-route-design
description: Use when adding, changing, or reviewing Next.js route handlers so API routes stay thin, validated, and service-driven.
---

# API Route Design

## Purpose

Standardize Next.js route handlers around a small request pipeline: parse, validate, call service, return response.

## Triggers

Use this skill when work touches:
- `app/**/route.ts`
- API response shape
- request body parsing
- params or search params handling
- route-level error handling
- route handler refactors

## Workflow

1. Parse the request body, params, and search params.
2. Validate all external input.
3. Call exactly the service needed for the endpoint.
4. Return a response with the right status and shape.
5. Keep handler-specific error mapping small and consistent with existing routes.

## Best Practices

- Keep route handlers thin.
- Delegate business behavior to services.
- Delegate database access to repositories through services.
- Use shared validation schemas when the feature already has them.
- Use clear HTTP status codes.
- Keep response DTOs intentional.
- Follow existing error response conventions in the repo.

## Anti-Patterns

- Business logic inside `route.ts`.
- Prisma queries inside `route.ts`.
- External integrations inside `route.ts`.
- Multi-step workflow orchestration inside handlers.
- Hand-rolled validation when a Zod schema should exist.
- Returning raw database records by accident.

## Examples

```ts
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = routeParamsSchema.parse(await params);
  const item = await itemService.getItem(id);
  return Response.json(item);
}
```

```ts
export async function POST(request: Request) {
  const input = createItemSchema.parse(await request.json());
  const item = await itemService.createItem(input);
  return Response.json(item, { status: 201 });
}
```

## Verification Checklist

- Handler parses request input.
- Handler validates request input.
- Handler calls a service.
- Handler returns a response.
- No business logic is in `route.ts`.
- No Prisma query is in `route.ts`.
- No external integration is called directly from `route.ts`.
- Error handling matches nearby routes.
