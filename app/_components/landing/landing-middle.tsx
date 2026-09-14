"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { MaterialSymbol } from "@/components/ui/material-symbol";

import { calendarDays } from "./landing-data";
import { CardFooter, CardTop, LiftCard, Metric, ProgressBar, ProgressBlock, Reveal, SectionHeader, softPress, tapLift, useLandingReducedMotion } from "./motion-primitives";

export function ChoiceSection() {
  return (
    <Reveal>
      <section className="w-full scroll-mt-24 py-16 lg:scroll-mt-28" id="private-public">
        <div className="mx-auto max-w-md px-4 lg:max-w-7xl lg:px-margin-desktop">
          <SectionHeader copy="Mỗi lời biết ơn đều có thể bắt đầu từ một khoảnh khắc riêng, rồi trở thành động lực cho người khác khi bạn sẵn sàng chia sẻ." eyebrow="Bạn luôn chọn cách tham gia" title="Chia sẻ với cộng đồng hoặc giữ riêng cho mình" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
            <LiftCard className="border-2 border-primary/25">
              <CardTop icon="auto_stories" iconClass="text-[26px]" status="Riêng tư" statusClass="bg-gradient-to-r from-primary to-[#059669] text-on-primary" statusIcon="lock">
                <h3 className="mb-2 text-xl font-bold text-text-deep">Viết cho riêng mình</h3>
                <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">Ghi lại điều bạn trân trọng mà không cần chia sẻ. Những bài viết riêng vẫn được lưu để bạn xem lại hành trình của mình bất cứ lúc nào.</p>
                <ProgressBlock label="Lịch sử cá nhân" progress={1} value="Xem lại bất cứ lúc nào" />
                <CardFooter copy="Bạn kiểm soát nơi bài viết xuất hiện" icon="lock" />
              </CardTop>
            </LiftCard>
            <LiftCard className="landing-zen-glass-amber border-2 border-transparent hover:border-amber-200/80">
              <CardTop icon="public" iconClass="text-[26px]" status="Cộng đồng" statusClass="border border-amber-200/60 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900" statusIcon="volunteer_activism">
                <h3 className="mb-2 text-xl font-bold text-text-deep">Đăng để lan tỏa</h3>
                <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">Chia sẻ công khai hoặc ẩn danh để người khác đọc, đồng cảm và tìm thấy một điều tích cực cho ngày của họ.</p>
                <div className="mb-4 rounded-2xl border border-amber-100/80 bg-white/90 p-4 shadow-inner">
                  <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-bold text-text-deep">Cách cộng đồng hồi đáp:</span>
                    <span className="rounded-md bg-accent-mint/60 px-2 py-0.5 text-xs font-bold text-primary">Đồng cảm & Gửi lời cảm ơn</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="rounded-lg bg-surface-white px-2.5 py-1 shadow-xs">Đồng cảm</span>
                    <span className="rounded-lg bg-surface-white px-2.5 py-1 shadow-xs">Gửi lời cảm ơn</span>
                  </div>
                </div>
                <CardFooter copy="Có thể chia sẻ ẩn danh" icon="visibility_off" textClass="text-secondary" />
              </CardTop>
            </LiftCard>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function GardenSection() {
  const [selectedDay, setSelectedDay] = useState(16);
  const reduceMotion = useLandingReducedMotion();
  return (
    <Reveal>
      <section className="w-full scroll-mt-24 py-16 lg:scroll-mt-28 lg:py-24" id="garden-spotlight">
        <div className="mx-auto max-w-md px-4 lg:max-w-7xl lg:px-margin-desktop">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-text-deep sm:text-3xl lg:text-4xl">Theo dõi nhịp thực hành của bạn</h2>
              <p className="max-w-xl text-sm text-on-surface-variant sm:text-base">Xem bạn đã viết lời biết ơn trong tuần và tháng ra sao, rồi dễ dàng mở lại từng ngày đã lưu.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Metric icon="🔥" title="Tuần này" value="Nhịp viết của bạn" />
              <Metric icon="💧" title="Tháng này" value="Nhìn lại hành trình" />
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="landing-zen-glass-card rounded-3xl p-4 lg:col-span-7 lg:p-8">
              <div className="mb-5 flex items-center justify-between border-b border-surface-container pb-4">
                <div>
                  <span className="block text-lg font-bold text-text-deep">Lịch thực hành</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-primary">Theo dõi nhịp viết theo từng ngày</span>
                </div>
                <div className="flex gap-2">
                  <motion.button className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-100 bg-white/80 text-on-surface hover:bg-emerald-50" type="button" {...softPress(Boolean(reduceMotion))}>
                    <MaterialSymbol className="text-[18px]" name="chevron_left" />
                  </motion.button>
                  <motion.button className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-100 bg-white/80 text-on-surface hover:bg-emerald-50" type="button" {...softPress(Boolean(reduceMotion))}>
                    <MaterialSymbol className="text-[18px]" name="chevron_right" />
                  </motion.button>
                </div>
              </div>
              <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-emerald-100/60 bg-gradient-to-r from-emerald-50/80 to-amber-50/80 p-3.5 shadow-xs">
                <span className="shrink-0 text-xs font-bold text-text-deep">Nhịp tháng: <strong className="text-sm text-primary">Đang duy trì</strong></span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-white shadow-inner"><ProgressBar className="bg-gradient-to-r from-gradient-start to-gradient-end" value={0.84} /></div>
              </div>
              <div className="mb-2.5 grid grid-cols-7 text-center text-xs font-bold text-on-surface-variant">{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span key={day}>{day}</span>)}</div>
              <div className="mb-6 grid grid-cols-7 gap-2">
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-container-low/30 text-xs opacity-30">29</div>
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-container-low/30 text-xs opacity-30">30</div>
                {calendarDays.map((day) => <CalendarDayButton day={day} key={day} selected={selectedDay === day} setSelectedDay={setSelectedDay} />)}
              </div>
              <div className="flex flex-wrap items-center justify-between border-t border-surface-container pt-4 text-xs text-on-surface-variant">
                <div className="flex gap-3"><span>🌱 Đã viết</span><span>🌷 Viết thêm</span><span className="font-bold text-primary">🌸 Ngày trọn vẹn</span></div>
                <span className="font-semibold text-primary">Chạm ngày để xem lại</span>
              </div>
            </div>
            <GardenDetail selectedDay={selectedDay} />
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function CalendarDayButton({ day, selected, setSelectedDay }: Readonly<{ day: number; selected: boolean; setSelectedDay: (day: number) => void }>) {
  const reduceMotion = useLandingReducedMotion();

  return (
    <motion.button className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-xs transition duration-150 ${selected ? "bg-gradient-to-br from-primary to-[#059669] text-on-primary shadow-[0_6px_18px_rgba(0,109,67,0.35)] ring-4 ring-primary-fixed" : day < 17 ? "border border-emerald-200 bg-[#d1fae5]/80 text-text-deep shadow-xs" : "border border-dashed border-emerald-300/60 bg-white/70 text-on-surface-variant"}`} onClick={() => setSelectedDay(day)} type="button" {...tapLift(Boolean(reduceMotion))}>
      <span>{day % 5 === 3 ? "🌷" : day < 17 ? "🌸" : day === 17 ? "Chờ" : ""}</span>
      <span className="mt-0.5 text-[10px] font-bold">{day}</span>
    </motion.button>
  );
}

function GardenDetail({ selectedDay }: Readonly<{ selectedDay: number }>) {
  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      <div className="landing-zen-glass-card rounded-3xl border-2 border-primary/20 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-primary">Ngày {selectedDay} Tháng 10 {selectedDay === 16 ? "(Hôm nay)" : ""}</span>
          <span className="flex items-center gap-1 rounded-lg bg-surface-container-low px-2 py-0.5 text-xs font-bold text-primary"><MaterialSymbol className="text-[13px]" name="lock" /> Riêng tư</span>
        </div>
        <h3 className="mb-3 text-lg font-bold text-text-deep">Lời biết ơn trong ngày</h3>
        <div className="mb-5 space-y-2.5">
          {["Biết ơn tách trà hoa cúc nóng ấm và không khí se mát sớm mai.", "Cảm ơn người bạn thân đã chủ động gọi điện hỏi thăm động viên.", "Biết ơn bản thân đã kịp dừng lại nghỉ ngơi khi thấy lòng mỏi mệt."].map((item, index) => (
            <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-100/60 bg-white/80 p-3 text-xs leading-relaxed text-text-deep shadow-xs" key={item}><span className="shrink-0 text-base">{["🌱", "🌷", "🌸"][index]}</span><span>{item}</span></div>
          ))}
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-gradient-to-r from-emerald-100/50 to-teal-50/50 p-4 shadow-xs">
          <div className="landing-mascot-breathe flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9cf5c0] to-[#6ee7b7] text-sm shadow-xs">🌱</div>
          <div><span className="block text-xs font-bold text-primary">Lời nhắn từ Bé Mầm:</span><p className="mt-0.5 text-xs italic leading-snug text-text-deep">&ldquo;Khu vườn của bạn hôm nay thơm ngát lắm. Hãy ôm lấy chính mình nhé!&rdquo;</p></div>
        </div>
      </div>
      <div className="landing-zen-glass-card flex items-center justify-between rounded-2xl p-4">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-lg shadow-xs">🏆</div><div><span className="block text-xs font-bold text-text-deep">Huy hiệu đang theo dõi</span><span className="text-[11px] text-on-surface-variant">Duy trì thói quen viết lời biết ơn</span></div></div>
        <span className="rounded-xl bg-primary-fixed/30 px-2.5 py-1 text-xs font-bold text-primary">Đang mở</span>
      </div>
    </div>
  );
}
