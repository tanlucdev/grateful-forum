---
name: backend-architecture
description: Use when adding, changing, or reviewing backend code in this Next.js app so feature modules stay clean, layered, and scalable.
---

# Backend Architecture

## Purpose

Maintain clean, scalable Next.js backend architecture with feature-based boundaries and thin framework entry points.

## Triggers

Use this skill when work touches:
- `app/**/route.ts`
- Server Actions
- services
- repositories
- Prisma-backed data flows
- backend feature structure
- business rules or domain workflows

## Workflow

Follow this backend flow:

```text
Route Handler
↓
Validation
↓
Service
↓
Repository
↓
Database
```

1. Identify the feature boundary before adding files.
2. Keep the route handler limited to request parsing, validation, service invocation, and response shaping.
3. Put business logic, orchestration, authorization decisions, and external workflow decisions in services.
4. Put all database access in repositories.
5. Keep modules cohesive and small.
6. Review dependencies so outer layers depend inward on domain/service contracts, not directly on storage details.

## Best Practices

- Use feature-based architecture.
- Keep route handlers thin.
- Put business logic in services.
- Put database access in repositories.
- Follow SOLID principles where they reduce real coupling.
- Prefer composition over inheritance.
- Keep each module focused on one reason to change.
- Reuse existing feature conventions before adding new structure.

## Anti-Patterns

- Prisma access from route handlers.
- Prisma access from React components.
- Business logic embedded in `route.ts`.
- Route handlers coordinating multi-step workflows directly.
- Shared dumping-ground folders with unrelated helpers.
- Inheritance trees for simple composition problems.
- One-off abstractions created before a second use exists.

## Examples

```text
features/orders/
  services/order-service.ts
  repositories/order-repository.ts
  validation/order-schemas.ts
```

```ts
// app/api/orders/route.ts
export async function POST(request: Request) {
  const body = createOrderSchema.parse(await request.json());
  const order = await orderService.createOrder(body);
  return Response.json(order, { status: 201 });
}
```

```ts
// features/orders/services/order-service.ts
export async function createOrder(input: CreateOrderInput) {
  return orderRepository.create(input);
}
```

## Verification Checklist

- Feature boundary is clear.
- Route handlers are thin.
- Validation happens before service calls.
- Business logic lives in services.
- Database access lives in repositories.
- No Prisma import appears in route handlers.
- No Prisma import appears in React components.
- Modules are cohesive and small.
- Composition is used instead of inheritance unless inheritance is already justified.
