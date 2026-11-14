# Grateful Forum

Mobile-first gratitude journal MVP built with Next.js App Router and Supabase.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the Supabase and Cloudflare R2 values in `.env.local` and separately in each deployment environment (Preview / Production). Restart the local server or redeploy after changing environment variables. Local `.env` files do not configure the deployed server. Never commit credentials or prefix R2 keys with `NEXT_PUBLIC_`.

## Cloudflare R2 media

New photo uploads and public/anonymous handwriting previews use R2's S3-compatible API. The Next.js app can stay on its current host; no Worker or database migration is required. Existing Cloudinary URLs remain readable and continue using Cloudinary bandwidth until those assets are copied and their stored URLs updated.

1. Create an R2 bucket with the default jurisdiction (or copy the matching jurisdiction endpoint).
2. In R2 **Manage API Tokens**, create an **Account API token** with **Object Read & Write**, scoped to that bucket. Save its **Access Key ID** and **Secret Access Key**; these are S3 credentials, not a Cloudflare bearer token.
3. Under bucket **Settings → Custom Domains**, connect a media domain such as `media.example.com`. Wait for **Active**. This exposes objects publicly, as with the previous Cloudinary delivery URLs. Keep private files outside this bucket. The `r2.dev` Public Development URL is rate-limited and intended for development only.
4. Configure the five server environment variables below, then redeploy. No bucket CORS rule is required: uploads go through the authenticated Next.js server.

| Variable | Value |
| --- | --- |
| `R2_ENDPOINT` | S3 API endpoint from R2, e.g. `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`; jurisdiction suffix if applicable |
| `R2_ACCESS_KEY_ID` | Access Key ID from the R2 token |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key from the R2 token |
| `R2_BUCKET_NAME` | Exact bucket name, e.g. `grateful-media` |
| `R2_PUBLIC_URL` | HTTPS bucket Custom Domain, e.g. `https://media.example.com`; no bucket name or object path |

`CLOUDINARY_*` variables are no longer used for new uploads. Keep the old Cloudinary account/assets available for existing entry URLs. R2 has storage and request charges, with no egress bandwidth charge; see [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

Uploads retain the 5 MB limit and supported image types; object names use generated UUIDs and MIME-derived extensions. Uploads time out after 20 seconds. `media_unavailable` (HTTP 503) means missing/invalid R2 configuration; server logs list only the affected variable names. `media_upload_failed` (HTTP 502) covers storage/network failures. Private handwritten entries do not upload a preview; failed public saves retain the writing on the device.

After deploying, save a public handwritten entry and a photo entry. Confirm their image URLs use your media domain and load without login, then confirm private handwriting still saves without uploading a preview.

### Move existing Cloudinary media

Configure the five R2 variables plus `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the database to migrate. Run locally from the repository root; do not expose the service role key to the browser. Cloudinary credentials are not needed for publicly readable images.

```bash
# Read-only inventory; reports entries and image references without uploading.
npm run migrate:media

# Copy and verify images, then update stored URLs.
npm run migrate:media -- --apply
```

The migration handles `entries.image_url` and `entries.handwriting_preview_url` pointing at `https://res.cloudinary.com/`, including deleted/hidden entries. It uses keyset pages, copies each shared URL once per run, verifies the public R2 download against the original SHA-256, and updates only if the old URL is still unchanged. External image hosts and private handwriting data are untouched. A failure stops the run; original URLs remain for unfinished references, completed updates stay valid, and rerunning processes remaining Cloudinary URLs. An upload whose verification or database update fails can leave an unused R2 object; no source object is deleted.

After migration, rerun the inventory and confirm zero references, then check old photo/handwritten entries in the deployed app. Keep Cloudinary assets until that verification is complete. This migrates referenced journal assets, not unreferenced files in the Cloudinary account or assets served through custom Cloudinary domains.

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
