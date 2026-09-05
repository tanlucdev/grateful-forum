"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { ProfileView } from "./profile-view";

export function ProfileAvatarMenu({ view }: Readonly<{ view: ProfileView }>) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu tài khoản"
        className="flex items-center justify-center rounded-full p-0.5 ring-2 ring-[#006d43]/20 transition-all hover:ring-[#006d43]/40"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Avatar className="h-8 w-8" src={view.avatarDesktop} />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-[60] mt-2 w-72 rounded-2xl border border-[#e3eae7]/60 bg-[#ffffff] p-3 text-[#161d1b] shadow-xl">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#eef5f2] p-2.5">
            <Avatar className="h-10 w-10 ring-2 ring-[#006d43]/20" src={view.avatarDesktop} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold leading-5">{view.displayName}</span>
                <span className="rounded-full bg-[#99f3b6] px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#0b7141]">
                  Tâm Hồn An Yên
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-[#3d4a41]">{view.email}</p>
            </div>
          </div>
          <div className="space-y-0.5 text-sm">
            <MenuItem active icon="person" label="Hồ sơ của tôi" />
            <MenuItem badge="Cấp 2" icon="potted_plant" label="Vườn ươm Bé Mầm" />
            <MenuItem icon="military_tech" label="Bộ sưu tập huy hiệu & cột mốc" />
            <MenuItem icon="settings" label="Cài đặt & Quyền riêng tư" />
          </div>
          <div className="my-2 border-t border-[#e8efec]" />
          <button
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/30"
            type="button"
          >
            <MaterialSymbol className="text-lg" name="logout" />
            <span>Đăng xuất</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  active = false,
  badge,
  icon,
  label,
}: Readonly<{ active?: boolean; badge?: string; icon: string; label: string }>) {
  return (
    <button
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-colors ${active ? "bg-[#006d43]/10 font-medium text-[#006d43]" : "text-[#3d4a41] hover:bg-[#eef5f2] hover:text-[#161d1b]"}`}
      type="button"
    >
      <MaterialSymbol className="text-lg" fill={active && icon === "person"} name={icon} />
      <span>{label}</span>
      {badge ? (
        <span className="ml-auto rounded-full bg-[#99f3b6] px-2 py-0.5 text-[10px] font-semibold leading-none text-[#00522d]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function Avatar({ className, src }: Readonly<{ className: string; src: string }>) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 rounded-full bg-[#e8efec] bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
