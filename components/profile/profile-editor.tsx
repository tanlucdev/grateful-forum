"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProfileRecord } from "@/lib/profile/types";

type ProfileDraft = {
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
};

export function ProfileEditor({ profile }: Readonly<{ profile: ProfileRecord }>) {
  const [draft, setDraft] = useState<ProfileDraft>({
    displayName: profile.displayName,
    username: profile.username ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    bio: profile.bio ?? "",
  });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function saveProfile() {
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = (await response.json()) as { error?: string };

    setSaving(false);

    if (!response.ok) {
      setStatus(result.error ?? "Could not save profile.");
      return;
    }

    setStatus("Saved.");
    router.refresh();
  }

  const initials = profile.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)]">
          {draft.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="h-full w-full object-cover" src={draft.avatarUrl} />
          ) : (
            <span className="text-sm font-semibold text-[var(--accent)]">
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-sm font-medium text-[var(--text)]" htmlFor="avatarUrl">
            Avatar URL
          </label>
          <div className="mt-2 flex gap-2">
            <input
              className="min-h-11 min-w-0 flex-1 rounded-full border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-[var(--trust)]"
              id="avatarUrl"
              onChange={(event) =>
                setDraft((current) => ({ ...current, avatarUrl: event.target.value }))
              }
              placeholder="https://..."
              value={draft.avatarUrl}
            />
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text)]"
              onClick={saveProfile}
              disabled={saving}
              type="button"
            >
              <Camera className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field
          label="Display name"
          value={draft.displayName}
          onChange={(value) => setDraft((current) => ({ ...current, displayName: value }))}
        />
        <Field
          label="Username"
          value={draft.username}
          onChange={(value) => setDraft((current) => ({ ...current, username: value }))}
        />
      </div>

      <label className="mt-4 block text-sm font-medium text-[var(--text)]" htmlFor="bio">
        Bio
      </label>
      <textarea
        className="mt-2 min-h-28 w-full resize-none rounded-lg border border-[var(--border)] bg-white p-4 text-sm outline-none focus:border-[var(--trust)]"
        id="bio"
        onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
        placeholder="A few words about what keeps you grateful."
        value={draft.bio}
      />

      <p className="mt-3 text-sm text-[var(--muted)]" role="status">
        {status || "Changes save to your profile card."}
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
      <input
        className="mt-2 min-h-11 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-[var(--trust)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </div>
  );
}
