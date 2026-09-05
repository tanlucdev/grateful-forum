"use client";

import Image from "next/image";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { moments } from "./profile-desktop-tab-data";

type LayoutMode = "grid" | "list";

export function MomentsTab({ layout }: Readonly<{ layout: LayoutMode }>) {
  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-xl border border-[#eef5f2] bg-white p-6 shadow-sm sm:items-center sm:p-7">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MaterialSymbol className="text-2xl text-[#006d43]" fill name="photo_library" />
            <h3 className="text-xl font-bold leading-7 text-[#161d1b]">Khoảnh Khắc Biết Ơn</h3>
          </div>
          <p className="text-base leading-6 text-[#3d4a41]">
            Những hình ảnh và kỷ niệm nhẹ nhàng đọng lại trong hành trình biết ơn mỗi ngày.
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-xl bg-[#006d43] px-4 py-2.5 text-sm font-semibold leading-5 text-white shadow-sm hover:bg-[#006d3d]" type="button">
          <MaterialSymbol className="text-lg" name="add_photo_alternate" />
          <span>+ Thêm ảnh khoảnh khắc</span>
        </button>
      </section>
      <div className={layout === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"}>
        {moments.map((moment) =>
          layout === "list" ? (
            <MomentListCard moment={moment} key={moment.title} />
          ) : (
            <MomentCard moment={moment} key={moment.title} />
          ),
        )}
      </div>
    </div>
  );
}

function MomentListCard({ moment }: Readonly<{ moment: (typeof moments)[number] }>) {
  return (
    <article className="group flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row">
      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-[#e8efec] sm:w-52">
        <Image alt={moment.title} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 640px) 208px, 100vw" src={moment.image} />
        <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium leading-[14px] shadow-sm backdrop-blur-md ${moment.tone}`}>
          <MaterialSymbol className="text-xs" fill name={moment.icon} />
          <span>{moment.meta}</span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <h4 className="text-xl font-semibold leading-7 text-[#161d1b]">{moment.title}</h4>
            <p className="line-clamp-2 text-base italic leading-6 text-[#3d4a41]">{moment.quote}</p>
          </div>
          <button className="rounded-full p-1 text-[#3d4a41] transition-colors hover:text-[#006d43]" title="Tùy chọn" type="button">
            <MaterialSymbol className="text-base" name="more_horiz" />
          </button>
        </div>
        <div className="flex items-center justify-between border-t border-[#eef5f2] pt-3 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
          <span className="flex items-center gap-1 text-[#a5393e]">
            <MaterialSymbol className="text-base" fill name="favorite" />
            {moment.likes} đồng cảm
          </span>
          <button className="flex items-center gap-1 font-medium text-[#006d43] hover:underline" type="button">
            <MaterialSymbol className="text-base" name="bookmark" />
            Lưu lại
          </button>
        </div>
      </div>
    </article>
  );
}

function MomentCard({ moment }: Readonly<{ moment: (typeof moments)[number] }>) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative h-52 overflow-hidden bg-[#e8efec]">
        <Image alt={moment.title} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw" src={moment.image} />
        <div className="absolute right-3 top-3 flex items-center gap-1">
          <button className="rounded-full bg-white/80 p-1.5 text-[#161d1b] backdrop-blur-md transition-colors hover:text-[#006d43]" title="Tùy chọn" type="button">
            <MaterialSymbol className="text-base" name="more_horiz" />
          </button>
        </div>
        <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium leading-[14px] shadow-sm backdrop-blur-md ${moment.tone}`}>
          <MaterialSymbol className="text-xs" fill name={moment.icon} />
          <span>{moment.meta}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-3 p-5">
        <div className="space-y-1.5">
          <h4 className="text-xl font-semibold leading-7 text-[#161d1b]">{moment.title}</h4>
          <p className="text-base italic leading-6 text-[#3d4a41]">{moment.quote}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#eef5f2] pt-3 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
          <span className="flex items-center gap-1 text-[#a5393e]">
            <MaterialSymbol className="text-base" fill name="favorite" />
            {moment.likes} đồng cảm
          </span>
          <button className="flex items-center gap-1 font-medium text-[#006d43] hover:underline" type="button">
            <MaterialSymbol className="text-base" name="bookmark" />
            Lưu lại
          </button>
        </div>
      </div>
    </article>
  );
}
