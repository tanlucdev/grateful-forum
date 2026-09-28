import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeAuthErrorCode } from "@/lib/auth/errors";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const bodySchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { code: "auth_unconfigured", error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { code: "auth_invalid_input", error: "Thông tin đăng ký chưa hợp lệ." },
      { status: 400 },
    );
  }

  let supabase: ReturnType<typeof createSupabaseAdminClient>;

  try {
    supabase = createSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      { code: "auth_unconfigured", error: "Supabase service role chưa được cấu hình." },
      { status: 503 },
    );
  }

  const { error } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { display_name: parsed.data.displayName },
  });

  if (error) {
    return NextResponse.json(
      { code: normalizeAuthErrorCode(error.message), error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ created: true }, { status: 201 });
}
