import { NextResponse } from "next/server";
import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";

export async function GET() {
  const dashboard = await loadOwnProfileDashboard();

  if (!dashboard) {
    return NextResponse.json({ code: "profile_failed", error: "Not signed in." }, { status: 401 });
  }

  return NextResponse.json(dashboard);
}
