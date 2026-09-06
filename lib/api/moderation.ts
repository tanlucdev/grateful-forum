import type { UpdateModerationReportRequest } from "@/lib/moderation/dto";
import { fetchJson } from "./fetch-json";

export function updateModerationReport(input: UpdateModerationReportRequest) {
  return fetchJson<{ saved: boolean }>(
    "/api/moderation",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    "Could not update moderation report.",
  );
}
