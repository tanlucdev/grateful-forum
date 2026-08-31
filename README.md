# BeGrateful

Mobile-first gratitude journal MVP built with Next.js App Router and Supabase.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the Supabase values in `.env.local` before using auth or database-backed flows.

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
```

## Supabase

Database migrations live in `supabase/migrations`.

Apply them with your Supabase workflow, for example:

```bash
supabase db push
```

Admins are granted by inserting the user id into `public.admin_roles`.
