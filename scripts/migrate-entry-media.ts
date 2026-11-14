import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { migrateEntryMedia } from "../lib/entry-media/migration.ts";

nextEnv.loadEnvConfig(process.cwd());
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--apply") || args.length > 1) throw new Error("Usage: npm run migrate:media -- [--apply]");
const env = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
}).parse(process.env);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const apply = args.includes("--apply");
try {
  console.log(apply ? "Copying Cloudinary media to R2; originals retained." : "Dry run: no uploads or database changes.");
  console.log(await migrateEntryMedia(supabase, apply));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Media migration failed.");
  console.error("Stopped. Completed URL updates remain; rerun to process remaining Cloudinary URLs.");
  process.exitCode = 1;
}
