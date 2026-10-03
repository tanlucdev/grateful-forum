import { NextResponse } from "next/server";
import { MediaError, mediaFailure } from "@/lib/entry-media/errors";
import { uploadEntryMedia } from "@/lib/entry-media/mutations";
import { parseEntryMediaFile } from "@/lib/entry-media/validation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => { throw new MediaError("invalid_media"); });
    const file = parseEntryMediaFile(formData.get("file"));
    const media = await uploadEntryMedia(file);
    return NextResponse.json({ uploaded: true, ...media });
  } catch (error) {
    const failure = mediaFailure(error) ?? { code: "invalid_media", error: "Invalid media.", status: 400 };
    return NextResponse.json({ code: failure.code, error: failure.error }, { status: failure.status });
  }
}
