import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { uploadEntryMedia } from "@/lib/entry-media/mutations";
import { entryMediaFormSchema } from "@/lib/entry-media/validation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { file } = entryMediaFormSchema.parse({ file: formData.get("file") });
    const media = await uploadEntryMedia(file);
    return NextResponse.json({ uploaded: true, ...media });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ code: "invalid_image", error: "Invalid image." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Could not upload image.";
    const status = message === "Missing Cloudinary environment variables." ? 503 : message === "Invalid image." ? 400 : 502;
    return NextResponse.json({ code: status === 503 ? "media_unavailable" : status === 400 ? "invalid_image" : "media_upload_failed", error: message }, { status });
  }
}
