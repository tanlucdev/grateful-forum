"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";

type LayoutMode = "grid" | "list";

export function MomentsTab({ layout: _layout }: Readonly<{ layout: LayoutMode }>) {
  return (
    <div className="rounded-xl bg-card p-8 text-center shadow-sm" data-layout={_layout}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary">
        <MaterialSymbol fill name="photo_library" />
      </div>
      <h3 className="text-lg font-semibold leading-7 text-foreground">Chưa có khoảnh khắc</h3>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">Ảnh từ nhật ký của bạn sẽ xuất hiện ở đây.</p>
    </div>
  );
}
