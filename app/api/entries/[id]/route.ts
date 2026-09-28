import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { softDeleteOwnEntry, updateOwnEntryVisibility } from "@/lib/entries/mutations";
import { entryRouteParamsSchema, updateEntryRequestSchema } from "@/lib/entries/schema";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = entryRouteParamsSchema.parse(await params);
    const input = updateEntryRequestSchema.parse(await request.json());
    const auth = await requireUser();
    if (auth.response) return auth.response;

    const entry = await updateOwnEntryVisibility(auth.supabase, id, auth.userId, input.visibility);
    if (!entry) return notFound();
    return NextResponse.json({ entry });
  } catch (error) {
    return entryError(error, "Could not update entry.");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = entryRouteParamsSchema.parse(await params);
    const auth = await requireUser();
    if (auth.response) return auth.response;

    const entry = await softDeleteOwnEntry(auth.supabase, id, auth.userId);
    if (!entry) return notFound();
    return NextResponse.json({ saved: true });
  } catch (error) {
    return entryError(error, "Could not delete entry.");
  }
}

async function requireUser() {
  if (!hasSupabaseEnv()) {
    return { response: NextResponse.json({ code: "entry_failed", error: "Entries are unavailable." }, { status: 503 }) };
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return { response: NextResponse.json({ code: "entry_failed", error: "Not signed in." }, { status: 401 }) };
  }

  return { supabase, userId: data.user.id };
}

function notFound() {
  return NextResponse.json({ code: "entry_failed", error: "Entry not found." }, { status: 404 });
}

function entryError(error: unknown, fallback: string) {
  if (error instanceof SyntaxError || error instanceof ZodError) {
    return NextResponse.json({ code: "entry_failed", error: "Invalid entry." }, { status: 400 });
  }

  return NextResponse.json({ code: "entry_failed", error: error instanceof Error ? error.message : fallback }, { status: 500 });
}
