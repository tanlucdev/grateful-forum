import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { uploadEntryMedia } from "@/lib/entry-media/mutations";

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ uploaded: false, reason: "supabase-unconfigured" });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid image." }, { status: 400 });
  }

  try {
    const media = await uploadEntryMedia(file);
    return NextResponse.json({ uploaded: true, ...media });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload image." }, { status: 400 });
  }
}
