export type ModerationAction = "review" | "dismiss" | "hide" | "delete";

export type ModerationReport = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  entryId: string;
  entry: {
    id: string;
    content: string;
    visibility: string;
    hiddenAt: string | null;
  } | null;
};

export type UpdateModerationReportRequest = {
  action: ModerationAction;
  entryId?: string;
  reportId: string;
};
