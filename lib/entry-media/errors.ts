export const mediaErrorCodes = ["invalid_media", "media_unavailable", "media_upload_failed"] as const;

export type MediaErrorCode = (typeof mediaErrorCodes)[number];

const mediaErrorDetails: Record<MediaErrorCode, { message: string; status: number }> = {
  invalid_media: { message: "Invalid media.", status: 400 },
  media_unavailable: { message: "Media uploads are unavailable.", status: 503 },
  media_upload_failed: { message: "Could not upload media.", status: 502 },
};

export class MediaError extends Error {
  readonly code: MediaErrorCode;
  readonly status: number;

  constructor(code: MediaErrorCode) {
    super(mediaErrorDetails[code].message);
    this.name = "MediaError";
    this.code = code;
    this.status = mediaErrorDetails[code].status;
  }
}

export function mediaFailure(error: unknown) {
  if (!(error instanceof MediaError)) return null;
  return { code: error.code, error: error.message, status: error.status };
}
