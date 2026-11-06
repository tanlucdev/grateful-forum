import { getSticker, type StickerIconKey, type StickerId } from "@/lib/entries/stickers";

type StickerIconProps = {
  id: StickerId | string;
  className?: string;
};

const palettes = {
  sprout: { bg: "#d1e9e0", fg: "#006d43", accent: "#99f3b6" },
  moment: { bg: "#f5e4e7", fg: "#8b3a45", accent: "#f7c6cc" },
  nature: { bg: "#e6eff7", fg: "#2d5f7a", accent: "#b9d9e8" },
  badge: { bg: "#f2ead7", fg: "#7b5d24", accent: "#e8c96b" },
} as const;

const motifs: Record<StickerIconKey, number> = { heart: 0, star: 1, book: 2, tea: 3, coffee: 3, sun: 4, moon: 5, sprout: 6, flower: 7, mountain: 8, cloud: 9, leaf: 10, mail: 11, check: 12, home: 13, music: 14, flag: 15, drop: 16, plant: 17 };

function Motif({ color, variant }: Readonly<{ color: string; variant: number }>) {
  const stroke = { stroke: color, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 2.4 };
  const fill = { fill: "#fff", ...stroke };

  switch (variant) {
    case 0:
      return <path d="M20 30c5-9 10-2 12 2 2-4 7-11 12-2 0 8-8 13-12 16-4-3-12-8-12-16z" {...fill} />;
    case 1:
      return <path d="M32 15l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" {...fill} />;
    case 2:
      return <path d="M19 27c5-3 10-2 13 2 3-4 8-5 13-2v17c-5-3-10-2-13 2-3-4-8-5-13-2z" {...fill} />;
    case 3:
      return <path d="M21 28h22v11a6 6 0 0 1-6 6H27a6 6 0 0 1-6-6zM43 31h4a5 5 0 0 1 0 10h-4M27 20c1.4-3 1.4-5 0-8M35 20c1.4-3 1.4-5 0-8" {...fill} />;
    case 4:
      return <path d="M20 29c5-10 19-10 24 0H20zM32 29v13c0 4 6 4 6 0" {...stroke} />;
    case 5:
      return <path d="M39 17c-7 2-10 11-5 17 3 4 8 5 12 3-6 8-19 4-20-6-1-8 6-14 13-14z" {...fill} />;
    case 6:
      return <path d="M32 18v7M20 39h24M24 31l-5-4M40 31l5-4M24 39a8 8 0 0 1 16 0" {...stroke} />;
    case 7:
      return <path d="M32 33c-8-8 8-8 0 0 8-8 8 8 0 0 8 8-8 8 0 0-8 8-8-8 0 0zM32 36v11" {...fill} />;
    case 8:
      return <path d="M17 44l12-22 7 12 5-8 7 18H17zM20 35h18" {...fill} />;
    case 9:
      return <path d="M22 35c-7 0-6-11 1-11 3-8 16-7 18 2 7-1 9 9 2 9H22zM20 43h18M43 43h5" {...fill} />;
    case 10:
      return <path d="M33 47V25M33 31c-10-2-13-12-5-17 8 3 10 12 5 17zM35 35c9-1 12-8 7-13-7 1-10 7-7 13z" {...fill} />;
    case 11:
      return <path d="M20 26h24v17H20zM20 27l12 9 12-9" {...fill} />;
    case 12:
      return <path d="M22 22h20v22H22zM27 33l4 4 8-10" {...fill} />;
    case 13:
      return <path d="M19 33l13-12 13 12M24 31v14h16V31M30 45v-8h4v8" {...fill} />;
    case 14:
      return <path d="M29 20v19a4 4 0 1 1-3-3h3M38 18v17a4 4 0 1 1-3-3h3M29 22l9-3" {...stroke} />;
    case 15:
      return <path d="M22 42V23l19 7-19 7M22 42h20" {...fill} />;
    case 16:
      return <path d="M38 37c0 7-12 7-12 0 0-5 6-16 6-16s6 11 6 16z" {...fill} />;
    default:
      return <path d="M24 32h17l-3 14H27zM32 32V20M32 26c-7-1-9-7-4-10 5 2 6 7 4 10zM34 29c7-1 9-7 4-10-5 2-6 7-4 10z" {...fill} />;
  }
}

export function StickerIcon({ className = "h-10 w-10", id }: Readonly<StickerIconProps>) {
  const sticker = getSticker(id);
  const group = sticker?.group ?? "sprout";
  const palette = palettes[group];
  const variant = motifs[sticker?.icon ?? "sprout"];

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect fill={palette.bg} height="58" rx="18" width="58" x="3" y="3" />
      <circle cx={46} cy={17} fill={palette.accent} opacity="0.75" r="7" />
      <circle cx={18} cy={48} fill="#fff" opacity="0.7" r="4" />
      <Motif color={palette.fg} variant={variant} />
    </svg>
  );
}
