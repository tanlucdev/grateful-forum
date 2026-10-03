# Grateful Forum

Mobile-first gratitude journal MVP built with Next.js App Router and Supabase.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the Supabase and Cloudinary values in `.env.local` before using auth, database-backed flows, or image uploads. Configure the same three `CLOUDINARY_*` variables separately for Preview and Production in the deployment provider; never commit real values.

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
