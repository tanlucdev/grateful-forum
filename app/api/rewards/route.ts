import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { loadRewardOverview, RewardAuthError, RewardConfigError } from "@/lib/rewards/service";

const querySchema = z.object({}).strict();
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  try {
    querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    return NextResponse.json(await loadRewardOverview(), { headers });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ code: "invalid_query", error: "Rewards accepts no query parameters." }, { status: 400, headers });
    if (error instanceof RewardAuthError) return NextResponse.json({ code: "auth_required", error: "Not signed in." }, { status: 401, headers });
    if (error instanceof RewardConfigError) return NextResponse.json({ code: "rewards_unavailable", error: "Rewards is unavailable." }, { status: 503, headers });
    return NextResponse.json({ code: "rewards_failed", error: "Could not load rewards." }, { status: 500, headers });
  }
}
