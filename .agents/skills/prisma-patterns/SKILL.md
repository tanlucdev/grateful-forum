---
name: prisma-patterns
description: Use when adding, changing, or reviewing Prisma queries so database access stays isolated, explicit, reusable, and efficient.
---

# Prisma Patterns

## Purpose

Enforce maintainable Prisma usage through repository-only access, explicit query shapes, reusable query code, and predictable performance.

## Triggers

Use this skill when work touches:
- Prisma queries
- repository files
- database reads or writes
- relation loading
- transactions
- duplicated query logic
- performance issues caused by database access

## Workflow

1. Locate the repository for the feature.
2. Keep Prisma imports and client calls inside repositories only.
3. Define the exact data shape with `select` or `include`.
4. Check whether relation loading can cause N+1 queries.
5. Wrap multi-write operations in a transaction.
6. Reuse existing repository queries before creating new ones.
7. Keep query logic named around domain intent, not transport details.

## Best Practices

- Use Prisma only inside repositories.
- Use explicit `select` or `include`.
- Prefer narrow result shapes for API responses.
- Use transactions for multi-write operations.
- Keep queries reusable inside the feature repository.
- Centralize repeated query fragments when duplication is real.
- Make pagination, sorting, and filtering explicit.
- Return domain-ready data from repositories.

## Anti-Patterns

- Prisma calls in route handlers.
- Prisma calls in React components.
- Unbounded `findMany()` on user-facing paths.
- Implicitly returning full rows when only a few fields are needed.
- Looped queries that create N+1 behavior.
- Duplicated query logic across services or handlers.
- Transactions omitted from operations that must commit or fail together.

## Examples

```ts
export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      total: true,
      customer: { select: { id: true, name: true } },
    },
  });
}
```

```ts
export async function createOrderWithItems(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: input.order });
    await tx.orderItem.createMany({ data: input.items.map((item) => ({ ...item, orderId: order.id })) });
    return order;
  });
}
```

## Verification Checklist

- Prisma appears only in repositories.
- Every query has explicit `select` or `include`.
- User-facing list queries are bounded.
- N+1 query paths are avoided.
- Multi-write operations use transactions.
- Repeated query logic is reused or centralized.
- Repository method names describe domain intent.
