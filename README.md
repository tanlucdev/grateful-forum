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

## Google sign-in

1. Create a **Web application** OAuth client in Google Cloud. Configure its consent screen and test users while the app is in testing.
2. Add the callback URL shown in **Supabase → Authentication → Sign In / Providers → Google** to Google's authorized redirect URIs (usually `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Enable Google in Supabase; save the Google client ID and client secret there. Never expose the secret in `NEXT_PUBLIC_*` variables.
4. In **Supabase → Authentication → URL Configuration**, set the production Site URL and allow each app callback URL, including `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback`. Add preview callbacks only for trusted deployments.
5. Open `/vi/auth` or `/en/auth`, choose Google, finish consent. Verify the requested return page, session after reload, guest data migration, cancellation, and provider-disabled errors.

The app reuses the existing Supabase environment variables and PKCE session callback. No additional package or database migration is required.
