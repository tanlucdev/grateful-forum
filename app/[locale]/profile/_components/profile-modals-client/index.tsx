"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { updateProfile } from "@/lib/api/profile";
import type { ProfileView } from "../profile-view";

type Draft = {
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
};

export function ProfileEditModalButton({
  variant = "default",
  view,
}: Readonly<{ variant?: "default" | "icon"; view: ProfileView }>) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    displayName: view.displayName,
    username: view.username,
    avatarUrl: view.avatarDesktop,
    bio: view.bio,
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function save() {
    setSaving(true);
    setStatus("");

    try {
      await updateProfile(draft);
      setStatus("Saved.");
      router.refresh();
      setOpen(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  const bioCount = draft.bio.length;

  return (
    <>
      <button
        aria-label="Chỉnh sửa hồ sơ"
        className={
          variant === "icon"
            ? "inline-flex h-[29px] w-[29px] items-center justify-center rounded-full bg-muted text-primary shadow-sm transition-colors hover:bg-input"
            : "inline-flex items-center gap-1.5 rounded-[10px] bg-secondary px-[13px] py-2 text-[10px] font-semibold leading-[13px] text-foreground shadow-sm transition-colors hover:bg-input"
        }
        onClick={() => setOpen(true)}
        type="button"
      >
        <MaterialSymbol className={variant === "icon" ? "text-[13px]" : "text-[12px]"} name={variant === "icon" ? "edit_note" : "tune"} />
        {variant === "icon" ? null : <span>Chỉnh sửa hồ sơ</span>}
      </button>
      {open && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/30 p-3 py-4 backdrop-blur-sm sm:items-center sm:p-6">
              <div aria-hidden="true" className="absolute inset-0 cursor-default" onClick={() => setOpen(false)} role="presentation" />
              <div className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/30 bg-card shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
                <div className="flex items-start justify-between border-b border-border px-6 pb-4 pt-6">
                  <div>
                    <h2 className="flex items-center gap-2 text-[24px] font-semibold leading-8 text-foreground">
                      <MaterialSymbol className="text-2xl text-primary" name="edit_square" />
                      Chỉnh sửa hồ sơ cá nhân
                    </h2>
                    <p className="mt-1 text-[12px] font-medium leading-4 text-muted-foreground">
                      Cập nhật thông tin và tùy chọn hiển thị khu vườn biết ơn của bạn
                    </p>
                  </div>
                  <button
                    aria-label="Đóng"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    <MaterialSymbol className="text-xl" name="close" />
                  </button>
                </div>
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                  <div className="flex flex-col items-center gap-5 rounded-xl border border-border/20 bg-muted/70 p-4 sm:flex-row">
                    <div className="relative shrink-0">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-md">
                        <Avatar className="h-full w-full" src={draft.avatarUrl || view.avatarDesktop} />
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex rounded-full bg-primary p-1 text-primary-foreground shadow-sm ring-2 ring-card">
                        <MaterialSymbol className="text-xs" fill name="eco" />
                      </span>
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-[12px] font-medium leading-4 text-primary-foreground shadow-sm transition-all hover:bg-[var(--leaf-deep)]" type="button">
                          <MaterialSymbol className="text-sm" name="photo_camera" />
                          <span>Thay đổi ảnh</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/30 bg-muted px-3.5 py-1.5 text-[12px] font-medium leading-4 text-foreground transition-all hover:bg-input" type="button">
                          <MaterialSymbol className="text-sm text-primary" name="psychiatry" />
                          <span>Chọn linh vật Mầm khác</span>
                        </button>
                      </div>
                      <p className="text-[11px] font-medium leading-[14px] text-muted-foreground">
                        Định dạng PNG, JPG hoặc Mascot Grateful Forum
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Họ và tên"
                    onChange={(value) => setDraft((current) => ({ ...current, displayName: value }))}
                    value={draft.displayName}
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-semibold leading-5 text-foreground">Danh hiệu tâm hồn</label>
                      <span className="flex items-center gap-1 text-[11px] font-medium leading-[14px] text-primary">
                        <MaterialSymbol className="text-xs" name="verified" />
                        Cấp độ: Mầm Non
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        className="w-full cursor-pointer appearance-none rounded-xl border border-border/40 bg-muted px-4 py-2.5 text-[16px] leading-6 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        value="tam-hon-an-yen"
                        onChange={() => {}}
                      >
                        <option value="tam-hon-an-yen">Tâm Hồn An Yên</option>
                        <option value="nguoi-gieo-hat">Người gieo hạt</option>
                        <option value="trai-tim-tinh-lang">Trái tim tĩnh lặng</option>
                        <option value="mam-xanh-kien-tri">Mầm xanh kiên trì</option>
                      </select>
                      <MaterialSymbol className="pointer-events-none absolute right-3 top-3 text-xl text-muted-foreground" name="expand_more" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-medium leading-[14px] text-muted-foreground">
                      <span>Gợi ý:</span>
                      {["Người gieo hạt", "Trái tim tĩnh lặng", "Mầm xanh kiên trì"].map((item) => (
                        <span className="rounded-md bg-muted px-2 py-0.5 transition-colors hover:bg-input" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-semibold leading-5 text-foreground">Lời giới thiệu (Bio)</label>
                      <span className="text-[11px] leading-[14px] text-muted-foreground">{bioCount}/120</span>
                    </div>
                    <textarea
                      className="min-h-20 w-full resize-none rounded-xl border border-border/40 bg-muted px-4 py-2.5 text-[16px] leading-6 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      maxLength={120}
                      onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
                      rows={3}
                      value={draft.bio}
                    />
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <label className="block text-[14px] font-semibold leading-5 text-foreground">
                      Chế độ riêng tư mặc định
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/40 bg-muted p-3 transition-all hover:bg-input">
                        <input className="mt-0.5 h-4 w-4 accent-primary" name="default_privacy" type="radio" />
                        <div>
                          <div className="flex items-center gap-1.5 text-[12px] font-semibold leading-4 text-foreground">
                            <MaterialSymbol className="text-sm text-muted-foreground" name="lock" />
                            Chỉ mình tôi
                          </div>
                          <p className="mt-0.5 text-[11px] leading-[14px] text-muted-foreground">
                            Riêng tư an toàn cho những suy tư sâu kín
                          </p>
                        </div>
                      </label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-primary bg-primary/5 p-3 transition-all">
                        <input checked className="mt-0.5 h-4 w-4 accent-primary" name="default_privacy" readOnly type="radio" />
                        <div>
                          <div className="flex items-center gap-1.5 text-[12px] font-semibold leading-4 text-primary">
                            <MaterialSymbol className="text-sm" fill name="public" />
                            Công khai lên Feed
                          </div>
                          <p className="mt-0.5 text-[11px] leading-[14px] text-muted-foreground">
                            Lan tỏa an lành và năng lượng biết ơn
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/60 px-6 py-4">
                  <button
                    className="rounded-xl border border-border px-5 py-2.5 text-[14px] font-medium leading-5 text-foreground transition-all hover:bg-input"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[14px] font-medium leading-5 text-primary-foreground shadow-md transition-all hover:bg-[var(--primary-hover)] disabled:opacity-60"
                    disabled={saving}
                    onClick={save}
                    type="button"
                  >
                    <MaterialSymbol className="text-sm" name="check" />
                    <span>{saving ? "Đang lưu" : "Lưu thay đổi"}</span>
                  </button>
                </div>
                {status ? <p className="px-6 pb-4 text-[12px] leading-4 text-muted-foreground">{status}</p> : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function Field({
  label,
  onChange,
  value,
}: Readonly<{ label: string; onChange: (value: string) => void; value: string }>) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[14px] font-semibold leading-5 text-foreground">{label}</label>
      <input
        className="w-full rounded-xl border border-border/40 bg-muted px-4 py-2.5 text-[16px] leading-6 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </div>
  );
}

function Avatar({ className, src }: Readonly<{ className: string; src: string }>) {
  return <span aria-hidden="true" className={`block shrink-0 rounded-full bg-secondary bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${src})` }} />;
}
